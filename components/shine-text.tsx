'use client';

import React from 'react';
import { useShine } from './context/shine-context';

const ShineText = ({ children }: { children: React.ReactNode }) => {
  // Subscribe to the global cursor position from our context
  const { cursorPosition } = useShine();

  return (
    <div
      className="shine-text-container"
      style={{
        '--cursor-x': `${cursorPosition?.x ?? -9999}px`,
        '--cursor-y': `${cursorPosition?.y ?? -9999}px`,
      } as React.CSSProperties}
    >
      {/* Base layer (dimmer text) */}
      <div className="shine-text base-text">{children}</div>
      {/* Glow layer (brighter text, masked) */}
      <div
        className="shine-text glow-text"
        style={{ opacity: cursorPosition ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
};

export default ShineText;