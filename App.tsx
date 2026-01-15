
import React, { useState, useEffect, useCallback } from 'react';
import Square from './components/Square';
import ScoreBoard from './components/ScoreBoard';
import { GameMode, Player, BoardState, GameStatus } from './types';
import { getGeminiMove } from './services/geminiService';

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvE);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [status, setStatus] = useState<GameStatus>({ winner: null, winningLine: null });

  const calculateWinner = (squares: BoardState): GameStatus => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], winningLine: [a, b, c] };
      }
    }

    if (!squares.includes(null)) {
      return { winner: 'Draw', winningLine: null };
    }

    return { winner: null, winningLine: null };
  };

  const handleSquareClick = useCallback((i: number) => {
    if (board[i] || status.winner || isAiThinking) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameResult = calculateWinner(newBoard);
    if (gameResult.winner) {
      setStatus(gameResult);
      updateScores(gameResult.winner);
    } else {
      setIsXNext(!isXNext);
    }
  }, [board, isXNext, status.winner, isAiThinking]);

  const updateScores = (winner: Player | 'Draw') => {
    setScores(prev => {
      if (winner === 'Draw') return { ...prev, draws: prev.draws + 1 };
      return { ...prev, [winner]: prev[winner] + 1 };
    });
  };

  // AI Logic for PvE
  useEffect(() => {
    if (gameMode === GameMode.PvE && !isXNext && !status.winner) {
      const makeAiMove = async () => {
        setIsAiThinking(true);
        // Small delay for realism
        await new Promise(r => setTimeout(r, 600));
        const move = await getGeminiMove(board);
        setIsAiThinking(false);
        handleSquareClick(move);
      };
      makeAiMove();
    }
  }, [isXNext, gameMode, status.winner, board, handleSquareClick]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus({ winner: null, winningLine: null });
    setIsAiThinking(false);
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === GameMode.PvP ? GameMode.PvE : GameMode.PvP);
    resetGame();
  };

  const getStatusMessage = () => {
    if (status.winner === 'Draw') return "It's a Tie!";
    if (status.winner) return `Player ${status.winner} Wins!`;
    if (isAiThinking) return "Gemini is thinking...";
    return `Player ${isXNext ? 'X' : 'O'}'s Turn`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">
          Tic-Tac-Toe
        </h1>
        <p className="text-slate-400 text-sm md:text-base tracking-widest font-medium">POWERED BY GEMINI 3 FLASH</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-8 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
        <button
          onClick={() => gameMode !== GameMode.PvE && toggleGameMode()}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
            gameMode === GameMode.PvE 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="fa-solid fa-robot mr-2"></i> Vs AI
        </button>
        <button
          onClick={() => gameMode !== GameMode.PvP && toggleGameMode()}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
            gameMode === GameMode.PvP 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
            : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="fa-solid fa-user-group mr-2"></i> PvP
        </button>
      </div>

      <ScoreBoard scores={scores} />

      {/* Status Message */}
      <div className="mb-6 h-8 flex items-center justify-center">
        <p className={`text-xl font-bold tracking-wide ${
          status.winner ? 'text-emerald-400 animate-bounce' : 'text-slate-200'
        }`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 bg-slate-900/40 rounded-3xl border border-slate-800/50 shadow-2xl backdrop-blur-sm relative">
        {board.map((val, i) => (
          <Square
            key={i}
            value={val}
            onClick={() => handleSquareClick(i)}
            disabled={!!status.winner || isAiThinking || (gameMode === GameMode.PvE && !isXNext)}
            isWinningSquare={status.winningLine?.includes(i) ?? false}
          />
        ))}
        
        {/* Loading overlay for AI */}
        {isAiThinking && (
          <div className="absolute inset-0 bg-slate-900/10 rounded-3xl backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-12 flex gap-4">
        <button
          onClick={resetGame}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 shadow-lg flex items-center gap-2"
        >
          <i className="fa-solid fa-rotate-left"></i> Reset
        </button>
        <button
          onClick={() => {
            setScores({ X: 0, O: 0, draws: 0 });
            resetGame();
          }}
          className="px-8 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-2xl transition-all border border-rose-500/30 flex items-center gap-2"
        >
          <i className="fa-solid fa-trash-can"></i> Clear Score
        </button>
      </div>

      {/* Footer Info */}
      <footer className="mt-auto py-8 text-slate-500 text-xs text-center">
        <p>Built with Gemini 3 API & React 18</p>
        <p className="mt-1">Experience unbeatable strategy in Every Move.</p>
      </footer>
    </div>
  );
};

export default App;
