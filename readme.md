# Connect Snake

An implementation of the game Snake inspired by the classic Connect Four game and [this gif](https://imgur.com/gallery/GBrEM)!

## Background

This is the sourcecode for the connect snake game at [blog.brahmlower.io/connect-snake-game](https://blog.brahmlower.io/connect-snake-game/). Controls are arrow keys, and Space will start/pause.

## Using the library

You can install connect-snake via npm:

```
npm install git+https://github.com/bplower/connect-snake.git
```

The example directory shows the component usage, though there isn't much configuration available at this time. A good deal of energy was put into abstracting the display image from the game itself, so it should be pretty easy to implement other games like [tetris](https://i.imgur.com/FOjGkkX.mp4) or [pong](https://i.imgur.com/Sw0xnSq.mp4).

## Development

1. clone repo
2. npm install
3. profit?

### Storybook

You may need to set the following:

```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

Then start storybook:

```
npm run storybook
```

### Running the Example

Build the package first, then install the dependencies in the example:

```
npm build
npm pack
cd example
rm -rf node_modules
npm install
npm start
```

## Bugs/Issues/Contributions

If you found a horrible bug or would like to improve this project in some way, feel free to open a pull request or Issue. If you have questions but are less comfortable posting in a public forum, feel free to email me!
