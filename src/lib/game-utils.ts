
// Constants
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

// Game status
export type GameStatus = 'playing' | 'won' | 'lost';

// Letter state for coloring
export type LetterState = 'correct' | 'present' | 'absent' | 'unused';

// Game state interface
export interface GameState {
  solution: string;
  attempts: string[];
  currentAttempt: string;
  gameStatus: GameStatus;
  letterStates: Record<string, LetterState>;
  date: string;
}

// Create a new game state
export function createNewGame(solution: string): GameState {
  return {
    solution,
    attempts: [],
    currentAttempt: '',
    gameStatus: 'playing',
    letterStates: {},
    date: new Date().toISOString().split('T')[0],
  };
}

// Check if a word is valid (placeholder - would connect to a dictionary API)
export function isValidWord(word: string): boolean {
  // In a real implementation, this would check against a dictionary
  return word.length === WORD_LENGTH;
}

// Evaluate an attempt and update letter states
export function evaluateAttempt(attempt: string, solution: string): LetterState[] {
  const result: LetterState[] = Array(attempt.length).fill('absent');
  const solutionChars = solution.split('');
  
  // First pass: mark correct letters
  for (let i = 0; i < attempt.length; i++) {
    if (attempt[i] === solution[i]) {
      result[i] = 'correct';
      solutionChars[i] = '#'; // Mark as used
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < attempt.length; i++) {
    if (result[i] !== 'correct') {
      const charIndex = solutionChars.indexOf(attempt[i]);
      if (charIndex !== -1) {
        result[i] = 'present';
        solutionChars[charIndex] = '#'; // Mark as used
      }
    }
  }
  
  return result;
}

// Update letter states in the keyboard
export function updateLetterStates(
  attempt: string, 
  evaluation: LetterState[], 
  currentStates: Record<string, LetterState>
): Record<string, LetterState> {
  const newStates = { ...currentStates };
  
  for (let i = 0; i < attempt.length; i++) {
    const letter = attempt[i].toLowerCase();
    const currentState = newStates[letter] || 'unused';
    const newState = evaluation[i];
    
    // Only upgrade the state, never downgrade
    if (
      currentState === 'unused' ||
      (currentState === 'absent' && (newState === 'present' || newState === 'correct')) ||
      (currentState === 'present' && newState === 'correct')
    ) {
      newStates[letter] = newState;
    }
  }
  
  return newStates;
}

// Get a random word (placeholder - would be replaced with a daily word API)
export function getRandomWord(): string {
  const words = [
    'react', 'state', 'props', 'hooks', 'redux',
    'style', 'class', 'event', 'route', 'fetch',
    'async', 'await', 'array', 'const', 'arrow',
    'build', 'debug', 'error', 'focus', 'input',
    'modal', 'query', 'stack', 'table', 'value',
    'world', 'light', 'phone', 'water', 'music',
    'earth', 'space', 'ocean', 'plant', 'house'
  ];
  
  return words[Math.floor(Math.random() * words.length)];
}

// Get today's word (in a real app, this would be from a server)
export function getTodaysWord(): string {
  // In a real implementation, this would fetch from a server
  // For now, we'll use a deterministic approach based on the date
  const today = new Date().toISOString().split('T')[0];
  const seed = hashCode(today);
  const words = [
    'react', 'state', 'props', 'hooks', 'redux',
    'style', 'class', 'event', 'route', 'fetch',
    'async', 'await', 'array', 'const', 'arrow',
    'build', 'debug', 'error', 'focus', 'input',
    'modal', 'query', 'stack', 'table', 'value',
    'world', 'light', 'phone', 'water', 'music',
    'earth', 'space', 'ocean', 'plant', 'house'
  ];
  
  return words[Math.abs(seed) % words.length];
}

// Simple hash function for deterministic word selection
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Format time in seconds to mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}