
.DEFAULT_GOAL := help

.PHONY: help
help: ## Shows this help menu
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: setup
setup: ## Install npm deps
	npm install

.PHONY:
lint: ## lint source
	node_modules/eslint/bin/eslint.js connect-snake.js

.PHONY: build
build: ## Webpack and build public dir
	mkdir -p public
	cp example.html public/index.html
	cp -r static public/.
	node_modules/webpack/bin/webpack.js ./example.js --output public/bundle.js

.PHONY: serve
serve: ## Serve public dir on http://localhost:5000
	node_modules/serve/bin/serve.js public
