FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
COPY prisma ./prisma/
COPY scripts ./scripts/

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN bun run prisma generate

RUN bun run build

EXPOSE ${PORT}

CMD ["sh", "-c", "\
    echo 'Waiting for database...' && \
    sleep 5 && \
    echo 'Running migrations...' && \
    bunx prisma migrate deploy && \
    echo 'Seeding database...' && \
    bun run scripts/seed.js && \
    echo 'Starting application...' && \
    bun run start"]
