process: build
	node -r dotenv/config lib/processor.js

serve:
	npx squid-graphql-server

up:
  docker compose up

pull:
  docker compose pull

clear:
  docker compose rm -f
  rm -rf .data

down:
  docker compose down

build:
	npm run build

codegen:
	npx squid-typeorm-codegen

typegen: ksmVersion

ksmVersion: explore

explore:
	npx squid-substrate-metadata-explorer \
	--chain wss://kusama-rpc.polkadot.io \
	--archive https://kusama.archive.subsquid.io/graphql \
	--out kusamaVersions.jsonl

bug: down up

reset:
	npx squid-typeorm-migration drop
	npx squid-typeorm-migration create
	npx squid-typeorm-migration migrate

migrate:
	npx squid-typeorm-migration migrate

update-db:
	npx squid-typeorm-migration create-migration Data

test:
  npm run test:unit

improve TAG:
	npx sqd squid:update rubick@{{TAG}}

release TAG:
	npx sqd squid:release rubick@{{TAG}}

kill TAG:
	npx sqd squid:kill "rubick@{{TAG}}"

tail TAG:
	npx sqd squid logs rubick@{{TAG}} -f

brutal TAG:
	npx sqd squid:update rubick@{{TAG}} --hardReset

update-deps:
	npx npm-check-updates -u

exec:
	docker exec -it rubick-db-1 psql -U postgres -d squid

check: codegen build
