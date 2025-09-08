# --- Configuration ---
WIDTH, HEIGHT = 10, 10

def make_cell(r, c):
    return {
        "row": r,
        "col": c,
        "is_mine": False,
        "revealed": False,
        "flagged": False,
        "adjacent": 0
    }

def create_board(width, height):
    return [[make_cell(r, c) for c in range(width)] for r in range(height)]

def print_board(board):
    # --- Column headers ---
    header = " " * 4  # left padding
    for c in range(len(board[0])):
        header += str(c).center(3)
    print(header)

    # --- Rows ---
    for r, row in enumerate(board):
        line = str(r).rjust(3) + " "
        for cell in row:
            if cell["flagged"]:
                symbol = "F"
            elif not cell["revealed"]:
                symbol = "."
            elif cell["is_mine"]:
                symbol = "*"
            else:
                symbol = str(cell["adjacent"])
            line += symbol.center(3)
        print(line)
    print()

# --- Run ---
if __name__ == "__main__":
    board = create_board(WIDTH, HEIGHT)
    print_board(board)
