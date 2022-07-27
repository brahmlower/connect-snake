import { ComponentStory } from '@storybook/react';
import React from 'react';
import { ReactConnectSnakeKeyboard } from './ReactConnectSnakeKeyboard';

export default {
  title: 'Connect Components/ReactConnectSnakeKeyboard',
  component: ReactConnectSnakeKeyboard,
};

const DefaultTemplate: ComponentStory<typeof ReactConnectSnakeKeyboard> = () => (<ReactConnectSnakeKeyboard />);

export const DefaultConnectSnakeKeyboard = DefaultTemplate.bind({});
