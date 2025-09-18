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

  // Text color mapping for numbers (no background classes)
  const numberTextColor = (val: string) => {
    switch (val) {
      case "1": return "text-blue-900";       // Dark Blue
      case "2": return "text-green-600";      // Green
      case "3": return "text-red-600";        // Red
      case "4": return "text-purple-700";     // Purple / dark
      case "5": return "text-[#800000]";      // Maroon (custom)
      case "6": return "text-teal-700";       // Teal / dark green
      // Optional:
      // case "7": return "text-gray-800";
      // case "8": return "text-black";
      default:  return "text-black";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <label className="text-sm">Mines:</label>
            <div className="flex gap-2">
              {[10, 12, 15, 18, 20].map((m) => (
                <button
                  key={m}
                  onClick={() => newGame(m)}
                  className={`px-3 py-1 rounded border hover:bg-gray-50`}
                  disabled={loading}
                  title={`Start new game with ${m} mines`}
                >
                  {m}
                </button>
              ))}
            </div>
                      <span className="text-sm px-2 py-1 rounded bg-gray-100 text-black">
            Flags remaining: <strong>{state?.remaining_mines ?? "-"}</strong>
          </span>
        </div>
          <button
            onClick={() => newGame(defaultMines)}
            className="px-3 py-1 rounded bg-black text-white hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            New Game
          </button>
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
          <div
            className="grid bg-gray-100 rounded-xl shadow-lg p-2 border border-gray-300"
            style={{ gridTemplateColumns: `repeat(${state.width}, 2.5rem)` }}
          >
            {state.board.map((row, r) =>
              row.map((cell, c) => {
                const isCovered = cell === ".";
                const isFlag = cell === "F";
                const isBomb = cell === "B";
                const content = renderCell(cell);

                const contentStr = String(content);
                const isNumber = /^[1-8]$/.test(contentStr);

                // Tailwind cell styles
                let cls = "w-10 h-10 flex items-center justify-center text-base font-bold border border-gray-400 rounded-lg transition-all duration-150 outline-none focus:ring-2 focus:ring-blue-400";
                if (isCovered) cls += " bg-gray-200 hover:bg-gray-300 active:bg-gray-400 cursor-pointer";
                else if (isBomb) cls += " bg-red-600 text-white border-red-700 animate-pulse";
                else if (isFlag) cls += " bg-yellow-400 text-black border-yellow-500";
                else cls += " bg-white text-black";

                // Number coloring
                if (!isCovered && !isBomb && !isFlag && isNumber) {
                  cls += " " + numberTextColor(contentStr);
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    className={cls}
                    onMouseDown={(e) => handleCellMouseDown(e, r, c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onReveal(r, c);
                      if (e.key.toLowerCase() === "f") onFlag(r, c);
                    }}
                    tabIndex={0}
                    aria-label={`cell ${r},${c}${isNumber ? ` ${contentStr}` : ""}`}
                  >
                    {contentStr}
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
