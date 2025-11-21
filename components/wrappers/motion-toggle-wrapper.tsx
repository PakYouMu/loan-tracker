'use client';

import { Zap, ZapOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import HelixCanvas from "../landing-page/interactive-wave-bg";

export default function MotionToggleWrapper({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const { resolvedTheme } = useTheme(); // Get current active theme (light or dark)
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const forwardPointerEvent = (e: React.PointerEvent) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

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

  // Determine dark mode safely
  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    // changed bg-[#05000a] to bg-background to match your globals.css
    <div className="relative w-full h-screen bg-background transition-colors duration-500 overflow-hidden">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <HelixCanvas 
          speed={reducedMotion ? 0.0 : 1.0} 
          mouseDamping={0.5}
          
          // Switch blending mode: Additive for Dark, Normal for Light
          darkMode={isDark}
          
          // Dark Mode: White Lines. Light Mode: Black Lines.
          heroColor={isDark ? "#ffffff" : "#000000"} 
          
          // Dark Mode: Grey ribbons. Light Mode: Dark Grey ribbons.
          backgroundColor={isDark ? "#cccccc" : "#444444"} 
        />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        // Updated colors to use Tailwind border-foreground/20 so it looks good in both themes
        className="absolute bottom-8 left-8 z-20 w-14 h-14 bg-background/10 hover:bg-foreground/5 backdrop-blur-sm border border-foreground/20 rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-center group"
      >
        {reducedMotion ? (
          <ZapOff className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <Zap className="w-6 h-6 text-foreground group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
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