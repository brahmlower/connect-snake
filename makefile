
setup:
	npm install

lint:
	node_modules/eslint/bin/eslint.js connect-snake.js

build:
	mkdir -p public
	cp example.html public/index.html
	cp -r static public/.
	node_modules/webpack/bin/webpack.js ./example.js --output public/bundle.js

serve:
	node_modules/serve/bin/serve.js public
