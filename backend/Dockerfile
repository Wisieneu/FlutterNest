# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy pnpm-lock.yaml and package.json
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install backend dependencies
RUN pnpm install

# Copy the rest of the backend files
COPY backend .

RUN pnpm install

# Expose the port the app runs on
EXPOSE 6699

# Command to run the backend
CMD ["pnpm", "start"]
