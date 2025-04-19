
import { useState, useEffect } from 'react';
import { WORD_LENGTH, MAX_ATTEMPTS, LetterState } from '../lib/game-utils';
import { cn } from '../lib/utils';

interface GameBoardProps {
  attempts: string[];
  currentAttempt: string;
  solution: string;
  evaluations: LetterState[][];
}

export function GameBoard({ attempts, currentAttempt, solution, evaluations }: GameBoardProps) {
  // Create the empty board
  const board = Array(MAX_ATTEMPTS).fill(null).map((_, rowIndex) => {
    // If this row is a past attempt, use that
    if (rowIndex < attempts.length) {
      return attempts[rowIndex].split('');
    }
    
    // If this is the current attempt row
    if (rowIndex === attempts.length) {
      const currentAttemptArray = currentAttempt.split('');
      return Array(WORD_LENGTH).fill('').map((_, colIndex) => 
        colIndex < currentAttempt.length ? currentAttemptArray[colIndex] : ''
      );
    }
    
    // Otherwise, it's a future attempt (empty)
    return Array(WORD_LENGTH).fill('');
  });

  return (
    <div className="grid gap-2 mb-6">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {row.map((letter, colIndex) => {
            // Determine the state of this tile
            let state: LetterState | undefined;
            
            if (rowIndex < attempts.length && evaluations[rowIndex]) {
              state = evaluations[rowIndex][colIndex];
            }
            
            return (
              <Tile 
                key={colIndex} 
                letter={letter} 
                state={state}
                isRevealing={rowIndex === attempts.length - 1}
                position={colIndex}
                isCurrentRow={rowIndex === attempts.length}
                hasLetter={!!letter}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface TileProps {
  letter: string;
  state?: LetterState;
  isRevealing?: boolean;
  position: number;
  isCurrentRow: boolean;
  hasLetter: boolean;
}

function Tile({ letter, state, isRevealing = false, position, isCurrentRow, hasLetter }: TileProps) {
  const [revealed, setRevealed] = useState(!isRevealing);
  
  useEffect(() => {
    if (isRevealing) {
      const timeout = setTimeout(() => {
        setRevealed(true);
      }, position * 300); // Stagger the reveal animation
      
      return () => clearTimeout(timeout);
    }
  }, [isRevealing, position]);

  return (
    <div 
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl font-bold border-2 uppercase transition-all duration-500 rounded",
        !hasLetter && "border-gray-300 dark:border-gray-700",
        hasLetter && isCurrentRow && "border-gray-500 dark:border-gray-400 pop",
        revealed && state === 'correct' && "bg-[hsl(var(--correct))] text-white border-[hsl(var(--correct))]",
        revealed && state === 'present' && "bg-[hsl(var(--present))] text-white border-[hsl(var(--present))]",
        revealed && state === 'absent' && "bg-[hsl(var(--absent))] text-white border-[hsl(var(--absent))]",
        isRevealing && revealed && "scale-105",
        isRevealing && !revealed && "scale-100"
      )}
      style={{
        transitionDelay: isRevealing ? `${position * 300}ms` : '0ms',
      }}
    >
      {letter}
    </div>
  );
}