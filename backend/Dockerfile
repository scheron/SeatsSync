FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN bun run prisma generate

RUN bun run build

EXPOSE ${PORT}

CMD /bin/sh -c 'sleep 5 && bunx prisma migrate deploy && bun run start'
