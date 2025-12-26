"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="nav-action-btn" aria-label="Select theme">
          {theme === "light" ? (
            <Sun key="light" className="nav-action-icon" />
          ) : theme === "dark" ? (
            <Moon key="dark" className="nav-action-icon" />
          ) : (
            <Laptop key="system" className="nav-action-icon" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-content" side="right" align="center">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2 cursor-pointer" value="light">
            <Sun size={16} className="text-muted-foreground" />{" "}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 cursor-pointer" value="dark">
            <Moon size={16} className="text-muted-foreground" />{" "}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2 cursor-pointer" value="system">
            <Laptop size={16} className="text-muted-foreground" />{" "}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };