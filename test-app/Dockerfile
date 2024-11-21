# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy pnpm-lock.yaml and package.json
COPY test-app/package.json test-app/pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies without starting the app
RUN pnpm install

# No need to expose ports or run commands
