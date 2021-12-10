up:
  docker-compose up

clear:
  docker-compose rm -f
  rm -rf .data

types:
  rm -rf src/types
  yarn codegen

build:
  rm -rfv dist
  yarn build

bug: clear build up
sub: types build

run:
  npm run processor:start