
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function HowToPlay() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">How to Play</Button>
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
          
          <div className="space-y-2">
            <p className="font-bold">Examples:</p>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center bg-green-500 text-white font-bold uppercase">W</div>
              <span>The letter W is in the word and in the correct spot.</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white font-bold uppercase">I</div>
              <span>The letter I is in the word but in the wrong spot.</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white font-bold uppercase">U</div>
              <span>The letter U is not in the word in any spot.</span>
            </div>
          </div>
          
          <p>A new WORDLE will be available each day!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}