export interface CrosswordGrid {
  grid: string[][];
  wordPlacements: WordPlacement[];
  width: number;
  height: number;
  clues: { [word: string]: string };
  gridData: CellData[][];
  acrossClues: ClueData[];
  downClues: ClueData[];
}

export interface CellData {
  letter: string;
  number: number;
  isBlack: boolean;
}

export interface ClueData {
  number: number;
  clue: string;
  answer?: string;
}

export interface WordPlacement {
  word: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  clue: string;
  number?: number;
}

// Grid initialization
const createEmptyGrid = (width: number, height: number): string[][] => {
  return Array(height).fill(null).map(() => Array(width).fill(''));
};

// Check if a word can be placed at a specific position
const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down'
): boolean => {
  const height = grid.length;
  const width = grid[0].length;

  // Check if word fits within grid boundaries
  if (direction === 'across' && col + word.length > width) return false;
  if (direction === 'down' && row + word.length > height) return false;

  // Check if placement is valid (matches existing letters or empty cells)
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;

    // Out of bounds check (shouldn't happen due to earlier check, but just in case)
    if (currentRow < 0 || currentRow >= height || currentCol < 0 || currentCol >= width) {
      return false;
    }

    const currentCell = grid[currentRow][currentCol];
    
    // If cell is already filled, check if letters match
    if (currentCell !== '' && currentCell !== word[i]) {
      return false;
    }

    // Check if placing the word would create invalid adjacent words
    if (direction === 'across') {
      // Check cell above
      if (currentRow > 0 && grid[currentRow - 1][currentCol] !== '' &&
         (i === 0 || i === word.length - 1 || grid[currentRow][currentCol] === '')) {
        return false;
      }
      // Check cell below
      if (currentRow < height - 1 && grid[currentRow + 1][currentCol] !== '' &&
         (i === 0 || i === word.length - 1 || grid[currentRow][currentCol] === '')) {
        return false;
      }
    } else { // direction === 'down'
      // Check cell to the left
      if (currentCol > 0 && grid[currentRow][currentCol - 1] !== '' &&
         (i === 0 || i === word.length - 1 || grid[currentRow][currentCol] === '')) {
        return false;
      }
      // Check cell to the right
      if (currentCol < width - 1 && grid[currentRow][currentCol + 1] !== '' &&
         (i === 0 || i === word.length - 1 || grid[currentRow][currentCol] === '')) {
        return false;
      }
    }
  }

  // Check if placing this word would create unwanted adjacent words
  // Check for words forming in perpendicular direction
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;

    // Check if there's an empty cell that would become part of an unintended word
    if (grid[currentRow][currentCol] === '') {
      if (direction === 'across') {
        // Check if this creates an unwanted vertical word
        if ((currentRow > 0 && grid[currentRow - 1][currentCol] !== '') ||
            (currentRow < height - 1 && grid[currentRow + 1][currentCol] !== '')) {
          if (i > 0 && i < word.length - 1) {
            // Only allow intersections, not adjacencies
            if (grid[currentRow][currentCol] === '') {
              return false;
            }
          }
        }
      } else { // direction === 'down'
        // Check if this creates an unwanted horizontal word
        if ((currentCol > 0 && grid[currentRow][currentCol - 1] !== '') ||
            (currentCol < width - 1 && grid[currentRow][currentCol + 1] !== '')) {
          if (i > 0 && i < word.length - 1) {
            // Only allow intersections, not adjacencies
            if (grid[currentRow][currentCol] === '') {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
};

// Place a word on the grid
const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down'
): void => {
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;
    grid[currentRow][currentCol] = word[i];
  }
};

// Shuffle array in place
const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Generate clues for words
const generateClues = (words: string[]): { [word: string]: string } => {
  const clues: { [word: string]: string } = {};
  words.forEach(word => {
    clues[word] = `Clue for ${word}`; // Default placeholder clue
  });
  return clues;
};

// Generate crossword puzzle
export const generateCrossword = (words: string[], width: number, height: number): CrosswordGrid | null => {
  // Sort words by length (descending)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  // Attempt to generate crossword (with retries)
  for (let attempt = 0; attempt < 20; attempt++) {
    const grid = createEmptyGrid(width, height);
    const placements: WordPlacement[] = [];
    const clues = generateClues(words);
    
    // Shuffle directions to try
    const directions: ('across' | 'down')[] = shuffleArray(['across', 'down']);
    
    // Place first word in the middle
    const firstWord = sortedWords[0];
    const firstDirection = directions[0];
    
    let startRow, startCol;
    if (firstDirection === 'across') {
      startRow = Math.floor(height / 2);
      startCol = Math.floor((width - firstWord.length) / 2);
    } else {
      startRow = Math.floor((height - firstWord.length) / 2);
      startCol = Math.floor(width / 2);
    }
    
    placeWord(grid, firstWord, startRow, startCol, firstDirection);
    placements.push({
      word: firstWord,
      row: startRow,
      col: startCol,
      direction: firstDirection,
      clue: clues[firstWord],
    });
    
    // Keep track of words successfully placed
    const placedWords = new Set([firstWord]);
    
    // Try to place remaining words
    let progressMade = true;
    while (progressMade) {
      progressMade = false;
      
      // Shuffle words to avoid getting stuck in the same pattern
      const remainingWords = shuffleArray(sortedWords.filter(w => !placedWords.has(w)));
      
      for (const word of remainingWords) {
        let placed = false;
        
        // Try to find intersections with already placed words
        for (const placement of placements) {
          const placedWord = placement.word;
          const placedDirection = placement.direction;
          
          // Try to place perpendicular to existing words
          const newDirection = placedDirection === 'across' ? 'down' : 'across';
          
          // Find common letters between words
          for (let i = 0; i < placedWord.length; i++) {
            for (let j = 0; j < word.length; j++) {
              if (placedWord[i] === word[j]) {
                let newRow, newCol;
                
                // Calculate position for intersection
                if (placedDirection === 'across') {
                  newRow = placement.row - j;
                  newCol = placement.col + i;
                } else {
                  newRow = placement.row + i;
                  newCol = placement.col - j;
                }
                
                // Check if word can be placed at this position
                if (canPlaceWord(grid, word, newRow, newCol, newDirection)) {
                  placeWord(grid, word, newRow, newCol, newDirection);
                  placements.push({
                    word,
                    row: newRow,
                    col: newCol,
                    direction: newDirection,
                    clue: clues[word],
                  });
                  placedWords.add(word);
                  placed = true;
                  progressMade = true;
                  break;
                }
              }
            }
            if (placed) break;
          }
          if (placed) break;
        }
      }
    }
    
    // Check if we've placed at least 70% of words
    if (placedWords.size >= Math.ceil(sortedWords.length * 0.7)) {
      // Number the placements for references
      const numberedPlacements = numberCrosswordPlacements(placements);
      
      // Create gridData, acrossClues, and downClues
      const gridData = createGridData(grid, numberedPlacements);
      const { acrossClues, downClues } = createCluesLists(numberedPlacements);
      
      return {
        grid,
        wordPlacements: numberedPlacements,
        width,
        height,
        clues,
        gridData,
        acrossClues,
        downClues,
      };
    }
  }
  
  return null; // Failed to generate a satisfactory crossword
};

// Create gridData from the grid and word placements
const createGridData = (grid: string[][], wordPlacements: WordPlacement[]): CellData[][] => {
  const height = grid.length;
  const width = grid[0].length;
  
  // Initialize gridData with empty cells
  const gridData = Array(height).fill(null).map(() => 
    Array(width).fill(null).map(() => ({
      letter: '',
      number: 0,
      isBlack: true
    }))
  );
  
  // Fill in gridData based on the grid
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] !== '') {
        gridData[i][j] = {
          letter: grid[i][j],
          number: 0,
          isBlack: false
        };
      }
    }
  }
  
  // Add numbers to cells that start words
  for (const placement of wordPlacements) {
    if (placement.number) {
      gridData[placement.row][placement.col].number = placement.number;
    }
  }
  
  return gridData;
};

