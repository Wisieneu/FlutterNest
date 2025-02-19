FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

RUN npm install -g pnpm

COPY backend/package.json ./backend/
RUN pnpm install --filter ./backend

# Copy the rest of the files (apart from ones listed in .dockerignore)
COPY backend ./backend

# Expose the port the app runs on
EXPOSE 6699

# Command to run the backend
CMD ["pnpm", "run", "start:backend"]