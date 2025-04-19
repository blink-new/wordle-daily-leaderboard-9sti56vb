
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FiUser } from 'react-icons/fi';

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
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FiUser className="text-[hsl(var(--primary))]" />
            Enter Your Name
          </DialogTitle>
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
              className="border-2 py-6 text-lg"
            />
            <p className="text-xs text-gray-500">
              Your name will appear on the daily leaderboard
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--correct))] hover:bg-[hsl(var(--correct))/90] text-white font-bold py-6"
            disabled={!name.trim()}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}