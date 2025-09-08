import React from "react";

interface GridSizeFormProps {
  size: number;
  mines: number;
  setSize: (n: number) => void;
  setMines: (n: number) => void;
  onStart: () => void;
}

export const GridSizeForm: React.FC<GridSizeFormProps> = ({ size, mines, setSize, setMines, onStart }) => {
  return (
    <form
      className="flex grid grid-rows-3 gap-4 items-center justify-center mb-8"
      onSubmit={e => {
        e.preventDefault();
        onStart();
      }}
    >
      <label className="flex gap-4 items-center justify-between text-lg font-semibold">
        Grid Size
        <input
          type="number"
          min={5}
          max={30}
          value={size}
          onChange={e => setSize(Number(e.target.value))}
          className="border rounded px-2 py-1 w-16 text-center"
        />
      </label>
      <label className="flex gap-4 items-center justify-between text-lg font-semibold">
        Mines
        <input
          type="number"
          min={1}
          max={size ? size * size - 1 : 10}
          value={mines}
          onChange={e => setMines(Number(e.target.value))}
          className="border rounded px-2 py-1 w-16 text-center"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer font-bold hover:bg-blue-700 transition"
      >
        Start Game
      </button>
    </form>
  );
};
