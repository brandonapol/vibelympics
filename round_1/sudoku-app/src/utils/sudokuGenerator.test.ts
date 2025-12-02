import { describe, it, expect } from 'vitest';
import { generateSolvedSudoku, generateSudokuPuzzle } from './sudokuGenerator';

/**
 * Helper function to check if a Sudoku board is valid
 */
const isValidSudoku = (grid: number[][]): boolean => {
  // Check all rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== 0) {
        if (num < 1 || num > 9 || seen.has(num)) {
          return false;
        }
        seen.add(num);
      }
    }
  }

  // Check all columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const num = grid[row][col];
      if (num !== 0) {
        if (num < 1 || num > 9 || seen.has(num)) {
          return false;
        }
        seen.add(num);
      }
    }
  }

  // Check all 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const num = grid[boxRow * 3 + i][boxCol * 3 + j];
          if (num !== 0) {
            if (num < 1 || num > 9 || seen.has(num)) {
              return false;
            }
            seen.add(num);
          }
        }
      }
    }
  }

  return true;
};

/**
 * Helper function to check if a Sudoku board is completely solved
 */
const isCompleteSudoku = (grid: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Helper function to count filled cells
 */
const countFilledCells = (grid: number[][]): number => {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) {
        count++;
      }
    }
  }
  return count;
};

describe('Sudoku Generator', () => {
  describe('generateSolvedSudoku', () => {
    it('should generate a 9x9 grid', () => {
      const grid = generateSolvedSudoku();
      expect(grid).toHaveLength(9);
      grid.forEach(row => {
        expect(row).toHaveLength(9);
      });
    });

    it('should generate a completely filled grid', () => {
      const grid = generateSolvedSudoku();
      expect(isCompleteSudoku(grid)).toBe(true);
    });

    it('should generate a valid Sudoku solution', () => {
      const grid = generateSolvedSudoku();
      expect(isValidSudoku(grid)).toBe(true);
    });

    it('should only contain numbers 1-9', () => {
      const grid = generateSolvedSudoku();
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(grid[row][col]).toBeGreaterThanOrEqual(1);
          expect(grid[row][col]).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should have no duplicate numbers in any row', () => {
      const grid = generateSolvedSudoku();
      for (let row = 0; row < 9; row++) {
        const rowSet = new Set(grid[row]);
        expect(rowSet.size).toBe(9);
      }
    });

    it('should have no duplicate numbers in any column', () => {
      const grid = generateSolvedSudoku();
      for (let col = 0; col < 9; col++) {
        const column = [];
        for (let row = 0; row < 9; row++) {
          column.push(grid[row][col]);
        }
        const colSet = new Set(column);
        expect(colSet.size).toBe(9);
      }
    });

    it('should have no duplicate numbers in any 3x3 box', () => {
      const grid = generateSolvedSudoku();
      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const box = [];
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              box.push(grid[boxRow * 3 + i][boxCol * 3 + j]);
            }
          }
          const boxSet = new Set(box);
          expect(boxSet.size).toBe(9);
        }
      }
    });

    it('should generate different boards on multiple calls', () => {
      const grid1 = generateSolvedSudoku();
      const grid2 = generateSolvedSudoku();

      // Check that at least one cell is different
      let isDifferent = false;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid1[row][col] !== grid2[row][col]) {
            isDifferent = true;
            break;
          }
        }
        if (isDifferent) break;
      }

      expect(isDifferent).toBe(true);
    });
  });

  describe('generateSudokuPuzzle', () => {
    it('should generate a 9x9 grid', () => {
      const puzzle = generateSudokuPuzzle(40);
      expect(puzzle).toHaveLength(9);
      puzzle.forEach(row => {
        expect(row).toHaveLength(9);
      });
    });

    it('should generate a valid partial Sudoku', () => {
      const puzzle = generateSudokuPuzzle(40);
      expect(isValidSudoku(puzzle)).toBe(true);
    });

    it('should remove the specified number of cells', () => {
      const difficulty = 40;
      const puzzle = generateSudokuPuzzle(difficulty);
      const filledCells = countFilledCells(puzzle);
      const expectedFilled = 81 - difficulty;

      expect(filledCells).toBe(expectedFilled);
    });

    it('should only contain numbers 0-9', () => {
      const puzzle = generateSudokuPuzzle(40);
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(puzzle[row][col]).toBeGreaterThanOrEqual(0);
          expect(puzzle[row][col]).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should handle easy difficulty (30 cells removed)', () => {
      const puzzle = generateSudokuPuzzle(30);
      const filledCells = countFilledCells(puzzle);

      expect(filledCells).toBe(51); // 81 - 30
      expect(isValidSudoku(puzzle)).toBe(true);
    });

    it('should handle medium difficulty (40 cells removed)', () => {
      const puzzle = generateSudokuPuzzle(40);
      const filledCells = countFilledCells(puzzle);

      expect(filledCells).toBe(41); // 81 - 40
      expect(isValidSudoku(puzzle)).toBe(true);
    });

    it('should handle hard difficulty (50 cells removed)', () => {
      const puzzle = generateSudokuPuzzle(50);
      const filledCells = countFilledCells(puzzle);

      expect(filledCells).toBe(31); // 81 - 50
      expect(isValidSudoku(puzzle)).toBe(true);
    });

    it('should generate different puzzles on multiple calls', () => {
      const puzzle1 = generateSudokuPuzzle(40);
      const puzzle2 = generateSudokuPuzzle(40);

      // Check that at least one cell is different
      let isDifferent = false;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle1[row][col] !== puzzle2[row][col]) {
            isDifferent = true;
            break;
          }
        }
        if (isDifferent) break;
      }

      expect(isDifferent).toBe(true);
    });
  });
});
