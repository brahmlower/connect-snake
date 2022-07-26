import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactConnectSnake } from 'connect-snake';

function App() {
  const [searchParams, ] = useSearchParams();

  const widthParam = searchParams.get('width')
  const width = widthParam !== null ? parseInt(widthParam) : undefined

  return <ReactConnectSnake width={width} tabIndex={0} />;
}

export default App;
