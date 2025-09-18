from collections import deque

def col_letters(width: int):
    return [chr(ord('A') + i) for i in range(width)]  # A..J for width=10

def col_to_index(col_str: str, width: int):
    letters = col_letters(width)
    col_str = col_str.strip().upper()
    if len(col_str) != 1 or col_str not in letters:
        return None
    return ord(col_str) - ord('A')

def parse_coord(parts, width: int, height: int):
    token = "".join(parts[1:]).replace(" ", "")

    if len(token) >= 2:
        if token[0].isalpha() and token[1:].isdigit():
            c = col_to_index(token[0], width)
            r = int(token[1:]) - 1
            if c is not None and 0 <= r < height:
                return (r, c)
        if token[:-1].isdigit() and token[-1].isalpha():
            r = int(token[:-1]) - 1
            c = col_to_index(token[-1], width)
            if c is not None and 0 <= r < height:
                return (r, c)

    if len(parts) == 3:
        a, b = parts[1], parts[2]
        if a.isalpha() and b.isdigit():
            c = col_to_index(a, width)
            r = int(b) - 1
            if c is not None and 0 <= r < height:
                return (r, c)
        if a.isdigit() and b.isalpha():
            r = int(a) - 1
            c = col_to_index(b, width)
            if c is not None and 0 <= r < height:
                return (r, c)
    return (None, None)

def create_board(width: int, height: int):
    board = {}
    for r in range(height):
        for c in range(width):
            board[(r, c)] = {"revealed": False, "flagged": False, "type": "e"}
    return board

def neighbors(r: int, c: int, width: int, height: int):
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            if dr == 0 and dc == 0:
                continue
            rr, cc = r + dr, c + dc
            if 0 <= rr < height and 0 <= cc < width:
                yield rr, cc

def print_status(total_mines: int, flags_placed: int, status: str):
    remaining = total_mines - flags_placed
    print(f"Status: {status} | Mines remaining: {remaining}")

def print_board(board, width: int, height: int, reveal_all: bool = False):
    cell_width = 5
    letters = col_letters(width)
    row_label_width = len(str(height)) + 2

    header = " " * row_label_width
    for c in range(width):
        header += letters[c].center(cell_width)
    print(header)

    for r in range(height):
        line = f"{str(r+1).rjust(len(str(height)))}  "
        for c in range(width):
            cell = board[(r, c)]
            show = reveal_all or cell["revealed"]

            if cell["flagged"] and not reveal_all and not cell["revealed"]:
                content = "F"
            elif not show:
                content = "."
            else:
                t = cell["type"]
                if t == "b":
                    content = "B"
                elif t == "n":
                    content = str(cell.get("number", "?"))
                else:
                    content = " "
            line += f"[{content.center(cell_width-2)}]"
        print(line)
    print()

def flood_reveal(board, start, width: int, height: int):
    q = deque([start])
    visited = set()

    while q:
        r, c = q.popleft()
        if (r, c) in visited:
            continue
        visited.add((r, c))

        cell = board[(r, c)]
        if cell["flagged"]:
            continue
        cell["revealed"] = True

        if cell["type"] == "e":
            for nn in neighbors(r, c, width, height):
                if nn not in visited and not board[nn]["revealed"]:
                    q.append(nn)

def reveal_cell(board, r: int, c: int, width: int, height: int):
    if not (0 <= r < height and 0 <= c < width):
        return "ok"
    cell = board[(r, c)]
    if cell["revealed"]:
        return "already"
    if cell["flagged"]:
        return "already"

    if cell["type"] == "b":
        cell["revealed"] = True
        return "boom"

    if cell["type"] == "e":
        flood_reveal(board, (r, c), width, height)
    else:
        cell["revealed"] = True
    return "ok"

def toggle_flag(board, r: int, c: int, width: int, height: int):
    if not (0 <= r < height and 0 <= c < width):
        return False
    cell = board[(r, c)]
    if cell["revealed"]:
        return False
    cell["flagged"] = not cell["flagged"]
    return True

def is_win(board):
    return all(cell["type"] == "b" or cell["revealed"] for cell in board.values())

def placed_flag_count(board):
        count = 0
        for cell in board.values():
            if cell["flagged"]:
                count += 1
        return count
