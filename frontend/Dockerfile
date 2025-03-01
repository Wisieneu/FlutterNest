FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

RUN npm install -g pnpm

COPY frontend/package.json ./frontend/
RUN pnpm install --filter ./frontend

# Copy the rest of the files (apart from ones listed in .dockerignore)
COPY frontend ./frontend

# Expose the port the app runs on
EXPOSE 6700

# Command to run the frontend
CMD ["pnpm", "run", "start:frontend:prod"]
