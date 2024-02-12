COMPOSE_FILE := docker-compose.yml
CMD := docker compose -f $(COMPOSE_FILE)

.PHONY: help up down stop clean prune all logs ps

all: up

help: ## Display available commands in this Makefile
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

config: ## Display docker-compose file config if no syntax error
	$(CMD) config

logs: ## Show logs for all containers
	$(CMD) logs -f

up: ## Start containers defined in docker-compose.yml
	$(CMD) up -d --build

ps: ## Show current active dockers
	$(CMD) ps

down: ## Stop and remove containers defined in docker-compose.yml
	$(CMD) down

stop: ## Stop containers defined in docker-compose.yml
	$(CMD) stop

clean: stop ## Stop and remove containers, networks, and volumes
	$(CMD) down -v --remove-orphans
	$(CMD) rm -f

prune: clean ## Remove all unused containers, networks, images, and volumes
	docker system prune -af