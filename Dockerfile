# Build
FROM node:18-alpine AS build

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build

# App
FROM node:18-alpine AS app

WORKDIR /app

COPY --from=build /app/.env         /app/.env
COPY --from=build /app/.sequelizerc /app/.sequelizerc
COPY --from=build /app/db           /app/db
COPY --from=build /app/dist         /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000

CMD ["yarn", "start:prod"]
