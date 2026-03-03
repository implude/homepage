FROM oven/bun:alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.json astro.config.mjs svelte.config.js ./
COPY ./public ./public
COPY ./src ./src

ARG MEMBERS_API_URL
ENV MEMBERS_API_URL=${MEMBERS_API_URL}

RUN bun run build

FROM oven/bun:alpine AS runtime

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080
ENTRYPOINT ["bun", "run", "start"]