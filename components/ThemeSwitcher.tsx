"use client";

import { useEffect, useState } from "react";
import { Sparkles, Waves, Trees } from "lucide-react";

export type ThemeCode = "palace" | "riviera" | "ecolodge";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeCode>("palace");

  useEffect(() => {
    let saved = localStorage.getItem("d-hotel-theme") as string | null;
    // Harmoniser les anciens codes éventuels
    if (saved === "oasis") saved = "ecolodge";
    if (saved === "midnight") saved = "riviera";
    if (!saved || !["palace", "riviera", "ecolodge"].includes(saved)) {
      saved = "palace";
    }
    setTheme(saved as ThemeCode);
    appliquerTheme(saved as ThemeCode);
  }, []);

  function appliquerTheme(code: ThemeCode) {
    const root = document.documentElement;
    root.classList.remove(
      "theme-palace",
      "theme-teranga",
      "theme-riviera",
      "theme-azur",
      "theme-midnight",
      "theme-ecolodge",
      "theme-sauge",
      "theme-oasis"
    );

    if (code === "riviera") {
      root.classList.add("theme-riviera");
    } else if (code === "ecolodge") {
      root.classList.add("theme-ecolodge");
    } else {
      root.classList.add("theme-palace");
    }

    localStorage.setItem("d-hotel-theme", code);
    setTheme(code);
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--surface-muted)] border border-[var(--surface-border)] rounded-full text-xs shadow-xs">
      <button
        type="button"
        onClick={() => appliquerTheme("palace")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          theme === "palace"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="Teranga & Sable Doré (Chaleureux, lin ivoire & or miel)"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
        <span className="hidden sm:inline">Teranga</span>
      </button>

      <button
        type="button"
        onClick={() => appliquerTheme("riviera")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          theme === "riviera"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="Riviera & Azur Doux (Lagon balnéaire, brise marine & corail pastel)"
      >
        <Waves className="w-3.5 h-3.5 text-[#2B869B]" />
        <span className="hidden sm:inline">Riviera</span>
      </button>

      <button
        type="button"
        onClick={() => appliquerTheme("ecolodge")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
          theme === "ecolodge"
            ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs font-semibold"
            : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        }`}
        title="Éco-Lodge & Sauge (Nature, spa, calcaire clair & vert sauge)"
      >
        <Trees className="w-3.5 h-3.5 text-[#44805A]" />
        <span className="hidden sm:inline">Éco-Lodge</span>
      </button>
    </div>
  );
}
