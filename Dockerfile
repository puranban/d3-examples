# Use official Node.js image with Alpine
FROM node:23-alpine

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml /app/
