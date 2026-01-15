
export type Player = 'X' | 'O';
export type BoardState = (Player | null)[];

export enum GameMode {
  PvP = 'PVP',
  PvE = 'PVE' // Player vs Gemini
}

export enum Difficulty {
  Easy = 'Easy',
  Hard = 'Hard',
  Gemini = 'Gemini (Thinking)'
}

export interface GameStatus {
  winner: Player | 'Draw' | null;
  winningLine: number[] | null;
}
