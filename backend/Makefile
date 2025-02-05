IMAGE_NAME = infectedbyjs/seats-sync-backend
VERSION ?= $(or $(V),latest)

# Colors for output
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m 

.PHONY: help dev dev-stop status

help:
	@echo "$(CYAN)Available commands:$(NC)"
	@echo "$(GREEN)make dev$(NC)      - Start project in development mode"
	@echo "$(GREEN)make dev-stop$(NC) - Stop development environment"
	@echo "$(GREEN)make status$(NC)   - Check containers status and logs"

# Development commands
dev:
	@echo "$(YELLOW)Starting project in development mode...$(NC)"
	docker-compose up --build

dev-stop:
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker-compose down

# Status checking
status:
	@echo "$(CYAN)Checking deployment status:$(NC)"
	@echo "\n$(YELLOW)1. Running containers:$(NC)"
	@docker ps
	@echo "\n$(YELLOW)2. Container logs:$(NC)"
	@docker-compose logs --tail=20