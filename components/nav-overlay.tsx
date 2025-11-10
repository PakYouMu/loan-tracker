"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/wrappers/theme-switcher-wrapper";

export default function NavOverlay({ children }: { children: React.ReactNode }) {
  const forwardMouseEvent = (e: React.MouseEvent) => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const newEvent = new MouseEvent(e.type, {
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
      });
      canvas.dispatchEvent(newEvent);
    }
  };

  return (
    <div 
      className="absolute top-0 left-0 right-0 z-10 w-full flex justify-between items-center py-8 px-8"
      onMouseMove={forwardMouseEvent}
      onMouseEnter={forwardMouseEvent}
      onMouseLeave={forwardMouseEvent}
    >
      <Link 
        href={"/"} 
        className="font-display text-6xl antialiased tracking-tight [text-shadow:0_0_1px_currentColor]"
        onMouseMove={forwardMouseEvent}
      >
          La Clair Ligña
      </Link>
      
      <div 
        className="flex items-center gap-4"
        onMouseMove={forwardMouseEvent}
        onMouseEnter={forwardMouseEvent}
        onMouseLeave={forwardMouseEvent}
      >
        <div className="pointer-events-auto">
          <ThemeSwitcher />
        </div>
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
}