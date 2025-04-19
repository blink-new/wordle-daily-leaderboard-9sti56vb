
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { formatTime } from '../lib/game-utils';

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
        <Button variant="outline" size="sm">Leaderboard</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Daily Leaderboard</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">
            Today's top players ({currentDate})
          </div>
          
          {sortedEntries.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 font-bold text-sm border-b pb-2">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-3">Attempts</div>
                <div className="col-span-3">Time</div>
              </div>
              
              {sortedEntries.map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-12 text-sm py-2 border-b">
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-5 font-medium">{entry.name}</div>
                  <div className="col-span-3">{entry.attempts}/6</div>
                  <div className="col-span-3">{formatTime(entry.timeElapsed)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No entries yet for today. Be the first to complete today's puzzle!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}