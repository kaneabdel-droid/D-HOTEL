"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { setLanguage } from "@/app/actions/i18n";

export function LanguageSwitcher() {
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const langCookie = cookies.find((c) => c.startsWith("lang="));
    if (langCookie) {
      setLang(langCookie.split("=")[1]);
    }
  }, []);

  const handleChange = async (newLang: string) => {
    setLang(newLang);
    await setLanguage(newLang);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-white/10 text-xs">
      <Globe className="w-3.5 h-3.5 text-foreground-muted ml-1" />
      <button
        onClick={() => handleChange("fr")}
        className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
          lang === "fr"
            ? "bg-[#D4AF37] text-black shadow-xs"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => handleChange("en")}
        className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
          lang === "en"
            ? "bg-[#D4AF37] text-black shadow-xs"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleChange("ar")}
        className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
          lang === "ar"
            ? "bg-[#D4AF37] text-black shadow-xs"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        العربية
      </button>
    </div>
  );
}
