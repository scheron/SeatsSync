ifneq (,$(wildcard ./.env))
    include .env
    export
endif

DOCKER = docker-compose
POSTGRES_CONTAINER = seats_sync

install:
	cd backend && bun install
	cd frontend && bun install

start-db:
	$(DOCKER) up -d

stop-db:
	$(DOCKER) down

restart-db:
	$(DOCKER) down && $(DOCKER) up -d

create-db:
	@echo "Creating database with user: $(POSTGRES_USER) and database: $(POSTGRES_DB)"
	@docker exec -i $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='$(POSTGRES_DB)'" | grep -q 1 || \
	docker exec -i $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d postgres -c "CREATE DATABASE $(POSTGRES_DB);"

init-db:
	@cd backend && bun prisma db push

seed-db:
	@cd backend && bun run scripts/seed.js

setup:
	make install
	make start-db
	make create-db
	make init-db
	make seed-db