// src/app/page.tsx
import Minesweeper from "@/components/Minesweeper";

export default function Page() {
  return (
    <main className="p-6">
      <Minesweeper defaultMines={15} safeNeighbors={true} />
    </main>
  );
}
