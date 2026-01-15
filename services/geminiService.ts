
import { GoogleGenAI, Type } from "@google/genai";
import { BoardState } from "../types";

export const getGeminiMove = async (board: BoardState): Promise<number> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Format board for prompt: replace null with index, keep X and O
  const boardDescription = board.map((cell, idx) => cell === null ? idx : cell).join(', ');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an unbeatable Tic-Tac-Toe grandmaster. 
    The current board state is: [${boardDescription}]. 
    Indices are 0-8 (top-left to bottom-right). 
    You are playing as 'O'. 'X' is your opponent.
    Analyze the board and choose the absolute best move to win or force a draw.
    Return only the index of your chosen move.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          moveIndex: {
            type: Type.INTEGER,
            description: "The 0-based index of the board where 'O' should move."
          },
          reasoning: {
            type: Type.STRING,
            description: "A short explanation of why this move was chosen."
          }
        },
        required: ["moveIndex"]
      },
      thinkingConfig: { thinkingBudget: 0 } // Flash is fast enough without deep thinking for TicTacToe
    }
  });

  try {
    const data = JSON.parse(response.text.trim());
    const move = data.moveIndex;
    
    // Validate move
    if (typeof move === 'number' && move >= 0 && move <= 8 && board[move] === null) {
      return move;
    }
    
    // Fallback if AI gives invalid move
    const emptyIndices = board.map((c, i) => c === null ? i : null).filter(i => i !== null) as number[];
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    const emptyIndices = board.map((c, i) => c === null ? i : null).filter(i => i !== null) as number[];
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }
};
