
import { useState } from 'react';
import { Button } from './ui/button';
import { GameStatus } from '../lib/game-utils';
import { cn } from '../lib/utils';

interface GameStatsProps {
  gameStatus: GameStatus;
  solution: string;
  attempts: string[];
  onNewGame: () => void;
  timeElapsed: number;
}

export function GameStats({ gameStatus, solution, attempts, onNewGame, timeElapsed }: GameStatsProps) {
  const [isOpen, setIsOpen] = useState(gameStatus !== 'playing');
  
  if (!isOpen) return null;
  
  const attemptsUsed = attempts.length;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl">
        <h2 className={cn(
          "text-2xl font-bold mb-4 text-center",
          gameStatus === 'won' ? "text-[hsl(var(--correct))]" : "text-[hsl(var(--destructive))]"
        )}>
          {gameStatus === 'won' ? 'Congratulations!' : 'Better luck next time!'}
        </h2>
        
        <div className="mb-6">
          <p className="text-center mb-2">
            {gameStatus === 'won' 
              ? `You guessed the word in ${attemptsUsed} ${attemptsUsed === 1 ? 'try' : 'tries'}!` 
              : 'You ran out of attempts.'}
          </p>
          <p className="text-center font-bold text-xl mb-4 uppercase tracking-wider">
            The word was: <span className="text-[hsl(var(--primary))]">{solution}</span>
          </p>
          <p className="text-center text-sm text-gray-500">
            Time: {minutes}m {seconds}s
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onNewGame}
            className="bg-[hsl(var(--correct))] hover:bg-[hsl(var(--correct))/90] text-white font-bold px-6 py-2"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}