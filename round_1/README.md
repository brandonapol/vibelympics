# 🔥🎮💯 Emoji Sudoku

A fun, emoji-themed Sudoku game built with React and TypeScript. Choose from five different emoji themes to play—including a special Linky mode that automatically wins!

## Features

- 🎨 Five emoji themes:
  - 🍎 Food/Fruit: 🍎 🍊 🍋 🍌 🍉 🍇 🍓 🍒 🥝
  - 🐶 Animals: 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨
  - ☀️ Weather/Nature: ☀️ 🌙 ⭐ ☁️ 🌧️ ⛈️ 🌈 ❄️ 🔥
  - 😀 Faces: 😀 😂 😍 🤔 😎 😴 😱 🤯 🥳
  - 🐙 **Linky Mode**: All octopuses, all the time (auto-win!)
- ✨ Smart highlighting for selected cells, rows, and columns
- 🔍 Conflict detection for invalid moves
- 💡 Hint system
- ↩️ Undo functionality
- 🎯 Puzzle validation
- 📱 Responsive design for mobile and desktop

## Prerequisites

- Node.js 18+ or Docker

## Local Development

### Install dependencies
```bash
cd sudoku-app
npm install
```

### Run development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Run tests
```bash
npm test
```

## Docker Instructions

### Build the Docker image
```bash
cd sudoku-app
docker build -t emoji-sudoku:latest .
```

### Run the container
```bash
docker run -p 3000:3000 emoji-sudoku:latest
```

The app will be available at `http://localhost:3000`

### Using Docker Compose (optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  sudoku-app:
    build: ./sudoku-app
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

## How to Play

1. 🎨 **Choose a theme**: Click one of the five emoji theme buttons on the left (try the 🐙 for a surprise!)
2. 🎯 **Select a cell**: Click any empty cell on the grid
3. 🔢 **Enter an emoji**: Click an emoji from the number pad or use keyboard 1-9
4. 🗑️ **Clear a cell**: Select a cell and click the trash emoji or press Backspace/Delete
5. 💡 **Get a hint**: Click the lightbulb emoji to reveal one correct answer
6. ↩️ **Undo**: Click the undo arrow to reverse your last move
7. ✅ **Check progress**: Click the checkmark to validate your puzzle
8. 🔄 **New game**: Click the refresh emoji to start a new puzzle

## Game Controls

- **🔄** New Game - Generate a new puzzle
- **↩️** Undo - Reverse your last move
- **💡** Hint - Fill in one correct cell
- **✅** Check - Validate your current progress
- **🗑️** Clear - Empty the selected cell

## Technology Stack

- ⚛️ React 19
- 📘 TypeScript
- ⚡ Vite
- 🎨 CSS3
- 🐳 Docker (Chainguard Node.js base image)

## License

MIT
