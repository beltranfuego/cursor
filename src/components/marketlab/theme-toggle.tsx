"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const STORAGE_KEY = "marketlab-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle theme"
      }
      onClick={toggleTheme}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}

export function ThemeScript() {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrap prevents flash
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var stored=localStorage.getItem("${STORAGE_KEY}");var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;var theme=stored==="light"||stored==="dark"?stored:(prefersDark?"dark":"light");if(theme==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
      }}
    />
  );
}
