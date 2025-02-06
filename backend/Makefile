CYAN = \033[0;36m
YELLOW = \033[0;33m
NC = \033[0m 

.PHONY: dev dev-stop status clean db

dev:
	@echo "$(YELLOW)Stopping previous containers if any...$(NC)"
	docker-compose down
	@echo "$(YELLOW)Starting project in development mode...$(NC)"
	docker-compose up

dev-stop:
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker-compose down

# Команда для запуска только базы данных
db:
	@echo "$(YELLOW)Starting only PostgreSQL database...$(NC)"
	docker-compose up postgres

status:
	@echo "$(CYAN)Checking deployment status:$(NC)"
	@echo "\n$(YELLOW)1. Running containers:$(NC)"
	@docker ps
	@echo "\n$(YELLOW)2. Container logs:$(NC)"
	@docker-compose logs --tail=20

clean:
	@echo "$(YELLOW)Cleaning up containers and volumes...$(NC)"
	docker-compose down -v