// Create across and down clue lists from word placements
const createCluesLists = (wordPlacements: WordPlacement[]): { acrossClues: ClueData[], downClues: ClueData[] } => {
  const acrossClues = wordPlacements
    .filter(placement => placement.direction === 'across')
    .sort((a, b) => (a.number || 0) - (b.number || 0))
    .map(placement => ({
      number: placement.number || 0,
      clue: placement.clue,
      answer: placement.word
    }));
    
  const downClues = wordPlacements
    .filter(placement => placement.direction === 'down')
    .sort((a, b) => (a.number || 0) - (b.number || 0))
    .map(placement => ({
      number: placement.number || 0,
      clue: placement.clue,
      answer: placement.word
    }));
    
  return { acrossClues, downClues };
};

// Number the placements sequentially for display
const numberCrosswordPlacements = (placements: WordPlacement[]): WordPlacement[] => {
  // Sort placements by position (top-to-bottom, left-to-right)
  const sortedPlacements = [...placements].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  // Assign numbers
  let currentNumber = 1;
  const processedPositions = new Set<string>();
  
  return sortedPlacements.map(placement => {
    const posKey = `${placement.row},${placement.col}`;
    
    // If this position hasn't been numbered yet, assign a new number
    if (!processedPositions.has(posKey)) {
      placement.number = currentNumber;
      processedPositions.add(posKey);
      currentNumber++;
    } else {
      // Find existing number for this position
      const existingPlacement = sortedPlacements.find(p => 
        p.row === placement.row && p.col === placement.col && p.number !== undefined
      );
      placement.number = existingPlacement?.number;
    }
    
    return placement;
  });
};

// Check if a cell is the start of a word
export const isWordStart = (placements: WordPlacement[], row: number, col: number): number | null => {
  for (const placement of placements) {
    if (placement.row === row && placement.col === col && placement.number !== undefined) {
      return placement.number;
    }
  }
  return null;
};

// Convert array of words to proper format for the algorithm
export const prepareWordsForCrossword = (wordList: string[]): string[] => {
  return wordList.map(word => word.trim().toUpperCase());
};
