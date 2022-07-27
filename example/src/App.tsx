import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactConnectSnake } from 'connect-snake';

const GAME_DEFAULT_WIDTH = 720;

function App() {
  const [searchParams, ] = useSearchParams();

  const widthParam = searchParams.get('width')
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

  let width = undefined;
  if (viewportWidth < GAME_DEFAULT_WIDTH) {
    width = viewportWidth;
  }
  if (widthParam !== null) {
    width = parseInt(widthParam);
  }

  return <ReactConnectSnake width={width} tabIndex={0} />;
}

export default App;
