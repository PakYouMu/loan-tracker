'use client';

import { useState, useEffect } from "react";
import InteractiveWaveBackground from "@/components/interactive-wave-bg";
import { Zap, ZapOff } from "lucide-react";

export default function MotionToggleWrapper({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 mix-blend-screen"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        className="absolute bottom-8 left-8 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-center group"
        aria-label={reducedMotion ? 'Enable full animation' : 'Enable gentle mode'}
        title={reducedMotion ? 'Full Animation' : 'Gentle Mode'}
      >
        {reducedMotion ? (
          <ZapOff className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
        ) : (
          <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      <InteractiveWaveBackground reducedMotion={reducedMotion}>
        {children}
      </InteractiveWaveBackground>
    </>
  );
}