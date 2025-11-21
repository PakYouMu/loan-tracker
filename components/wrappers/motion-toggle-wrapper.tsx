'use client';

import { Zap, ZapOff } from "lucide-react";
import { useState, useEffect } from "react";
import HelixCanvas from "../landing-page/interactive-wave-bg";

export default function MotionToggleWrapper({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  const forwardPointerEvent = (e: React.PointerEvent) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Force 'pointermove' event type
    const event = new PointerEvent('pointermove', {
      bubbles: true, 
      cancelable: true, 
      view: window,
      clientX: e.clientX, 
      clientY: e.clientY,
      pointerId: e.pointerId,
      isPrimary: e.isPrimary,
    });
    
    canvas.dispatchEvent(event);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#05000a] overflow-hidden">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <HelixCanvas 
          speed={reducedMotion ? 0.0 : 1.0} 
          mouseDamping={0.5}
          heroColor="#ffffff"
          backgroundColor="#cccccc"
        />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        className="absolute bottom-8 left-8 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-center group"
      >
        {reducedMotion ? (
          <ZapOff className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
        ) : (
          <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        {/* 
            The Content Island:
            1. pointer-events-auto: Makes text selectable.
            2. onPointerMove: Forwards the event "through" the text to the canvas.
        */}
        <div 
          className="pointer-events-auto"
          onPointerMove={forwardPointerEvent}
          onPointerEnter={forwardPointerEvent}
          onPointerLeave={forwardPointerEvent}
        >
          {children}
        </div>
      </div>
    </div>
  );
}