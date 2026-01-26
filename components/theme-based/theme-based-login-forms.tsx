"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeBasedLoginForms() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      {/* Left side with gradient fade (clipped based on gradient) */}
      <div 
        className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-0 md:pl-[8%] z-10 pointer-events-none"
        style={{
          clipPath: 'polygon(0 0, 75% 0, 75% 100%, 0 100%)',
        }}
      >
        <div className="w-full max-w-sm pointer-events-auto">
          <LoginForm 
            className="bg-transparent border-none shadow-none" 
            textColor={isDark ? "black" : "white"} 
          />
        </div>
      </div>

      {/* Right side (clipped to right portion) */}
      <div 
        className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-0 md:pl-[8%] z-10 pointer-events-none"
        style={{
          clipPath: 'polygon(75% 0, 100% 0, 100% 100%, 75% 100%)',
        }}
      >
        <div className="w-full max-w-sm pointer-events-auto">
          <LoginForm 
            className="bg-transparent border-none shadow-none" 
            textColor={isDark ? "white" : "black"} 
          />
        </div>
      </div>
    </>
  );
}