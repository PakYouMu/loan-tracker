"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/wrappers/theme-switcher-wrapper";
import MetallicSheen from "@/components/wrappers/metallic-sheen-wrapper";

export default function NavOverlay({ children }: { children: React.ReactNode }) {
  
  const forwardPointerEvent = (e: React.PointerEvent) => {
    // 1. Find the canvas (which sits at z-index 0)
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // 2. Create a specific PointerEvent. 
    // CRITICAL: We hardcode 'pointermove' because that is what the canvas is listening for.
    // If we just used e.type, it might pass 'mousemove', which the canvas ignores.
    const event = new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY,
      // Pass these to ensure accurate tracking
      pointerId: e.pointerId,
      width: e.width,
      height: e.height,
      pressure: e.pressure,
      isPrimary: e.isPrimary,
    });

    // 3. Dispatch to the canvas
    canvas.dispatchEvent(event);
  };

  return (
    <div 
      className="absolute top-0 left-0 right-0 z-50 w-full flex justify-between items-center py-8 px-8 pointer-events-none"
    >
      <Link 
        href={"/"} 
        className="font-display text-6xl antialiased tracking-tight pointer-events-auto block"
        // Use onPointerMove instead of onMouseMove for better data fidelity
        onPointerMove={forwardPointerEvent}
        onPointerEnter={forwardPointerEvent}
        onPointerLeave={forwardPointerEvent}
      >
        <MetallicSheen>
          La Clair Ligña
        </MetallicSheen>
      </Link>
      
      <div 
        className="flex items-center gap-4 pointer-events-auto"
        onPointerMove={forwardPointerEvent}
        onPointerEnter={forwardPointerEvent}
        onPointerLeave={forwardPointerEvent}
      >
        <div>
          <ThemeSwitcher />
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}