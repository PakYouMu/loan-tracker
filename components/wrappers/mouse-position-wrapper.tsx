'use client';

import { useState, useEffect } from 'react';
import { MousePositionContext } from '../context/mouse-position-context';

export default function MousePositionProvider({ children }: { children: React.ReactNode }) {
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    // Add listener to the whole window
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <MousePositionContext.Provider value={mousePosition}>
      {children}
    </MousePositionContext.Provider>
  );
}