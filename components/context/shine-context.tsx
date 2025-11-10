'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the shape of the context data
interface ShineContextType {
  cursorPosition: { x: number; y: number } | null;
}

// Create the context with a default value
const ShineContext = createContext<ShineContextType>({
  cursorPosition: null,
});

// Create the Provider component. This will wrap our entire application.
export const ShineProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Handler to update state with the mouse's viewport position
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    // Handler to clear the position when the mouse leaves the window
    const handleMouseLeave = () => {
      setCursorPosition(null);
    };

    // Add listeners to the window
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <ShineContext.Provider value={{ cursorPosition }}>
      {children}
    </ShineContext.Provider>
  );
};

// Create a custom hook for easy access to the context data
export const useShine = () => {
  return useContext(ShineContext);
};