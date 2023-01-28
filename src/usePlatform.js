import { useState, useEffect } from "react";

export const usePlatform = () => {
  const [isMobile, setIsMobile] = useState(false);
  const width = window.innerWidth;

  useEffect(() => {
    if (width < 1400) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  return { isMobile };
};
