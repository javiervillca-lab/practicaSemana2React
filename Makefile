#!/bin/bash

UID = $(shell id -u)
DOCKER_FE = practica-semana2-react-dev

help: ## Show this help message
	@echo 'usage: make [target]'
	@echo
	@echo 'targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

build: ## Rebuilds all the containers
	docker compose build

up: ## Up the containers
	docker compose up -d

stop: ## Stop the containers
	docker compose stop

reup: ## Stop the containers
	$(MAKE) stop && $(MAKE) up

rebuild: ## Restart the containers
	$(MAKE) stop && $(MAKE) build

up-prod: ## Up in prod enviroment
	docker compose -f docker-compose.prod.yml up -d

stop-prod: ## Stop prod containers
	docker compose -f docker-compose.prod.yml stop

# Backend commands
npm-install-nointeraction: # Installs npm dependencies
	userid=${UID} docker exec --user ${UID} ${DOCKER_FE} npm install

bash: ## bash into the frontend container
	#userid=${UID} docker exec -it --user ${UID} ${DOCKER_FE} sh
	docker exec -it ${DOCKER_FE} sh

