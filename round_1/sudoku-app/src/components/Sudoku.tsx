import { useState, useEffect, useMemo } from 'react';
import { generateSolvedSudoku } from '../utils/sudokuGenerator';
import './Sudoku.css';

type Cell = number | null;
type Grid = Cell[][];
type EmojiTheme = 'animals' | 'food' | 'weather' | 'faces' | 'octopus';

// Emoji theme sets
const emojiThemes: { [key in EmojiTheme]: { [key: number]: string } } = {
  animals: {
    1: '🐶',
    2: '🐱',
    3: '🐭',
    4: '🐹',
    5: '🐰',
    6: '🦊',
    7: '🐻',
    8: '🐼',
    9: '🐨'
  },
  food: {
    1: '🍎',
    2: '🍊',
    3: '🍋',
    4: '🍌',
    5: '🍉',
    6: '🍇',
    7: '🍓',
    8: '🍒',
    9: '🥝'
  },
  weather: {
    1: '☀️',
    2: '🌙',
    3: '⭐',
    4: '☁️',
    5: '🌧️',
    6: '⛈️',
    7: '🌈',
    8: '❄️',
    9: '🔥'
  },
  faces: {
    1: '😀',
    2: '😂',
    3: '😍',
    4: '🤔',
    5: '😎',
    6: '😴',
    7: '😱',
    8: '🤯',
    9: '🥳'
  },
  octopus: {
    1: '🐙',
    2: '🐙',
    3: '🐙',
    4: '🐙',
    5: '🐙',
    6: '🐙',
    7: '🐙',
    8: '🐙',
    9: '🐙'
  }
};

interface Move {
  row: number;
  col: number;
  oldValue: number | null;
  newValue: number | null;
}

const generateNewPuzzle = () => {
  const solvedBoard = generateSolvedSudoku();

  // Create a copy for the puzzle and remove some cells
  const puzzle: number[][] = solvedBoard.map(row => [...row]);
  let cellsToRemove = 40; // medium difficulty

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return { solution: solvedBoard, initialPuzzle: puzzle };
};

