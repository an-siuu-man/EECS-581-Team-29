import random

def neighbors(r: int, c: int, width: int, height: int):
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            if dr == 0 and dc == 0:
                continue
            rr, cc = r + dr, c + dc
            if 0 <= rr < height and 0 <= cc < width:
                yield rr, cc

def place_mines(board, mines: int, width: int, height: int, forbidden=None):
    if forbidden is None:
        forbidden = set()
    pool = [(r, c) for r in range(height) for c in range(width) if (r, c) not in forbidden]
    if mines > len(pool):
        raise ValueError("Too many mines for available cells given the safe zone.")
    for r, c in random.sample(pool, mines):
        board[(r, c)]["type"] = "b"

def compute_numbers(board, width: int, height: int):
    for r in range(height):
        for c in range(width):
            cell = board[(r, c)]
            if cell["type"] == "b":
                continue
            cnt = sum(1 for (rr, cc) in neighbors(r, c, width, height) if board[(rr, cc)]["type"] == "b")
            if cnt > 0:
                cell["type"] = "n"
                cell["number"] = cnt
            else:
                cell["type"] = "e"
