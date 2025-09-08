import { motion } from "framer-motion";
import { Cell } from "../components/Cell";

export default function MinesweeperBoard({ size, mines }: { size: number, mines: number }) {
  // Just render a static grid of cells (no game logic)
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="grid bg-gray-300 rounded shadow-lg"
        style={{ gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`, gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => (
            <Cell
              key={`${r}-${c}`}
              value=""
              revealed={false}
              flagged={false}
              onClick={() => {}}
              onRightClick={() => {}}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
