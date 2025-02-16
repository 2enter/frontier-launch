# Use the Node.js base image
FROM oven/bun:latest as builder

# Set the working directory
WORKDIR /app

# Copy the frontend code
COPY . .

# Build app
RUN bun install && bun run build


