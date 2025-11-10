'use client';

import { createContext } from 'react';

export const MousePositionContext = createContext<{ x: number | null; y: number | null }>({
  x: null,
  y: null,
});