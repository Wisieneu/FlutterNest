FROM node:20-alpine3.21

WORKDIR /app

# # Set environment variables for Playwright
# ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin
# ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

RUN npm install -g pnpm

COPY test-app/package.json ./test-app/
RUN pnpm install --filter ./test-app

# Copy the rest of the files (apart from ones listed in .dockerignore)
COPY test-app ./test-app

# CMD ["pnpm", "test", "--reporter", "list"]