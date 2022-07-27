import { ConnectBoardDriver, ConnectBoardRenderer, HoleType } from '../ConnectBoardDriver';
import { PlayerInput, Scene } from './common';

const STARTING_INTERVAL = 600;
const INTERVAL_DECREASE = 10;
const SNAKE_HOLE_TYPE = HoleType.Yellow;
const FOOD_HOLE_TYPE = HoleType.Red;
const GAME_OVER_NUM_FLASHES = 5;

class HoleCoordinate {
  x: number;

  y: number;

  holeType: HoleType;

  constructor(x: number, y: number, holeType: HoleType) {
    this.x = x;
    this.y = y;
    this.holeType = holeType;
  }

  asIndex(): number {
    return this.y * 7 + this.x;
  }
}

enum Direction {
  Up,
  Left,
  Down,
  Right,
}

class EntitySnake {
  protected direction: Direction = Direction.Down;

  positions: HoleCoordinate[] = [];

  constructor() {
    // Snake starts where the kid is dropping the token
    const firstPosition = EntitySnake.newPosition(4, 0);
    this.positions.push(firstPosition);
  }

  static newPosition(x: number, y: number): HoleCoordinate {
    return new HoleCoordinate(x, y, SNAKE_HOLE_TYPE);
  }

  move(ateFood: boolean) {
    this.positions.splice(0, 0, this.nextPosition());

    if (!ateFood) {
      this.positions.pop();
    }
  }

  nextPosition(): HoleCoordinate {
    const head = this.headPosition();
    switch (this.direction) {
      case Direction.Up:
        return EntitySnake.newPosition(head.x, head.y - 1);
      case Direction.Left:
        return EntitySnake.newPosition(head.x - 1, head.y);
      case Direction.Down:
        return EntitySnake.newPosition(head.x, head.y + 1);
      case Direction.Right:
        return EntitySnake.newPosition(head.x + 1, head.y);
    }
  }

  headPosition(): HoleCoordinate {
    return this.positions[0]!;
  }

  positionCollides(pos: HoleCoordinate): boolean {
    return this.positions.includes(pos);
  }

  setDirection(direction: Direction): boolean {
    // Check if the direction is opposite of the current direction by
    // checking if the given direction is "opposite" of the current direction
    if ((direction + 2) % 4 === this.direction) {
      console.debug('[EntitySnake] Snake cannot reverse direction');
      return false;
    }

    this.direction = direction;
    return true;
  }
}

interface NewGameState {}

class PlayingGameState {
  lastUpdate: number = Date.now();

  interval: number = STARTING_INTERVAL;

  food: HoleCoordinate | null = null;

  snake: EntitySnake;

  paused = false;

  constructor() {
    this.snake = new EntitySnake();
    this.newFood();
  }

  newFood() {
    const snakeIndexes: number[] = this.snake.positions.map((pos) => pos.asIndex());

    // Start with the list of possible indexes
    const availablePosIndexes: number[] = [];
    for (let i = 0; i < 42; i++) {
      if (!snakeIndexes.includes(i)) {
        availablePosIndexes.push(i);
      }
    }

    // Pick a random index from the array and create a food for it
    const posIndex = availablePosIndexes[Math.floor(Math.random() * availablePosIndexes.length)]!;
    const posX = posIndex % 7;
    const posY = Math.floor(posIndex / 7);
    this.food = new HoleCoordinate(posX, posY, FOOD_HOLE_TYPE);
    console.debug('[PlayingGameState] Generated new food at: ', this.food);
  }

  getUsedPositions(): HoleCoordinate[] {
    return this.snake.positions.concat(
      this.food ? [this.food] : [],
    );
  }
}

interface GameOverState {
  numFlashes: number;
  flashPartDuration: number;
  flashPartCount: number;
  lastUpdate: number;
  finalGameState: PlayingGameState;
}

class NewGameScene implements Scene<NewGameState, SnakeControllerInput> {
  state: NewGameState;

  constructor() {
    this.state = {};
  }

  initialRender(driver: ConnectBoardDriver) {
    driver.clearHoles();
    driver.flush();
  }

  tick(driver: ConnectBoardDriver, input: PlayerInput<SnakeControllerInput> | null): Scene<PlayingGameState, any> | undefined {
    if (input === null) {
      return undefined;
    }

    // If the user starts the game, then transition to the playing
    // scene. Otherwise do nothing
    if (input.latestInput() === SnakeControllerInput.StartToggle) {
      console.debug('[NewGameScene] transitioning to next scene PlayingGameScene');
      return new PlayingGameScene();
    }
    return undefined;
  }
}

class PlayingGameScene implements Scene<PlayingGameState, SnakeControllerInput> {
  state: PlayingGameState;

  constructor() {
    this.state = new PlayingGameState();
  }

  applyControllerInput(controllerInput: SnakeControllerInput): void {
    switch (controllerInput) {
      case SnakeControllerInput.StartToggle:
        this.state.paused = !this.state.paused;
        return;
      case SnakeControllerInput.Up:
        this.state.snake.setDirection(Direction.Up);
        return;
      case SnakeControllerInput.Left:
        this.state.snake.setDirection(Direction.Left);
        return;
      case SnakeControllerInput.Down:
        this.state.snake.setDirection(Direction.Down);
        return;
      case SnakeControllerInput.Right:
        this.state.snake.setDirection(Direction.Right);
    }
  }

  initialRender(driver: ConnectBoardDriver) {
    this.state.getUsedPositions().forEach((position: HoleCoordinate) => {
      driver.setHole(position.x, position.y, position.holeType);
    });
    driver.flush();
  }