const Sudoku = () => {
  // Emoji theme selection
  const [emojiTheme, setEmojiTheme] = useState<EmojiTheme>('animals');

  // Helper function to convert number to emoji based on selected theme
  const numberToEmoji = (num: number | null): string => {
    if (num === null) return '';
    return emojiThemes[emojiTheme][num] || '';
  };

  // Generate puzzle and solution
  const [puzzleData, setPuzzleData] = useState(() => generateNewPuzzle());

  // Current state of the grid (what the user sees)
  const [grid, setGrid] = useState<Grid>(() => {
    // Convert 0s to null for display
    return puzzleData.initialPuzzle.map(row => row.map(cell => cell === 0 ? null : cell));
  });

  // Track which cells were given in the initial puzzle (not user-filled)
  const [givenCells, setGivenCells] = useState<boolean[][]>(() => {
    return puzzleData.initialPuzzle.map(row => row.map(cell => cell !== 0));
  });

  // Track which cells have conflicts
  const [conflicts, setConflicts] = useState<boolean[][]>(() =>
    Array(9).fill(null).map(() => Array(9).fill(false))
  );

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Track move history for undo
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // Function to detect conflicts for a specific cell
  const detectConflicts = (currentGrid: Grid): boolean[][] => {
    const newConflicts: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = currentGrid[row][col];
        if (value === null) continue;

        // Check row for duplicates
        for (let c = 0; c < 9; c++) {
          if (c !== col && currentGrid[row][c] === value) {
            newConflicts[row][col] = true;
            newConflicts[row][c] = true;
          }
        }

        // Check column for duplicates
        for (let r = 0; r < 9; r++) {
          if (r !== row && currentGrid[r][col] === value) {
            newConflicts[row][col] = true;
            newConflicts[r][col] = true;
          }
        }

        // Check 3x3 box for duplicates
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const r = boxRow + i;
            const c = boxCol + j;
            if ((r !== row || c !== col) && currentGrid[r][c] === value) {
              newConflicts[row][col] = true;
              newConflicts[r][c] = true;
            }
          }
        }
      }
    }

    return newConflicts;
  };

  // Function to update cell value
  const updateCellValue = (row: number, col: number, value: number | null) => {
    // Don't allow editing given cells
    if (givenCells[row][col]) return;

    const oldValue = grid[row][col];

    // Don't record if value hasn't changed
    if (oldValue === value) return;

    const newGrid = grid.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    );

    setGrid(newGrid);
    setConflicts(detectConflicts(newGrid));

    // Record move for undo
    setMoveHistory([...moveHistory, { row, col, oldValue, newValue: value }]);
  };

  // Game control functions
  const handleNewGame = () => {
    const newPuzzle = generateNewPuzzle();
    setPuzzleData(newPuzzle);
    setGrid(newPuzzle.initialPuzzle.map(row => row.map(cell => cell === 0 ? null : cell)));
    setGivenCells(newPuzzle.initialPuzzle.map(row => row.map(cell => cell !== 0)));
    setConflicts(Array(9).fill(null).map(() => Array(9).fill(false)));
    setMoveHistory([]);
    setSelectedCell(null);
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newGrid = grid.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === lastMove.row && colIndex === lastMove.col ? lastMove.oldValue : cell
      )
    );

    setGrid(newGrid);
    setConflicts(detectConflicts(newGrid));
    setMoveHistory(moveHistory.slice(0, -1));
  };

  const handleHint = () => {
    // Find all empty cells (user-fillable cells that are currently null)
    const emptyCells: { row: number; col: number }[] = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!givenCells[row][col] && grid[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }

    // If no empty cells, puzzle is complete
    if (emptyCells.length === 0) {
      alert('💡❌');
      return;
    }

    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    // Fill it with the correct value
    const correctValue = puzzleData.solution[row][col];
    updateCellValue(row, col, correctValue);

    // Select the cell so user can see which one was filled
    setSelectedCell({ row, col });
  };

  const handleCheck = () => {
    let hasErrors = false;
    const newConflicts = detectConflicts(grid);

    // Check if there are any conflicts
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newConflicts[row][col]) {
          hasErrors = true;
          break;
        }
      }
      if (hasErrors) break;
    }

    // Check if puzzle is complete
    let isComplete = true;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }

    if (hasErrors) {
      alert('❌⚠️');
    } else if (isComplete) {
      alert('🎉✨🏆');
    } else {
      alert('👍✅');
    }
  };

  const handleNumberClick = (num: number) => {
    if (!selectedCell) return;
    updateCellValue(selectedCell.row, selectedCell.col, num);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // Handle number input (1-9)
    if (e.key >= '1' && e.key <= '9') {
      updateCellValue(row, col, parseInt(e.key));
    }

    // Handle backspace/delete to clear cell
    if (e.key === 'Backspace' || e.key === 'Delete') {
      updateCellValue(row, col, null);
    }

    // Handle arrow key navigation
    if (e.key === 'ArrowUp' && row > 0) {
      setSelectedCell({ row: row - 1, col });
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && row < 8) {
      setSelectedCell({ row: row + 1, col });
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && col > 0) {
      setSelectedCell({ row, col: col - 1 });
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' && col < 8) {
      setSelectedCell({ row, col: col + 1 });
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, grid]);

  // Auto-win when octopus theme is selected (Linky always wins!)
  useEffect(() => {
    if (emojiTheme === 'octopus') {
      // Fill the grid with the solution
      const solvedGrid: Grid = puzzleData.solution.map(row => [...row]);
      setGrid(solvedGrid);
      setConflicts(Array(9).fill(null).map(() => Array(9).fill(false)));
      // Show victory message after a brief delay
      setTimeout(() => {
        alert('🏆🏁🐙🏁🏆');
      }, 500);
    }
  }, [emojiTheme]);

  // Calculate which numbers are fully used (appear 9 times)
  const numberCounts = useMemo(() => {
    const counts: { [key: number]: number } = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
    };

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col];
        if (value !== null && value >= 1 && value <= 9) {
          counts[value]++;
        }
      }
    }

    return counts;
  }, [grid]);

