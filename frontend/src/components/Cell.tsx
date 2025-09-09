import { motion } from "framer-motion";
import React from "react";

export interface CellProps {
  value: string;
  revealed: boolean;
  flagged: boolean;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export const Cell: React.FC<CellProps> = ({ value, revealed, flagged, onClick, onRightClick }) => {
  return (
    <motion.button
      className={`w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 rounded-lg flex items-center justify-center text-lg font-bold select-none
        ${revealed ? "bg-gray-200" : "bg-gray-500 transition hover:bg-gray-400"}`}
      onClick={onClick}
      onContextMenu={onRightClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {revealed ? (value === "0" ? "" : value) : flagged ? "🚩" : ""}
    </motion.button>
  );
};
