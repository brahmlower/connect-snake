import React, { useEffect } from 'react'
import { SimpleSpread } from './common';

interface CustomImageProps {
  src: string,
  onLoad: (ref: HTMLImageElement) => void,
}

interface ImageProps
extends SimpleSpread<React.HTMLAttributes<HTMLImageElement>, CustomImageProps> {}

const Image: React.FC<ImageProps> = (props: ImageProps) => {
  const { onLoad, ...elemProps } = props;
  const ref = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current === null) {
        return;
    }
    onLoad(ref.current)
  })

  return <img ref={ref} {...elemProps}/>
}

export default Image;
