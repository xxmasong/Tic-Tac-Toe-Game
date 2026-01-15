
import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player | null;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  const baseClasses = "w-20 h-20 md:w-28 md:h-28 flex items-center justify-center text-4xl md:text-5xl font-bold rounded-xl transition-all duration-300";
  
  const stateClasses = value 
    ? "bg-slate-800/50 cursor-default" 
    : "bg-slate-800/30 hover:bg-slate-700/50 cursor-pointer border border-slate-700/50";

  const winClasses = isWinningSquare 
    ? "ring-4 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105 z-10" 
    : "";

  return (
    <button
      disabled={disabled || !!value}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${winClasses}`}
    >
      {value === 'X' && (
        <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] animate-in zoom-in duration-200">
          <i className="fa-solid fa-xmark"></i>
        </span>
      )}
      {value === 'O' && (
        <span className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)] animate-in zoom-in duration-200">
          <i className="fa-regular fa-circle"></i>
        </span>
      )}
    </button>
  );
};

export default Square;
