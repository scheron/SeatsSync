CYAN = \033[0;36m
YELLOW = \033[0;33m
NC = \033[0m 

.PHONY: dev dev-stop clean db

dev:
	@echo "$(YELLOW)Stopping previous containers if any...$(NC)"
	docker-compose down
	@echo "$(YELLOW)Starting project in development mode...$(NC)"
	docker-compose up

dev-stop:
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker-compose down

db:
	@echo "$(YELLOW)Starting only PostgreSQL database...$(NC)"
	docker-compose up -d postgres 

clean:
	@echo "$(YELLOW)Cleaning up containers and volumes...$(NC)"
	docker-compose down -v