return (
    <div className="sudoku-container">
      <h1>🔥🎮💯</h1>
      <div className="game-layout">
        {/* Theme Selector */}
        <div className="theme-selector">
          <button
            onClick={() => setEmojiTheme('food')}
            className={`theme-btn ${emojiTheme === 'food' ? 'active' : ''}`}
            title="Food/Fruit"
          >
            🍎
          </button>
          <button
            onClick={() => setEmojiTheme('animals')}
            className={`theme-btn ${emojiTheme === 'animals' ? 'active' : ''}`}
            title="Animals"
          >
            🐶
          </button>
          <button
            onClick={() => setEmojiTheme('weather')}
            className={`theme-btn ${emojiTheme === 'weather' ? 'active' : ''}`}
            title="Weather/Nature"
          >
            ☀️
          </button>
          <button
            onClick={() => setEmojiTheme('faces')}
            className={`theme-btn ${emojiTheme === 'faces' ? 'active' : ''}`}
            title="Faces"
          >
            😀
          </button>
          <button
            onClick={() => setEmojiTheme('octopus')}
            className={`theme-btn ${emojiTheme === 'octopus' ? 'active' : ''}`}
            title="Linky (Auto-Win!)"
          >
            🐙
          </button>
        </div>

        {/* Center: Sudoku Grid */}
        <div className="grid-section">
          <div className="sudoku-grid">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="sudoku-row">
                {row.map((cell, colIndex) => {
                  const isGiven = givenCells[rowIndex][colIndex];
                  const hasConflict = conflicts[rowIndex][colIndex];
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                  // Highlight same row or column as selected cell
                  const isSameRow = selectedCell?.row === rowIndex && !isSelected;
                  const isSameCol = selectedCell?.col === colIndex && !isSelected;

                  // Highlight cells with same number as selected cell
                  const selectedValue = selectedCell ? grid[selectedCell.row][selectedCell.col] : null;
                  const isSameNumber = selectedValue !== null &&
                                       cell === selectedValue &&
                                       !isSelected;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`sudoku-cell ${
                        isSelected ? 'selected' : ''
                      } ${
                        isGiven ? 'given' : 'user-filled'
                      } ${
                        hasConflict ? 'conflict' : ''
                      } ${
                        isSameRow || isSameCol ? 'highlighted-cross' : ''
                      } ${
                        isSameNumber ? 'same-number' : ''
                      } ${
                        (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'right-border' : ''
                      } ${
                        (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'bottom-border' : ''
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {numberToEmoji(cell)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Controls and Number Pad */}
        <div className="controls-section">
          {/* Game Controls */}
          <div className="game-controls">
            <button onClick={handleNewGame} className="control-btn">🔄</button>
            <button onClick={handleUndo} className="control-btn" disabled={moveHistory.length === 0}>↩️</button>
            <button onClick={handleHint} className="control-btn">💡</button>
            <button onClick={handleCheck} className="control-btn">✅</button>
          </div>

          {/* Number Pad */}
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
              const isFullyUsed = numberCounts[num] >= 9;
              const isDisabled = !selectedCell ||
                                (selectedCell && givenCells[selectedCell.row][selectedCell.col]) ||
                                isFullyUsed;

              return (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="number-btn"
                  disabled={isDisabled}
                >
                  {numberToEmoji(num)}
                </button>
              );
            })}
            <button
              onClick={() => selectedCell && updateCellValue(selectedCell.row, selectedCell.col, null)}
              className="number-btn clear-btn"
              disabled={!selectedCell || (selectedCell && givenCells[selectedCell.row][selectedCell.col])}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sudoku;
