# Standard Backstage Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile && yarn build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 7007

CMD ["yarn", "start"]
