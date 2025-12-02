# Build stage
FROM cgr.dev/chainguard/node:latest AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM cgr.dev/chainguard/node:latest

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies and add serve globally
RUN npm ci --production && npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["serve", "-s", "dist", "-l", "3000"]
