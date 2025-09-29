"""
Autor: Aryan Ghorpade, David Sutherland
Date Created: 2024-10-10

Artificial Intelligence (AI) Solver
AI setup: The AI operates on the same board configuration, with turns alternating between player and AI if in interactive mode, or solving automatically.

Easy: AI uncovers cells randomly, avoiding flagged or already uncovered cells.
Medium: AI uncovers randomly until a safe cell is revealed (zero adjacent mines), then uncovers adjacent cells strategically using revealed numbers.
Hard: AI "cheats" by always uncovering a safe cell (non-mine), simulating perfect knowledge without detonating mines.

Last Modified: 2024-10-10
"""


import random
from board import neighbors, reveal_cell

def medium_ai_move(board, width, height):
	# Step 1: Find all unrevealed, unflagged cells
	# These are the cells the AI can safely consider for random moves
	candidates = [(r, c) for r in range(height) for c in range(width)
				  if not board[(r, c)]["revealed"] and not board[(r, c)]["flagged"]] 

	# Step 2: If there are no revealed empty cells, uncover randomly until one is found
	# This ensures the AI starts by finding a safe area to expand from
	revealed_empty = [(r, c) for r in range(height) for c in range(width)
					  if board[(r, c)]["revealed"] and board[(r, c)]["type"] == "e"] 
	if not revealed_empty:
		random.shuffle(candidates) # Randomize order for fairness
		for r, c in candidates:
			result = reveal_cell(board, r, c, width, height) # Try to reveal cell
			if board[(r, c)]["revealed"] and board[(r, c)]["type"] == "e":
				# Found a safe cell (zero adjacent mines)
				return (r, c, "reveal")
			if result == "boom":
				# Hit a mine
				return (r, c, "boom")
		return None

	# Step 3: Use revealed numbers to make strategic moves
	# For each revealed number cell, check if flags match the number
	for r in range(height):
		for c in range(width):
			cell = board[(r, c)]
			if cell["revealed"] and cell["type"] == "n":
				num = cell["number"]
				adj = list(neighbors(r, c, width, height)) # Get adjacent cells
				flagged = [pos for pos in adj if board[pos]["flagged"]]
				unrevealed = [pos for pos in adj if not board[pos]["revealed"] and not board[pos]["flagged"]]
				# If number of flags equals the number, uncover all other adjacent unrevealed cells
				if len(flagged) == num and unrevealed:
					for rr, cc in unrevealed:
						result = reveal_cell(board, rr, cc, width, height)
						if result == "boom":
							# Hit a mine
							return (rr, cc, "boom")
						if board[(rr, cc)]["revealed"]:
							# Successfully revealed a cell
							return (rr, cc, "reveal")
	# If no strategic move found, pick random
	# Fallback: make a random move if no deduction is possible
	if candidates:
		r, c = random.choice(candidates)
		result = reveal_cell(board, r, c, width, height)
		if result == "boom":
			return (r, c, "boom")
		if board[(r, c)]["revealed"]:
			return (r, c, "reveal")
	return None
