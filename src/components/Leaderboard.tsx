
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { formatTime } from '../lib/game-utils';
import { FiAward, FiClock, FiUser } from 'react-icons/fi';

// Leaderboard entry type
interface LeaderboardEntry {
  id: string;
  name: string;
  attempts: number;
  timeElapsed: number;
  date: string;
}

interface LeaderboardProps {
  currentDate: string;
}

export function Leaderboard({ currentDate }: LeaderboardProps) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  
  // Load leaderboard data from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem(`wordle-leaderboard-${currentDate}`);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, [currentDate, open]);
  
  // Sort entries by attempts (fewer is better) and then by time (faster is better)
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts;
    }
    return a.timeElapsed - b.timeElapsed;
  });
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-medium">Leaderboard</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FiAward className="text-[hsl(var(--present))]" />
            Daily Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <span>Today's top players</span>
            <span className="font-medium">({currentDate})</span>
          </div>
          
          {sortedEntries.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              <div className="grid grid-cols-12 font-bold text-sm border-b pb-2">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-3">Attempts</div>
                <div className="col-span-3">Time</div>
              </div>
              
              {sortedEntries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={cn(
                    "grid grid-cols-12 text-sm py-3 border-b",
                    index === 0 && "bg-amber-50 dark:bg-amber-950/20 rounded"
                  )}
                >
                  <div className="col-span-1 font-bold">
                    {index === 0 ? '🏆' : index + 1}
                  </div>
                  <div className="col-span-5 font-medium flex items-center gap-1">
                    <FiUser className="text-gray-400" size={14} />
                    {entry.name}
                  </div>
                  <div className="col-span-3">{entry.attempts}/6</div>
                  <div className="col-span-3 flex items-center gap-1">
                    <FiClock className="text-gray-400" size={14} />
                    {formatTime(entry.timeElapsed)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <FiAward className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="font-medium">No entries yet for today</p>
              <p className="text-sm mt-1">Be the first to complete today's puzzle!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Import cn utility
import { cn } from '../lib/utils';