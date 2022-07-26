import { ComponentStory } from '@storybook/react';
import React from 'react';
import { ReactConnectSnake, ReactConnectSnakeProps } from './ReactConnectSnake';

export default {
  title: 'Connect Components/ReactConnectSnake',
  component: ReactConnectSnake,
};

const DefaultTemplate: ComponentStory<typeof ReactConnectSnake> = () => (<ReactConnectSnake tabIndex={0} />);

export const DefaultConnectSnake = DefaultTemplate.bind({});


type ScaledTemplateArgs = Partial<ReactConnectSnakeProps>

const ScaledTemplate: ComponentStory<typeof ReactConnectSnake> =
  (args: ScaledTemplateArgs) => (<ReactConnectSnake width={args.width} tabIndex={0} />);

export const ScaledDownConnectSnake = ScaledTemplate.bind({});
ScaledDownConnectSnake.args = {
  width: 500,
}

export const ScaledUpConnectSnake = ScaledTemplate.bind({});
ScaledUpConnectSnake.args = {
  width: 1000,
}
