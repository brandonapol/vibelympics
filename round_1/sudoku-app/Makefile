.PHONY: help build run stop restart clean dev logs test

# Default target
help:
	@echo "🔥🎮💯 Emoji Sudoku - Available Commands:"
	@echo ""
	@echo "  make build     - Build the Docker image"
	@echo "  make run       - Run the app in Docker (http://localhost:3000)"
	@echo "  make stop      - Stop the running container"
	@echo "  make restart   - Restart the container"
	@echo "  make clean     - Stop and remove container + image"
	@echo "  make dev       - Run in development mode (no Docker)"
	@echo "  make logs      - View container logs"
	@echo "  make test      - Run tests"
	@echo ""
	@echo "🐙 Quick start: make build && make run"

# Build the Docker image
build:
	@echo "🔨 Building Docker image..."
	docker build -t emoji-sudoku:latest .
	@echo "✅ Build complete!"

# Run the container
run:
	@echo "🚀 Starting Emoji Sudoku..."
	docker run -d --name emoji-sudoku -p 3000:8080 emoji-sudoku:latest
	@echo "✅ Running at http://localhost:3000"
	@echo "🐙 Don't forget to try the Linky theme!"

# Stop the container
stop:
	@echo "🛑 Stopping container..."
	docker stop emoji-sudoku 2>/dev/null || true
	docker rm emoji-sudoku 2>/dev/null || true
	@echo "✅ Stopped!"

# Restart the container
restart: stop run

# Clean up everything
clean: stop
	@echo "🧹 Cleaning up..."
	docker rmi emoji-sudoku:latest 2>/dev/null || true
	@echo "✅ Cleaned!"

# Run in development mode (no Docker)
dev:
	@echo "🔧 Starting development server..."
	npm install
	npm run dev

# View logs
logs:
	@echo "📋 Container logs:"
	docker logs -f emoji-sudoku

# Run tests
test:
	@echo "🧪 Running tests..."
	npm test

# One command to rule them all
all: build run
	@echo "🎉 All done! Visit http://localhost:3000"
