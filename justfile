up:
  docker compose up

pull:
  docker compose pull

clear:
  docker compose rm -f
  rm -rf .data

types:
  rm -rf src/types
  yarn codegen

build:
  npm run build

bug: clear build up
sub: types build

start:
  npm run processor:start

migrate NAME:
  npm run db:create-migration -n "{{NAME}}"