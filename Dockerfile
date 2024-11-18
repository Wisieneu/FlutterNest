FROM node:18-alpine

WORKDIR /

COPY . .

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "start"]