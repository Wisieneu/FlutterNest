# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy pnpm-lock.yaml and package.json
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install frontend dependencies
RUN pnpm install

# Copy the rest of the frontend files
COPY frontend .

RUN pnpm install

# Expose the port the app runs on
EXPOSE 6700

# Command to run the frontend
CMD ["pnpm", "start"]
