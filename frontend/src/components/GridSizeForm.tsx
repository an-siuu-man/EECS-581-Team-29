import React from "react";

interface GridSizeFormProps {
  size: number;
  mines: number;
  started: boolean;
  setSize: (n: number) => void;
  setMines: (n: number) => void;
  onStart: () => void;
}

export const GridSizeForm: React.FC<GridSizeFormProps> = ({ size, mines, started, setSize, setMines, onStart }) => {
  return (
    <form
      className="grid grid-rows-4 gap-4 items-center justify-center mb-4 relative"
      onSubmit={e => {
        e.preventDefault();
        onStart();
        console.log("Game started with size:", size, "and mines:", mines);
      }}
    >
      <label className="flex gap-4 items-center justify-between text-lg ">
        Grid Size
        <input
          type="number"
          min={5}
          max={30}
          value={size}
          onChange={e => setSize(Number(e.target.value))}
          className="border font-geist-mono rounded px-2 py-1 w-16 text-center"
        />
      </label>
      <label className="flex gap-4 items-center justify-between text-lg">
        Mines
        <input
          type="number"
          min={1}
          max={size ? size * size - 1 : 10}
          value={mines}
          onChange={e => setMines(Number(e.target.value))}
          className="border font-geist-mono rounded px-2 py-1 w-16 text-center"
        />
      </label>
      <div className="flex w-full justify-center items-center gap-4 ">
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition${started ? ' opacity-40 cursor-not-allowed' : ''}`}
          disabled={started}
        >
          Start Game
        </button>
        <button 
          type="button" 
          className={`bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-white${!started ? ' opacity-40 cursor-not-allowed' : ''}`}
          onClick={() => {
            setSize(10);
            setMines(10);
          }}
          disabled={!started}  
        >End Game</button>
      </div>
      <div className="w-screen flex justify-center absolute left-1/2 -translate-x-1/2 mt-2 pointer-events-none" style={{top: '100%'}}>
        <hr className="w-[90vw] border-t border-gray-300" />
      </div>
    </form>
  );
};
