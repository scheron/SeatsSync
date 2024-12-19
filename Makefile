ifneq (,$(wildcard ./.env))
    include .env
    export
endif

DOCKER_COMPOSE = cd backend && docker-compose
POSTGRES_CONTAINER = seats_sync
FRONTEND_DIR = frontend
BACKEND_DIR = backend

.PHONY: install start-db stop-db restart-db create-db init-db seed-db setup lint format

install:
	@echo "Installing dependencies..."
	cd $(BACKEND_DIR) && bun install
	cd $(FRONTEND_DIR) && bun install

start-db:
	@echo "Starting database..."
	$(DOCKER_COMPOSE) up -d

stop-db:
	@echo "Stopping database..."
	$(DOCKER_COMPOSE) down

restart-db:
	@echo "Restarting database..."
	$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up -d

create-db:
	@echo "Creating database with user: $(POSTGRES_USER) and database: $(POSTGRES_DB)"
	@docker exec -i $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='$(POSTGRES_DB)'" | grep -q 1 || \
	docker exec -i $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d postgres -c "CREATE DATABASE $(POSTGRES_DB);"

init-db:
	@echo "Initializing database schema..."
	cd $(BACKEND_DIR) && bun prisma db push

seed-db:
	@echo "Seeding database..."
	cd $(BACKEND_DIR) && bun run scripts/seed.js

lint:
	@echo "Running linter for both frontend and backend..."
	cd $(FRONTEND_DIR) && bun run lint
	cd $(BACKEND_DIR) && bun run lint

format:
	@echo "Running Prettier to format code..."
	cd $(FRONTEND_DIR) && bun run format
	cd $(BACKEND_DIR) && bun run format

setup:
	@echo "Setting up project..."
	make install
	make start-db
	make create-db
	make init-db
	make seed-db