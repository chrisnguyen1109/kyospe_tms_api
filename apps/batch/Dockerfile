# Stage 1
FROM node:18.16-alpine3.17 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .

RUN yarn build batch

# Stage 2
FROM node:18.16-alpine3.17

WORKDIR /app

ARG VERSION

ENV VERSION=$VERSION

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist/apps/batch .

CMD [ "node", "/app/main.js" ]
