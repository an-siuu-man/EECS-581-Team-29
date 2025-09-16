# api.py
import uuid
from flask import Flask, request, jsonify, make_response

from board import (
    create_board, reveal_cell, toggle_flag, is_win, placed_flag_count, neighbors
)
from bombs import place_mines, compute_numbers

app = Flask(__name__)

# In-memory game store: game_id -> game dict
GAMES = {}

# ---- Config ----
DEFAULT_WIDTH = 10
DEFAULT_HEIGHT = 10

# ---- Helpers ----
def corsify(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"           # for dev; restrict in prod
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,DELETE,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return resp

@app.after_request
def add_cors_headers(resp):
    return corsify(resp)

@app.route("/health", methods=["GET"])
def health():
    return corsify(jsonify({"ok": True}))

def public_view(game):
    """Return a client-safe, serializable board view."""
    board = game["board"]
    reveal_all = (game["status"] != "Playing")
    view_rows = []
    for r in range(game["height"]):
        row = []
        for c in range(game["width"]):
            cell = board[(r, c)]
            if reveal_all or cell["revealed"]:
                if cell["type"] == "b":
                    shown = "B"
                elif cell["type"] == "n":
                    shown = str(cell.get("number", 0))
                else:
                    shown = " "  # empty
            else:
                shown = "F" if cell["flagged"] else "."
            row.append(shown)
        view_rows.append(row)
    return view_rows

def ensure_mines(game, r, c):
    """Place mines lazily on the first reveal, making the first click (and optionally neighbors) safe."""
    if game["mines_placed"]:
        return
    safe = {(r, c)}
    if game["safe_neighbors"]:
        for nn in neighbors(r, c, game["width"], game["height"]):
            safe.add(nn)
    place_mines(game["board"], game["mines"], game["width"], game["height"], forbidden=safe)
    compute_numbers(game["board"], game["width"], game["height"])
    game["mines_placed"] = True

def game_payload(game_id):
    g = GAMES[game_id]
    remaining = g["mines"] - placed_flag_count(g["board"])
    return {
        "game_id": game_id,
        "status": g["status"],                       # "Playing" | "Game Over: Loss" | "Victory"
        "width": g["width"],
        "height": g["height"],
        "mines": g["mines"],
        "remaining_mines": remaining,
        "board": public_view(g),                     # 2D array of ".", "F", " ", "1".."8", "B" (B only when game over)
    }

# ---- Routes ----

@app.route("/games", methods=["POST", "OPTIONS"])
def create_game():
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    data = request.get_json(silent=True) or {}
    width  = int(data.get("width",  DEFAULT_WIDTH))
    height = int(data.get("height", DEFAULT_HEIGHT))
    mines  = int(data.get("mines", 10))            # must be 10..20 per your rules
    safe_neighbors = bool(data.get("safe_neighbors", True))  # first click safe zone includes neighbors

    # Enforce your rules
    if width != 10 or height != 10:
        return corsify(jsonify({"error": "Board must be 10x10"})), 400
    if not (10 <= mines <= 20):
        return corsify(jsonify({"error": "Mines must be between 10 and 20"})), 400

    board = create_board(width, height)
    gid = str(uuid.uuid4())
    GAMES[gid] = {
        "board": board,
        "width": width,
        "height": height,
        "mines": mines,
        "mines_placed": False,       # will place after first reveal
        "status": "Playing",
        "safe_neighbors": safe_neighbors,
    }
    return corsify(jsonify({"game_id": gid, "status": "Playing"})), 201

@app.route("/games/<gid>", methods=["GET", "DELETE", "OPTIONS"])
def game_state(gid):
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404

    if request.method == "DELETE":
        del GAMES[gid]
        return corsify(jsonify({"ok": True}))

    # GET
    return corsify(jsonify(game_payload(gid)))

@app.route("/games/<gid>/reveal", methods=["POST", "OPTIONS"])
def reveal(gid):
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404
    if g["status"] != "Playing":
        return corsify(jsonify(game_payload(gid)))

    data = request.get_json(silent=True) or {}
    try:
        r = int(data["row"])
        c = int(data["col"])
    except Exception:
        return corsify(jsonify({"error": "row and col (0-based) are required"})), 400

    # First click safe (and neighbors if configured)
    ensure_mines(g, r, c)

    res = reveal_cell(g["board"], r, c, g["width"], g["height"])
    if res == "boom":
        g["status"] = "Game Over: Loss"
    elif is_win(g["board"]):
        g["status"] = "Victory"

    return corsify(jsonify(game_payload(gid)))

@app.route("/games/<gid>/flag", methods=["POST", "OPTIONS"])
def flag(gid):
    if request.method == "OPTIONS":
        return corsify(make_response("", 204))

    g = GAMES.get(gid)
    if not g:
        return corsify(jsonify({"error": "game not found"})), 404
    if g["status"] != "Playing":
        return corsify(jsonify(game_payload(gid)))

    data = request.get_json(silent=True) or {}
    try:
        r = int(data["row"])
        c = int(data["col"])
    except Exception:
        return corsify(jsonify({"error": "row and col (0-based) are required"})), 400

    ok = toggle_flag(g["board"], r, c, g["width"], g["height"])
    if not ok:
        return corsify(jsonify({"error": "cannot flag/unflag a revealed cell"})), 400

    return corsify(jsonify(game_payload(gid)))

if __name__ == "__main__":
    # Run on port 8000 to avoid clashing with Next.js 3000
    app.run(host="127.0.0.1", port=8000, debug=True)
