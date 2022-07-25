import { ComponentStory } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { ReactConnectSnake } from './ReactConnectSnake';

export default {
  title: 'Connect Components/ReactConnectSnake',
  component: ReactConnectSnake
}

const BasicTemplate: ComponentStory<typeof ReactConnectSnake> =
  () => (<ReactConnectSnake />);

export const DefaultConnectSnake = BasicTemplate.bind({});

