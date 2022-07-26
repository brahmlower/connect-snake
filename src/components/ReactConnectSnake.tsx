import React, { useEffect, useState } from 'react';
import { ConnectBoardRenderer } from '../ConnectBoardDriver';
import { Snake, PlayerInput, SnakeControllerInput } from '../games';
import { ReactConnectBoard, ReactConnectBoardProps } from './ReactConnectBoard/ConnectBoard';

class SnakeKeyboardController implements PlayerInput<SnakeControllerInput> {
  input: SnakeControllerInput | null;

  defaultKeyBindings: Record<SnakeControllerInput, string> = {
    [SnakeControllerInput.Up]: 'ArrowUp',
    [SnakeControllerInput.Left]: 'ArrowLeft',
    [SnakeControllerInput.Down]: 'ArrowDown',
    [SnakeControllerInput.Right]: 'ArrowRight',
    [SnakeControllerInput.StartToggle]: 'Space',
  };

  keyBindings: Record<string, SnakeControllerInput>;

  constructor() {
    this.input = null;
    this.keyBindings = {} as Record<string, SnakeControllerInput>;
    this.bindKeyDefaults();
  }

  bindKeyDefaults(): void {
    Object
      .keys(SnakeControllerInput)
      .filter((v) => !isNaN(Number(v)))
      .map((v) => Number(v))
      .forEach((input: SnakeControllerInput) => {
        const keyboardCode = this.defaultKeyBindings[input];
        this.bindKey(input, keyboardCode);
      });
  }

  bindKey(input: SnakeControllerInput, keyboardCode: string) {
    this.keyBindings[keyboardCode] = input;
  }

  latestInput(): SnakeControllerInput | null {
    const memInput = this.input;
    this.input = null;
    return memInput;
  }

  eventInput(event: React.KeyboardEvent<HTMLElement> | undefined): void {
    if (event === undefined) {
      return;
    }

    const controllerInput = this.keyBindings[event.code];

    // Skip any user input that we don't have bound to a controller input
    if (controllerInput === undefined) {
      console.debug(`[Controller] user input ${event.code} is not mapped to a control`);
      return;
    }

    // Reaching this point means the key event was mapped to a control input, so
    // we want to prevent it from doing anything sort of action it's bound to by
    // default in the browser
    event.preventDefault();

    // Append the controller input to the input history
    this.input = controllerInput;
  }
}

const FPS = 60;

export interface ReactConnectSnakeProps extends Partial<ReactConnectBoardProps> {}

export const ReactConnectSnake: React.FC<ReactConnectSnakeProps> = (props: ReactConnectSnakeProps) => {
  const [game] = useState<Snake>(new Snake());
  const [controller, setController] = useState<SnakeKeyboardController | null>(null);

  useEffect(() => {
    game.setInputController(controller);
  }, [controller]);

  const onFocusIn = () => setController(new SnakeKeyboardController());

  const onFocusOut = () => setController(null);

  const handleOnLoad = (renderer: ConnectBoardRenderer) => game.attachRenderer(renderer);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement> | undefined) => {
    if (controller !== null) {
      controller.eventInput(event);
    }
  };

  // Start the game render loop once the game instance is available
  useEffect(() => {
    const intervalId = setInterval(
      () => { game.tick(); },
      1000 / FPS,
    );
    return () => clearInterval(intervalId);
  }, [game]);

  return (
    <ReactConnectBoard
      {...props}
      style={{ "display": "inline-block" }}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
      onLoad={handleOnLoad}
      onKeyDown={handleKeyDown}
    />
  );
};