  tick(driver: ConnectBoardDriver, input: PlayerInput<SnakeControllerInput> | null): Scene<GameOverState, SnakeControllerInput> | undefined {
    // Check if it's time to move the snake forward. If so, update the timestamp
    // for the latest update and then proceed.
    const thisTickTime: number = Date.now();
    if (this.state.lastUpdate > (thisTickTime - this.state.interval)) {
      return undefined;
    }
    this.state.lastUpdate = thisTickTime;

    // Handle controller input

    // Evaluate if we should consider the game paused, in which case we will skip
    // rendering this game loop. The game can be paused in two instances:
    //   1. When the controller is disconnected (input === null)
    //   2. When the controller toggles pause to true
    // Situation 1 is handled here, but situation 2 is handled within the
    // applyControllerInput function
    if (input === null) {
      console.debug('[PlayingGameScene] No controller connected! Game paused');
      this.state.paused = true;
    }

    const controllerInput = input?.latestInput();
    if (controllerInput !== null && controllerInput !== undefined) {
      this.applyControllerInput(controllerInput);
    }

    // Skip the render loop if the game is paused
    if (this.state.paused === true) {
      return undefined;
    }

    // Apply velocity
    const nextPosition = this.state.snake.nextPosition();

    // Check if the snake is out of bounds
    if (nextPosition.x < 0 || nextPosition.x > 6 || nextPosition.y < 0 || nextPosition.y > 5) {
      console.debug('[PlayingGameScene] transitioning to next scene GameOverScene (reason: out of bounds)');
      return new GameOverScene(this.state);
    }

    // Check if the snake is on itself
    const snakeIndexes = this.state.snake.positions.map((p) => p.asIndex());
    if (snakeIndexes.includes(nextPosition.asIndex())) {
      console.debug('[PlayingGameScene] transitioning to next scene GameOverScene (reason: ate self)');
      return new GameOverScene(this.state);
    }

    // Check if the snake is on the food
    const ateFood = nextPosition.asIndex() === this.state.food?.asIndex();

    // Move the snake
    this.state.snake.move(ateFood);

    // Generate new food if needed
    if (ateFood) {
      this.state.newFood();
      this.state.interval -= INTERVAL_DECREASE;
    }

    // After all actions processed, render positions
    driver.clearHoles();
    this.state.getUsedPositions().forEach((position: HoleCoordinate) => {
      driver.setHole(position.x, position.y, position.holeType);
    });
    driver.flush();

    return undefined;
  }
}

class GameOverScene implements Scene<GameOverState, SnakeControllerInput> {
  state: GameOverState;

  constructor(finalGameState: PlayingGameState) {
    this.state = {
      numFlashes: GAME_OVER_NUM_FLASHES,
      flashPartDuration: 200,
      flashPartCount: 0,
      lastUpdate: Date.now(),
      finalGameState,
    };
  }

  initialRender(driver: ConnectBoardDriver) {
    driver.clearHoles();
    driver.flush();
  }

  tick(driver: ConnectBoardDriver): Scene<NewGameState, any> | undefined {
    // Check if enough time has passed before updating the board state
    const thisTickTime: number = Date.now();
    if (this.state.lastUpdate > (thisTickTime - this.state.flashPartDuration)) {
      return undefined;
    }
    this.state.lastUpdate = thisTickTime;

    // Toggle the final board content. Toggling between the final play state and
    // and empty board gives the visual effect of the board flashing.

    if (this.state.flashPartCount % 2 === 0) {
      // Display empty board
      driver.clearHoles();
      driver.flush();
    } else {
      // Display final play state
      driver.clearHoles();
      this.state.finalGameState.getUsedPositions().forEach((position: HoleCoordinate) => {
        driver.setHole(position.x, position.y, position.holeType);
      });
      driver.flush();
    }
    this.state.flashPartCount += 1;

    // If we've finished flashing the screen, then continue looping, otherwise we've
    // finished the game over screen and should transition to the new game scene
    if (this.state.flashPartCount < (this.state.numFlashes * 2)) {
      return undefined;
    }
    console.debug('[GameOverScene] transitioning to next scene NewGameScene');
    return new NewGameScene();
  }
}

export enum SnakeControllerInput {
  Up,
  Right,
  Down,
  Left,
  StartToggle,
}

type SnakeScenes =
  Scene<NewGameState, SnakeControllerInput> |
  Scene<PlayingGameState, SnakeControllerInput> |
  Scene<GameOverState, SnakeControllerInput>;

export class Snake {
  driver: ConnectBoardDriver;

  scene!: SnakeScenes; // scene gets set within `setScene`

  playerInput: PlayerInput<SnakeControllerInput> | null = null;

  constructor() {
    this.driver = new ConnectBoardDriver();
    this.setScene(new NewGameScene());
  }

  attachRenderer(renderer: ConnectBoardRenderer) {
    console.debug('[Snake] attaching renderer');
    this.driver.attachRenderer(renderer);
  }

  setInputController(controller: PlayerInput<SnakeControllerInput> | null) {
    console.log(`[Snake] attaching controller (null: ${controller === null})`);
    this.playerInput = controller;
  }

  setScene(scene: SnakeScenes) {
    this.scene = scene;
    this.scene.initialRender(this.driver);
  }

  tick() {
    const newScene = this.scene.tick(this.driver, this.playerInput);
    if (newScene) {
      this.setScene(newScene);
    }
  }
}
