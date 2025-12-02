# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - use Chainguard nginx
FROM cgr.dev/chainguard/nginx:latest

# Copy built files to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Chainguard nginx runs on port 8080 by default
EXPOSE 8080
