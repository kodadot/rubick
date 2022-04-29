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
	npx sqd codegen

typegen: ksmVersion
	npx squid-substrate-typegen typegen.json

ksmVersion: explore

explore:
	npx squid-substrate-metadata-explorer \
		--chain wss://kusama-rpc.polkadot.io \
		--archive https://kusama.indexer.gc.subsquid.io/v4/graphql \
		--out kusamaVersions.json

bug: down up

reset:
	npx sqd db drop
	npx sqd db create
	npx sqd db:migrate

migrate:
	npx sqd db:migrate

update-db:
	npx sqd db:create-migration Data

test:
  npm run test:unit

improve TAG:
	npx sqd squid:update rubick@{{TAG}}

release TAG:
	npx sqd squid:release rubick@{{TAG}}

kill TAG:
	npx sqd squid:kill "rubick@{{TAG}}"

tail TAG:
	npx sqd squid:tail rubick@{{TAG}} -f

update-deps:
	npx npm-check-updates -u

exec:
	docker exec -it rubick-db-1 psql -U postgres -d squid
