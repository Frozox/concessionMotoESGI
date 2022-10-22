include .env.local
export

install:
	docker volume create postgres_data
	docker compose up -d --build
	yarn

start-db:
	docker compose up -d

start-api:
	yarn dev

start-ui:
	yarn dev

stop:
	docker compose down

down:
	docker compose down --volumes

migrate:
	yarn migrate