"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/wrappers/theme-switcher-wrapper";
import MetallicSheen from "@/components/wrappers/metallic-sheen-wrapper";
import { MotionToggleButton } from "@/components/ui/motion-toggle-button"; // Make sure this path is correct based on your file structure
import { Menu, X } from "lucide-react";

export default function NavOverlay({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);
  
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
      width: e.width,
      height: e.height,
      pressure: e.pressure,
      isPrimary: e.isPrimary,
    });

    canvas.dispatchEvent(event);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full flex justify-between items-center py-4 px-5 md:py-8 md:px-8 pointer-events-none">
      
      {/* 1. DYNAMIC LOGO */}
      <Link 
        href={"/"} 
        className="font-display antialiased tracking-tight pointer-events-auto block z-50"
        onPointerMove={forwardPointerEvent}
        onPointerEnter={forwardPointerEvent}
        onPointerLeave={forwardPointerEvent}
      >
        <MetallicSheen className="!px-0"> 
          <h1 className="text-[clamp(1.5rem,5vw,4rem)] leading-none font-bold">
            La Clair Ligña
          </h1>
        </MetallicSheen>
      </Link>
      
      {/* 2. DESKTOP MENU (Hidden on Mobile) */}
      <div 
        className="hidden md:flex items-center gap-4 pointer-events-auto"
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

      {/* 3. MOBILE BURGER BUTTON */}
      <div className="md:hidden pointer-events-auto z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-muted/20 rounded-md transition-colors backdrop-blur-sm border border-transparent hover:border-border"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* 4. MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col md:hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
           
           {/* Spacer for Header/Logo area */}
           <div className="h-24 shrink-0" />

           {/* CENTRAL AREA: Settings */}
           <div className="flex-1 w-full px-6 flex flex-col justify-center items-center">
             <div className="w-full max-w-sm space-y-6">
               <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">
                 Preferences
               </div>
               
               {/* Theme Row */}
               <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/50">
                 <span className="font-medium text-lg">Appearance</span>
                 <div className="scale-110">
                    <ThemeSwitcher />
                 </div>
               </div>

               {/* Motion Row */}
               <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/50">
                 <span className="font-medium text-lg">Animations</span>
                 {/* Override absolute positioning classes from the component to make it fit nicely */}
                 <div className="relative w-12 h-12">
                   <MotionToggleButton className="!static !w-12 !h-12 !shadow-none !bg-transparent border-0" />
                 </div>
               </div>
             </div>
           </div>

           {/* BOTTOM AREA: Auth Actions */}
           <div className="w-full p-6 pb-10 border-t border-border/50 bg-background/50">
             <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
               {/* 
                  We use CSS nesting to force the children (AuthButton's internal buttons) 
                  to fill the width and look good on mobile 
               */}
               <div className="[&_div]:w-full [&_div]:flex [&_div]:gap-3 [&_div]:flex-row [&_button]:flex-1 [&_a]:w-full [&_a]:justify-center">
                 {children}
               </div>
               <p className="text-xs text-center text-muted-foreground mt-2">
                 © 2025 La Clair Ligña Finance
               </p>
             </div>
           </div>
        </div>
      )}
    </nav>
  );
}