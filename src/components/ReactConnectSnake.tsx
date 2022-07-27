import React, { useEffect, useState } from 'react';
import { ConnectBoardRenderer } from '../ConnectBoardDriver';
import { Snake, PlayerInput, SnakeControllerInput } from '../games';
import { ReactConnectBoard, ReactConnectBoardProps } from './ReactConnectBoard/ConnectBoard';
import { bindSnakeKeyboard, ReactConnectSnakeKeyboard } from './ReactConnectSnakeKeyboard';
import useIsMobile from './useIsMobile';

export interface SnakeKeyboardControllerEvent {
  code: string
  preventDefault: () => void
}

export class SnakeKeyboardController implements PlayerInput<SnakeControllerInput> {
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

  resetKeyBindings(): void {
    this.keyBindings = {};
  }

  bindKeyDefaults(): void {
    this.resetKeyBindings()
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

  eventInput(event: SnakeKeyboardControllerEvent | undefined): void {
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
  const isMobile = useIsMobile();
  const [mobileKeyboard, setMobileKeyboard] = useState<JSX.Element | null>(null);
  const [controller, ] = useState<SnakeKeyboardController >(new SnakeKeyboardController());
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    game.setInputController(controller);
  }, [controller]);

  useEffect(() => {
    // This function is only for setting the virtual keyboard for mobile devices, so
    // if there's no controller attached to the game, or if we're not on a mobile
    // device, then we don't create the mobile keyboard component
    const keyboard = controller !== undefined && isMobile === true
      ? <ReactConnectSnakeKeyboard onKeyDown={handleKeyDown} />
      : null
    setMobileKeyboard(keyboard)
  }, [controller, isMobile])

  useEffect(() => {
    // If the controller is null then just bail because there's nothing for us to do
    if (controller === null) {
      return
    }

    // Set the controller bindings to default if the mobile keyboard is null, otherwise
    // set the controller bidnings to the mobile keyboard bindings
    if (mobileKeyboard === null) {
      controller.bindKeyDefaults()
    } else {
      bindSnakeKeyboard(controller)
    }
  }, [controller, mobileKeyboard])

  const handleOnFocus = () => setPaused(false);

  const handleOnBlur = () => setPaused(true);

  const handleOnLoad = (renderer: ConnectBoardRenderer) => game.attachRenderer(renderer);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement> | undefined) => {
    if (controller !== null) {
      controller.eventInput(event);
    }
  };

  // Start the game render loop once the game instance is available
  useEffect(() => {
    // We want to tick only if the game is not paused
    if (paused === true) {
      return
    }

    const intervalId = setInterval(
      () => { game.tick(); },
      1000 / FPS,
    );
    return () => clearInterval(intervalId);
  }, [game, paused]);

  return (
    <>
      <ReactConnectBoard
        {...props}
        style={{ "display": "inline-block" }}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onLoad={handleOnLoad}
        onKeyDown={handleKeyDown}
      >
        { mobileKeyboard ? mobileKeyboard : <></>}
      </ReactConnectBoard>
    </>
  );
};
