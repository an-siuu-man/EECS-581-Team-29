from sound_manager import SoundManager
from board import (
    create_board, print_board, print_status, parse_coord,
    reveal_cell, toggle_flag, is_win, placed_flag_count, neighbors
)
from bombs import place_mines, compute_numbers



WIDTH, HEIGHT = 10, 10


SAFE_FIRST_CLICK_INCLUDES_NEIGHBORS = True  

def get_safe_zone(r, c, width, height):
    safe = {(r, c)}
    if SAFE_FIRST_CLICK_INCLUDES_NEIGHBORS:
        for nn in neighbors(r, c, width, height):
            safe.add(nn)
    return safe

def main():
    board = create_board(WIDTH, HEIGHT)

    while True:
        try:
            mines = int(input("Choose number of mines (10–20): ").strip())
            if 10 <= mines <= 20:
                break
            print("Please enter a number from 10 to 20.")
        except ValueError:
            print("Please enter an integer from 10 to 20.")

    total_mines = mines
    mines_placed = False
    status = "Playing"

    print("\nMinesweeper 10x10")
    sound.play("start")
    print("Commands:")
    print("  r <col><row>  -> reveal (e.g., r B5, r 10A, r A 10)")
    print("  f <col><row>  -> toggle flag (e.g., f C3, f 7J)")
    print("  q             -> quit\n")

    while True:
        print_status(total_mines, placed_flag_count(board), status)
        print_board(board, WIDTH, HEIGHT, reveal_all=(status != "Playing"))

        if status != "Playing":
            break

        cmd = input("Enter command: ").strip().lower()
        if not cmd:
            continue
        if cmd == "q":
            print("Goodbye!")
            return

        parts = cmd.split()
        if parts[0] not in ("r", "f"):
            print("Invalid command. Use 'r <col><row>', 'f <col><row>', or 'q'.")
            continue

        r, c = parse_coord(parts, WIDTH, HEIGHT)
        if r is None or c is None:
            print("Invalid coordinate. Examples: B5, 10A, A 10, 7 J")
            continue

        if not mines_placed and parts[0] == "r":
            safe_zone = get_safe_zone(r, c, WIDTH, HEIGHT)
            place_mines(board, total_mines, WIDTH, HEIGHT, forbidden=safe_zone)
            compute_numbers(board, WIDTH, HEIGHT)
            mines_placed = True

        if parts[0] == "f":
            if not toggle_flag(board, r, c, WIDTH, HEIGHT):
                print("Cannot flag/unflag a revealed cell.")
            else:
                sound.play("flag")
        else:
            if not mines_placed:
                safe_zone = get_safe_zone(r, c, WIDTH, HEIGHT)
                place_mines(board, total_mines, WIDTH, HEIGHT, forbidden=safe_zone)
                compute_numbers(board, WIDTH, HEIGHT)
                mines_placed = True

            result = reveal_cell(board, r, c, WIDTH, HEIGHT)
            if result == "boom":
                status = "Game Over: Loss"
                sound.play("bomb")
            elif is_win(board):
                status = "Victory"
                sound.play("win")

    print_status(total_mines, placed_flag_count(board), status)
    print_board(board, WIDTH, HEIGHT, reveal_all=True)
    if status == "Victory":
        print("🏆 You win! All safe cells revealed.")
    else:
        print("💥 Boom! You hit a mine.")
    print("Thanks for playing!")

'''SoundInitialization'''

sound = SoundManager()
sound.load_sound("start", "backend/sounds/game_start.mp3")
sound.load_sound("flag", "backend/sounds/flag.mp3")
sound.load_sound("bomb", "backend/sounds/explosion.mp3")
sound.load_sound("win", "backend/sounds/victory.mp3")




if __name__ == "__main__":
    main()
