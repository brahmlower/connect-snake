import React, { useRef, useEffect } from 'react';
import { SimpleSpread } from './common';

interface CustomCanvasProps extends Record<string, any> {
    onReady: (canvas: HTMLCanvasElement) => void,
}

type CanvasProps = SimpleSpread<React.HTMLAttributes<HTMLCanvasElement>, CustomCanvasProps>

const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const { onReady, ...elemProps } = props;
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    onReady(canvas);
  }, []);

  return <canvas ref={canvasRef} {...elemProps} />;
};

export default Canvas;
