# Build stage
FROM node:18.17-alpine AS builder

ARG NODE_ENV

WORKDIR /home/node

ENV NODE_ENV=${NODE_ENV} \
    TZ=Asia/Seoul

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    npm i -g pnpm@8.7.1 pm2

COPY package.json pnpm-lock.yaml prisma ./

RUN pnpm i --prod;

COPY . .

RUN pnpm build

# Production stage
FROM node:18.17-alpine

ARG NODE_ENV

WORKDIR /home/node

ENV TZ=Asia/Seoul

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    npm i -g pnpm@8.7.1 pm2 && \
    rm -rf /var/cache/apk/*

COPY --from=builder /home/node/dist ./dist
COPY --from=builder /home/node/src/excel ./dist/src/excel
COPY --from=builder /home/node/node_modules ./node_modules
COPY --from=builder /home/node/.env ./
COPY --from=builder /home/node/package.json ./
COPY --from=builder /home/node/pnpm-lock.yaml ./