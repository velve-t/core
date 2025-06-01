FROM oven/bun:latest as builder

WORKDIR /core/app

COPY core/app/package.json core/app/bun.lock ./
RUN bun install

COPY core/app .

FROM oven/bun:runtime as runtime

WORKDIR /core/app

COPY --from=builder /core/app /core/app

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "next", "start"]