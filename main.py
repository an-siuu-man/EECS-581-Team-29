# --- Configuration ---
WIDTH, HEIGHT = 10, 10

def create_board(width, height):
    return [[{"revealed": False} for _ in range(width)] for _ in range(height)]

def print_board(board):
    # fixed cell width
    cell_width = max(len(str(WIDTH - 1)), 1) + 4  # extra padding

    # --- Column headers ---
    header = " " * (len(str(HEIGHT - 1)) + 3)
    for c in range(WIDTH):
        header += str(c).center(cell_width)
    print(header)

    # --- Rows ---
    for r, row in enumerate(board):
        line = str(r).rjust(len(str(HEIGHT - 1))) + "  "
        for _ in row:
            content = "."
            line += f"[ {content.center(cell_width-4)} ]"
        print(line)
    print()

# --- Run ---
if __name__ == "__main__":
    board = create_board(WIDTH, HEIGHT)
    print_board(board)
