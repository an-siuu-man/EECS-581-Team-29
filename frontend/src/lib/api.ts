// src/lib/api.ts
import { API_BASE } from "./config";

export type BoardCell = "." | "F" | " " | "B" | `${number}`; // "1".."8"
export type GameState = {
  game_id: string;
  status: "Playing" | "Game Over: Loss" | "Victory";
  width: number;
  height: number;
  mines: number;
  remaining_mines: number;
  board: BoardCell[][];
};

export async function createGame(mines = 15, safeNeighbors = true) {
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mines, safe_neighbors: safeNeighbors }),
  });
  if (!res.ok) throw new Error(`Create game failed: ${res.status}`);
  return (await res.json()) as { game_id: string; status: GameState["status"] };
}

export async function getState(gameId: string) {
  const res = await fetch(`${API_BASE}/games/${gameId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Get state failed: ${res.status}`);
  return (await res.json()) as GameState;
}

export async function reveal(gameId: string, row: number, col: number) {
  const res = await fetch(`${API_BASE}/games/${gameId}/reveal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ row, col }),
  });
  if (!res.ok) throw new Error(`Reveal failed: ${res.status}`);
  return (await res.json()) as GameState;
}

export async function flag(gameId: string, row: number, col: number) {
  const res = await fetch(`${API_BASE}/games/${gameId}/flag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ row, col }),
  });
  if (!res.ok) throw new Error(`Flag failed: ${res.status}`);
  return (await res.json()) as GameState;
}
