
import { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { useToast } from './hooks/use-toast';
import { 
  WORD_LENGTH, 
  MAX_ATTEMPTS, 
  GameState, 
  GameStatus,
  LetterState,
  createNewGame, 
  isValidWord, 
  evaluateAttempt, 
  updateLetterStates,
  getTodaysWord
} from './lib/game-utils';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { GameStats } from './components/GameStats';
import { HowToPlay } from './components/HowToPlay';
import { Leaderboard } from './components/Leaderboard';
import { PlayerNameInput } from './components/PlayerNameInput';
import './App.css';

function App() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [evaluations, setEvaluations] = useState<LetterState[][]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  
  // Initialize game
  useEffect(() => {
    const savedGame = localStorage.getItem('wordle-game-state');
    
    if (savedGame) {
      const parsedGame = JSON.parse(savedGame) as GameState;
      const today = new Date().toISOString().split('T')[0];
      
      // If the saved game is from today, load it
      if (parsedGame.date === today) {
        setGameState(parsedGame);
        
        // Load evaluations
        const savedEvals = localStorage.getItem('wordle-evaluations');
        if (savedEvals) {
          setEvaluations(JSON.parse(savedEvals));
        }
        
        // Load timer
        const savedTime = localStorage.getItem('wordle-time');
        if (savedTime) {
          setTimeElapsed(parseInt(savedTime, 10));
        }
        
        // If game is still in progress, start the timer
        if (parsedGame.gameStatus === 'playing') {
          setTimerActive(true);
        }
        
        return;
      }
    }
    
    // Start a new game
    startNewGame();
  }, []);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          localStorage.setItem('wordle-time', newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);
  
  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState) {
      localStorage.setItem('wordle-game-state', JSON.stringify(gameState));
    }
  }, [gameState]);
  
  // Save evaluations to localStorage whenever they change
  useEffect(() => {
    if (evaluations.length > 0) {
      localStorage.setItem('wordle-evaluations', JSON.stringify(evaluations));
    }
  }, [evaluations]);
  
  // Start a new game
  const startNewGame = useCallback(() => {
    const solution = getTodaysWord();
    const newGame = createNewGame(solution);
    
    setGameState(newGame);
    setEvaluations([]);
    setTimeElapsed(0);
    setTimerActive(true);
    setShowNameInput(false);
    
    localStorage.removeItem('wordle-evaluations');
    localStorage.removeItem('wordle-time');
  }, []);
  
  // Handle keyboard input
  const handleKeyPress = useCallback((key: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    
    setGameState(prevState => {
      if (!prevState) return prevState;
      
      const { currentAttempt, attempts, solution } = prevState;
      
      // Handle Enter key
      if (key === 'enter') {
        // Check if the word is complete
        if (currentAttempt.length !== WORD_LENGTH) {
          toast({
            title: "Word too short",
            description: `Must be ${WORD_LENGTH} letters long`,
            variant: "destructive"
          });
          return prevState;
        }
        
        // Check if the word is valid
        if (!isValidWord(currentAttempt)) {
          toast({
            title: "Not a valid word",
            description: "Please try another word",
            variant: "destructive"
          });
          return prevState;
        }
        
        // Evaluate the attempt
        const evaluation = evaluateAttempt(currentAttempt, solution);
        
        // Update evaluations
        setEvaluations(prev => [...prev, evaluation]);
        
        // Update letter states for the keyboard
        const newLetterStates = updateLetterStates(
          currentAttempt, 
          evaluation, 
          prevState.letterStates
        );
        
        // Check if the player won
        const won = currentAttempt === solution;
        
        // Check if the player lost (used all attempts)
        const lost = attempts.length + 1 >= MAX_ATTEMPTS && !won;
        
        // Update game status
        let newStatus: GameStatus = 'playing';
        if (won) {
          newStatus = 'won';
          setTimerActive(false);
          setShowNameInput(true);
          toast({
            title: "Congratulations!",
            description: `You found the word in ${attempts.length + 1} tries!`,
            variant: "success"
          });
        } else if (lost) {
          newStatus = 'lost';
          setTimerActive(false);
          toast({
            title: "Game Over",
            description: `The word was ${solution.toUpperCase()}`,
            variant: "destructive"
          });
        }
        
        // Return the updated state
        return {
          ...prevState,
          attempts: [...attempts, currentAttempt],
          currentAttempt: '',
          gameStatus: newStatus,
          letterStates: newLetterStates
        };
      }
      
      // Handle Backspace key
      if (key === 'backspace') {
        return {
          ...prevState,
          currentAttempt: currentAttempt.slice(0, -1)
        };
      }
      
      // Handle letter keys
      if (/^[a-z]$/.test(key) && currentAttempt.length < WORD_LENGTH) {
        return {
          ...prevState,
          currentAttempt: currentAttempt + key
        };
      }
      
      return prevState;
    });
  }, [gameState, toast]);
  
  // Handle player name submission
  const handleNameSubmit = useCallback((name: string) => {
    if (!gameState || gameState.gameStatus !== 'won') return;
    
    // Create a leaderboard entry
    const entry = {
      id: Date.now().toString(),
      name,
      attempts: gameState.attempts.length,
      timeElapsed,
      date: gameState.date
    };
    
    // Get existing entries
    const storedEntries = localStorage.getItem(`wordle-leaderboard-${gameState.date}`);
    let entries = storedEntries ? JSON.parse(storedEntries) : [];
    
    // Add the new entry
    entries = [...entries, entry];
    
    // Save to localStorage
    localStorage.setItem(`wordle-leaderboard-${gameState.date}`, JSON.stringify(entries));
    
    // Hide the name input
    setShowNameInput(false);
    
    toast({
      title: "Added to Leaderboard",
      description: "Your score has been added to today's leaderboard!",
      variant: "success"
    });
  }, [gameState, timeElapsed, toast]);
  
  // If game state is not loaded yet, show loading
  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 game-title">WORDLE</h1>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 bg-[hsl(var(--correct))] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[hsl(var(--present))] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[hsl(var(--absent))] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full max-w-lg flex items-center justify-between mb-6 mt-4">
        <HowToPlay />
        
        <h1 className="text-3xl font-bold text-center game-title">WORDLE</h1>
        
        <Leaderboard currentDate={gameState.date} />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg">
        <GameBoard 
          attempts={gameState.attempts}
          currentAttempt={gameState.currentAttempt}
          solution={gameState.solution}
          evaluations={evaluations}
        />
        
        <Keyboard 
          onKeyPress={handleKeyPress}
          letterStates={gameState.letterStates}
        />
      </main>
      
      <GameStats 
        gameStatus={gameState.gameStatus}
        solution={gameState.solution}
        attempts={gameState.attempts}
        onNewGame={startNewGame}
        timeElapsed={timeElapsed}
      />
      
      <PlayerNameInput 
        onSubmit={handleNameSubmit}
        isOpen={showNameInput}
      />
      
      <footer className="mt-8 mb-4 text-center text-sm text-gray-500">
        <p>A new word every day!</p>
      </footer>
      
      <Toaster />
    </div>
  );
}

export default App;