type SudokuGrid = number[][];

/**
 * Checks if placing a number at a given position is valid according to Sudoku rules
 */
const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffle = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Solves the Sudoku grid using backtracking algorithm
 */
const solveSudoku = (grid: SudokuGrid): boolean => {
  // Find the next empty cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        // Try numbers 1-9 in random order for variety
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            // Recursively try to solve the rest
            if (solveSudoku(grid)) {
              return true;
            }

            // Backtrack if this number doesn't lead to a solution
            grid[row][col] = 0;
          }
        }

        // No valid number found, need to backtrack
        return false;
      }
    }
  }

  // All cells filled successfully
  return true;
};

/**
 * Generates a valid solved 9x9 Sudoku board
 * @returns A 9x9 grid filled with numbers 1-9 following Sudoku rules
 */
export const generateSolvedSudoku = (): SudokuGrid => {
  // Initialize empty grid
  const grid: SudokuGrid = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // Solve the empty grid using backtracking
  solveSudoku(grid);

  return grid;
};

/**
 * Generates a Sudoku puzzle by removing numbers from a solved board
 * @param difficulty Number of cells to remove (easy: 30-40, medium: 40-50, hard: 50-60)
 * @returns A 9x9 grid with some cells empty (0)
 */
export const generateSudokuPuzzle = (difficulty: number = 40): SudokuGrid => {
  // Generate a solved board
  const solvedGrid = generateSolvedSudoku();

  // Create a copy for the puzzle
  const puzzle: SudokuGrid = solvedGrid.map(row => [...row]);

  // Remove numbers randomly
  let cellsToRemove = difficulty;
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return puzzle;
};
