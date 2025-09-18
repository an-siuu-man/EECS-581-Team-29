"use client";
import Minesweeper from "@/components/Minesweeper";
import { useState } from "react";
import dynamic from "next/dynamic";
import { GridSizeForm } from "../components/GridSizeForm";
import { start } from "repl";

// const MinesweeperBoard = dynamic(() => import("../components/MinesweeperBoard"), { ssr: false });

export default function Home() {
  const [size, setSize] = useState(10);
  const [mines, setMines] = useState(10);
  const [started, setStarted] = useState(false);

  return (
    <main className="font-inter flex flex-col items-center justify-center min-h-screen w-full gap-8 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <h1 className="font-dm-sans text-4xl sm:text-6xl font-extrabold text-center mb-2 w-full">
          Minesweepers of the Midwest
        </h1>
        <div className="w-full flex justify-center">
          <Minesweeper defaultMines={15} safeNeighbors={true} />
        </div>
      <footer className="w-full mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} EECS 581 Team 29
      </footer>
    </main>
  );
}
