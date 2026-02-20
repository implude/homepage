FROM oven/bun:alpine AS base
WORKDIR /app

FROM base AS build

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run astro build

FROM oven/bun:alpine AS runtime
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.ts ./server.ts

EXPOSE 8080
ENTRYPOINT ["bun", "run", "start"]