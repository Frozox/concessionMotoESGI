include .env.local
export

install:
	docker volume create postgres-data
	docker compose up -d --build
	yarn --cwd "./Web.API" install
	yarn --cwd "./Web.UI" install

start-db:
	docker compose up -d

start-api:
	yarn --cwd "./Web.API" dev

start-ui:
	yarn --cwd "./Web.UI" dev

stop:
	docker compose down

down:
	docker compose down --volumes

migrate:
	yarn --cwd "./Web.API" migrate