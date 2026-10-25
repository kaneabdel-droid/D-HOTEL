"use client";

import { useEffect, useState } from "react";
import { Sparkles, Sun, Moon, Trees } from "lucide-react";

export type ThemeCode = "palace" | "oasis" | "midnight";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeCode>("palace");

  useEffect(() => {
    const saved = (localStorage.getItem("d-hotel-theme") as ThemeCode) || "palace";
    setTheme(saved);
    appliquerTheme(saved);
  }, []);

  function appliquerTheme(code: ThemeCode) {
    const root = document.documentElement;
    root.classList.remove("theme-oasis", "theme-midnight");
    if (code === "oasis") {
      root.classList.add("theme-oasis");
    } else if (code === "midnight") {
      root.classList.add("theme-midnight");
    }
    localStorage.setItem("d-hotel-theme", code);
    setTheme(code);
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--surface-muted)] border border-[var(--surface-border)] rounded-full text-xs">
      <button
        type="button"
        onClick={() => appliquerTheme("palace")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
          theme === "palace"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="Thème Palace Teranga (Prestige & Lin)"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="hidden sm:inline">Palace</span>
      </button>

      <button
        type="button"
        onClick={() => appliquerTheme("oasis")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
          theme === "oasis"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="Thème Oasis Eco-Lodge (Nature & Lagon)"
      >
        <Trees className="w-3.5 h-3.5 text-[#2E8B67]" />
        <span className="hidden sm:inline">Oasis</span>
      </button>

      <button
        type="button"
        onClick={() => appliquerTheme("midnight")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
          theme === "midnight"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="Thème Midnight Luxury (Nuit Sombre VIP)"
      >
        <Moon className="w-3.5 h-3.5 text-[#E6B93F]" />
        <span className="hidden sm:inline">Midnight</span>
      </button>
    </div>
  );
}
