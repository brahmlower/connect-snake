import React, { useEffect, useState } from 'react';
import { SimpleSpread } from './common';

interface CustomImageProps {
  src: string,
  onLoad: (ref: HTMLImageElement) => void,
}

type ImageProps = SimpleSpread<React.HTMLAttributes<HTMLImageElement>, CustomImageProps>

const Image: React.FC<ImageProps> = (props: ImageProps) => {
  const { onLoad, ...elemProps } = props;
  const ref = React.useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current === null || imgLoaded === false) {
      return;
    }

    onLoad(ref.current);
  }, [ref, imgLoaded]);

  return <img onLoad={() => setImgLoaded(true)} ref={ref} {...elemProps} />;
};

export default Image;
