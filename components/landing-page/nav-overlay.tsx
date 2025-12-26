"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/wrappers/theme-switcher-wrapper";
import MetallicSheen from "@/components/wrappers/metallic-sheen-wrapper";
import { MotionToggleButton } from "@/components/ui/motion-toggle-button"; 
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useMotion } from "@/components/context/motion-context";

// UPDATED: Now accepts 'navItems'
interface NavOverlayProps {
  children: React.ReactNode; // Auth Button
  navItems?: React.ReactNode; // Links (About, Dashboard, etc)
}

export default function NavOverlay({ children, navItems }: NavOverlayProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toggleMotion } = useMotion();

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
      bubbles: true, cancelable: true, view: window,
      clientX: e.clientX, clientY: e.clientY,
      pointerId: e.pointerId, width: e.width, height: e.height,
      pressure: e.pressure, isPrimary: e.isPrimary,
    });
    canvas.dispatchEvent(event);
  };

  const handleThemeRowClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.nav-action-btn')) return;
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="nav-overlay-container">
      <Link 
        href={"/"} 
        className="nav-logo-link"
        onPointerMove={forwardPointerEvent}
        onPointerEnter={forwardPointerEvent}
        onPointerLeave={forwardPointerEvent}
      >
        <MetallicSheen className="nav-logo-sheen"> 
          <h1 className="nav-logo-text">La Clair Ligña</h1>
        </MetallicSheen>
      </Link>
      
      <div className="nav-burger-container">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="nav-burger-btn"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="nav-mobile-overlay">
           <div className="h-32 shrink-0" />

           <div className="flex-1 w-full px-6 flex flex-col justify-center items-center overflow-y-auto">
             <div className="w-full max-w-sm space-y-6 py-4">
               
               {/* --- NEW: NAVIGATION ITEMS SECTION --- */}
               {navItems && (
                 <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                   {navItems}
                   <div className="nav-separator" />
                 </div>
               )}

               <div className="nav-preference-label">Preferences</div>
               
               {/* Theme Row */}
               <div className="nav-preference-row" onClick={handleThemeRowClick}>
                 <span className="font-medium text-lg">Appearance</span>
                 <div className="scale-110">
                    <ThemeSwitcher />
                 </div>
               </div>

               {/* Motion Row */}
               <div className="nav-preference-row" onClick={toggleMotion}>
                 <span className="font-medium text-lg">Animations</span>
                 <div className="relative">
                   <MotionToggleButton />
                 </div>
               </div>
             </div>
           </div>

           <div className="w-full p-6 pb-10 border-t border-border/50 bg-background/50">
             <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
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