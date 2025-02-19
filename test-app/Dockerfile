FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

RUN npm install -g pnpm

COPY test-app/package.json ./test-app/
RUN pnpm install --filter ./test-app

# Copy the rest of the files (apart from ones listed in .dockerignore)
COPY test-app ./test-app

WORKDIR /app/test-app

# No need to expose ports or run commands