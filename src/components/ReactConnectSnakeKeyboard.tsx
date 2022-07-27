import React from 'react';
import Keyboard, { KeyboardReactInterface } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { SnakeControllerInput } from '../games';
import { SnakeKeyboardController, SnakeKeyboardControllerEvent } from './ReactConnectSnake';
import './ReactConnectSnakeKeyboard.css'

const hardcodedOptions: Partial<KeyboardReactInterface['options']> = {
  layout: {
    'default': [
      '{arrowup}',
      '{arrowleft} {arrowright}',
      '{arrowdown}',
      '{space}',
    ]
  },
  buttonTheme: [
    {
      class: "veritcalArrowkeys",
      buttons: "{arrowup} {arrowdown}"
    },
    {
      class: "horizontalArrowkeys",
      buttons: "{arrowleft} {arrowright}"
    }
  ],
  display: {
    "{arrowup}": "↑",
    "{arrowright}": "→",
    "{arrowdown}": "↓",
    "{arrowleft}": "←",
    "{space}": "play/pause",
  }
}

const kbEvent = (button: string) => ({
  code: button,
  preventDefault: () => {}
});

export const bindSnakeKeyboard = (controller: SnakeKeyboardController): void => {
  controller.resetKeyBindings()
  controller.bindKey(SnakeControllerInput.Up, '{arrowup}');
  controller.bindKey(SnakeControllerInput.Left, '{arrowleft}')
  controller.bindKey(SnakeControllerInput.Down, '{arrowdown}')
  controller.bindKey(SnakeControllerInput.Right, '{arrowright}')
  controller.bindKey(SnakeControllerInput.StartToggle, '{space}')
}

export interface ReactConnectSnakeKeyboardProps {
  onKeyDown: (event: SnakeKeyboardControllerEvent) => void
}

export const ReactConnectSnakeKeyboard: React.FC<any> = (props: ReactConnectSnakeKeyboardProps) => {

  const onKeyPress = (button: any) => props.onKeyDown(kbEvent(button));

  return (
    <Keyboard
      {...hardcodedOptions}
      onKeyPress={onKeyPress}
    />
  );
};
