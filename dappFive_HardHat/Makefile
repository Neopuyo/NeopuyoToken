# Shortcuts
COMPOSE_FILE := docker-compose.yml
CMD := docker compose -f $(COMPOSE_FILE)
NAME := $(shell cat .env | grep NAME | cut -d'=' -f2)

# Design 
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[0;33m
BLUE=\033[0;34m
MAGENTA=\033[0;35m
CYAN=\033[0;36m
WHITE=\033[0;37m
END=\033[0m

.PHONY: help up down stop clean prune all logs ps

$(NAME): all

all: up

help: ## Display available commands in this Makefile
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

config: ## Display docker-compose file config if no syntax error
	$(CMD) config

logs: ## Show logs for all containers
	$(CMD) logs -f

up: ## Start containers defined in docker-compose.yml
	@echo "$(GREEN)Starting container : $(CYAN)$(NAME)$(END)"
	@echo "$(GREEN)Starting container : $(CYAN)$(NAME)-frontend$(END)"
	$(CMD) up -d --build

ps: ## Show current active dockers
	$(CMD) ps

exec: ## Exec bash into the main container
	docker exec -it $(NAME) bash

execf: ## Exec bash into the froontend container
	docker exec -it $(NAME)-frontend bash 

down: ## Stop and remove containers defined in docker-compose.yml
	$(CMD) down

stop: ## Stop containers defined in docker-compose.yml
	$(CMD) stop

clean: stop ## Stop and remove containers, networks, and volumes
	$(CMD) down -v --remove-orphans
	$(CMD) rm -f

prune: clean ## Remove all unused containers, networks, images, and volumes
	docker system prune -af