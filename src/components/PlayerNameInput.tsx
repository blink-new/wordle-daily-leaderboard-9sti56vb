
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
  isOpen: boolean;
}

export function PlayerNameInput({ onSubmit, isOpen }: PlayerNameInputProps) {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enter Your Name</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500">
              Your name will appear on the daily leaderboard
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={!name.trim()}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}