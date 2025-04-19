
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {gameStatus === 'won' ? 'Congratulations!' : 'Better luck next time!'}
        </h2>
        
        <div className="mb-6">
          <p className="text-center mb-2">
            {gameStatus === 'won' 
              ? `You guessed the word in ${attemptsUsed} ${attemptsUsed === 1 ? 'try' : 'tries'}!` 
              : 'You ran out of attempts.'}
          </p>
          <p className="text-center font-bold text-xl mb-4">
            The word was: <span className="uppercase">{solution}</span>
          </p>
          <p className="text-center text-sm text-gray-500">
            Time: {minutes}m {seconds}s
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onNewGame}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}