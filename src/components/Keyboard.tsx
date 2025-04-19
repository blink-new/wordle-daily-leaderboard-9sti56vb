
import { useState, useEffect } from 'react';
import { LetterState } from '../lib/game-utils';
import { cn } from '../lib/utils';
import { FiDelete } from 'react-icons/fi';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
}

export function Keyboard({ onKeyPress, letterStates }: KeyboardProps) {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
  ];

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onKeyPress('enter');
      } else if (e.key === 'Backspace') {
        onKeyPress('backspace');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKeyPress(e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2 gap-1">
          {row.map((key) => {
            const state = letterStates[key] || 'unused';
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={cn(
                  "rounded font-bold uppercase flex items-center justify-center transition-colors",
                  key === 'enter' || key === 'backspace' 
                    ? "px-3 h-14" 
                    : "w-10 h-14",
                  state === 'correct' && "bg-green-500 text-white",
                  state === 'present' && "bg-yellow-500 text-white",
                  state === 'absent' && "bg-gray-600 text-white",
                  state === 'unused' && "bg-gray-300 text-gray-800 hover:bg-gray-400"
                )}
              >
                {key === 'backspace' ? <FiDelete size={20} /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}