include .env.local
export

install:
	docker volume create postgres_data
	docker compose up -d --build
	yarn

start-db:
	docker compose up -d

start:
	yarn dev

stop:
	docker compose down

down:
	docker compose down --volumes
	docker volume remove postgres_data

migrate:
	yarn migrate

prisma-studio:
	yarn prisma studio