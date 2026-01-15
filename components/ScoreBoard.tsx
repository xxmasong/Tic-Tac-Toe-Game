
import React from 'react';

interface ScoreBoardProps {
  scores: { X: number; O: number; draws: number };
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
  return (
    <div className="flex justify-between w-full max-w-sm gap-4 mb-8">
      <div className="flex-1 bg-slate-800/40 p-3 rounded-2xl border border-blue-500/20 text-center">
        <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Player X</p>
        <p className="text-2xl font-bold">{scores.X}</p>
      </div>
      <div className="flex-1 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 text-center">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Draws</p>
        <p className="text-2xl font-bold">{scores.draws}</p>
      </div>
      <div className="flex-1 bg-slate-800/40 p-3 rounded-2xl border border-rose-500/20 text-center">
        <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider mb-1">Player O</p>
        <p className="text-2xl font-bold">{scores.O}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
