import React, { useEffect, useState } from "react";

export default function useIsMobile() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    console.debug("setting new width")
    setWidth(window.innerWidth)
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  return width <= 768;
}