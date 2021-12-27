up:
  docker compose up

pull:
  docker compose pull

clear:
  docker compose rm -f
  rm -rf .data

down:
  docker compose down

types:
  npm run codegen

build:
  npm run build

bug: build reset start
sub: types build

reset:
  npm run db:reset

again:
  npm run db:reset
  npm run db:migrate

start:
  npm run processor:start

migrate NAME:
  npm run db:create-migration -n "{{NAME}}"

test:
  npm run test:unit

query:
  npm run query-node:start