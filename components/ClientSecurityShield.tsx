"use client";

import { useEffect } from "react";

/**
 * Composant de sécurité périmétrique : Anti-Clickjacking / Frame-Busting
 * Empêche l'application d'être encapsulée dans une iFrame pirate.
 */
export function ClientSecurityShield() {
  useEffect(() => {
    try {
      if (window.self !== window.top && window.top) {
        // Détection de cadre pirate : brise l'iFrame immédiatement
        window.top.location.href = window.self.location.href;
      }
    } catch {
      // Si l'accès à window.top est bloqué par la politique cross-origin, forcer la redirection
      window.location.href = "about:blank";
    }
  }, []);

  return null;
}
