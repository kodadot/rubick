FROM node:14 AS builder
WORKDIR /hydra-build
ADD package.json .
ADD package-lock.json .
RUN npm ci
ADD tsconfig.json .
ADD src src
RUN npm run build


FROM node:14 AS processor
WORKDIR /hydra-project
ADD package.json .
ADD package-lock.json .
RUN npm ci # TODO: --production
COPY --from=builder /hydra-build/lib lib
ADD db db
ADD manifest.yml .
ADD schema.graphql .
ADD .env .
CMD ["npm", "run", "processor:start"]


FROM processor AS query-node
CMD ["node", "./lib/generated/server.js"]
