"use client";

import { useEffect, useState } from "react";
import { createGame, getState, reveal, flag, GameState, BoardCell } from "@/lib/api";

type Props = {
  defaultMines?: number;   // 10..20
  safeNeighbors?: boolean; // true = first click protects neighbors too
};

export default function Minesweeper({ defaultMines = 15, safeNeighbors = true }: Props) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Start new game
  const newGame = async (mines = defaultMines) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const g = await createGame(mines, safeNeighbors);
      setGameId(g.game_id);
      const s = await getState(g.game_id);
      setState(s);
    } catch (e: any) {
      setErrorMsg(e.message ?? "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    newGame(defaultMines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReveal = async (r: number, c: number) => {
    if (!gameId || !state || state.status !== "Playing") return;
    try {
      setLoading(true);
      const s = await reveal(gameId, r, c);
      setState(s);
    } catch (e: any) {
      setErrorMsg(e.message ?? "Reveal failed");
    } finally {
      setLoading(false);
    }
  };

  const onFlag = async (r: number, c: number) => {
    if (!gameId || !state || state.status !== "Playing") return;
    try {
      setLoading(true);
      const s = await flag(gameId, r, c);
      setState(s);
    } catch (e: any) {
      setErrorMsg(e.message ?? "Flag failed");
    } finally {
      setLoading(false);
    }
  };

  const renderCell = (cell: BoardCell) => {
    if (cell === ".") return "";
    if (cell === " ") return "";       // empty revealed cell
    return cell;                       // "F", "1".."8", "B"
  };

  const handleCellMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    // Left click: reveal, Right click: flag
    if (e.button === 2) {
      e.preventDefault();
      onFlag(r, c);
    } else if (e.button === 0) {
      onReveal(r, c);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent browser context menu on right click
    e.preventDefault();
  };

  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Minesweepers of the midwest</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-1 rounded bg-gray-100 text-black">
            Status: <strong>{state?.status ?? "..."}</strong>
          </span>
          <span className="text-sm px-2 py-1 rounded bg-gray-100 text-black">
            Remaining: <strong>{state?.remaining_mines ?? "-"}</strong>
          </span>
          <button
            onClick={() => newGame(defaultMines)}
            className="px-3 py-1 rounded bg-black text-white hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            New Game
          </button>
        </div>
      </div>

      {/* Mine selector (10..20) */}
      <div className="flex items-center gap-3">
        <label className="text-sm">Mines:</label>
        <div className="flex gap-2">
          {[10, 12, 15, 18, 20].map((m) => (
            <button
              key={m}
              onClick={() => newGame(m)}
              className="px-3 py-1 rounded border hover:bg-gray-50"
              disabled={loading}
              title={`Start new game with ${m} mines`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {errorMsg}
        </div>
      )}

      {/* Grid */}
      <div
        className="inline-block select-none"
        onContextMenu={handleContextMenu}
        role="grid"
        aria-label="Minesweeper grid"
      >
        {state ? (
          <div className="grid" style={{ gridTemplateColumns: `repeat(${state.width}, 2.25rem)` }}>
            {state.board.map((row, r) =>
              row.map((cell, c) => {
                const isCovered = cell === ".";
                const isFlag = cell === "F";
                const isBomb = cell === "B";
                const content = renderCell(cell);

                // Basic styling; swap to Tailwind utilities if you like
                const base =
                  "w-9 h-9 flex items-center justify-center text-sm font-semibold border rounded";
                const covered = "bg-gray-200 hover:bg-gray-300 cursor-pointer";
                const revealed = "bg-white";
                const bomb = "bg-red-100 text-red-600 border-red-300";
                const flag = "bg-yellow-100 text-yellow-700 border-yellow-300";

                let cls = base + " ";
                if (isCovered) cls += covered;
                else if (isBomb) cls += bomb;
                else if (isFlag) cls += flag; // (flags only appear when covered; kept for completeness)
                else cls += revealed;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    className={cls}
                    onMouseDown={(e) => handleCellMouseDown(e, r, c)}
                    aria-label={`cell ${r},${c}`}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Loading…</div>
        )}
      </div>
    </div>
  );
}
