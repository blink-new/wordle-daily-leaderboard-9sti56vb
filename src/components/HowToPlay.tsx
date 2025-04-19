
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function HowToPlay() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-medium">How to Play</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">How to Play</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <p>Guess the WORDLE in 6 tries.</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was to the word.</li>
          </ul>
          
          <div className="space-y-3 mt-4">
            <p className="font-bold">Examples:</p>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-[hsl(var(--correct))] text-white font-bold uppercase rounded">W</div>
              <span>The letter W is in the word and in the correct spot.</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-[hsl(var(--present))] text-white font-bold uppercase rounded">I</div>
              <span>The letter I is in the word but in the wrong spot.</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-[hsl(var(--absent))] text-white font-bold uppercase rounded">U</div>
              <span>The letter U is not in the word in any spot.</span>
            </div>
          </div>
          
          <p className="mt-4 font-medium">A new WORDLE will be available each day!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}