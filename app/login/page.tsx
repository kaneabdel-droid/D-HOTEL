"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Hotel,
  KeyRound,
  User,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import { login } from "./actions";
import { authenticateOffline, hashPasswordWithSalt, generateSalt } from "@/lib/offline/offline-auth";
import { saveOfflineAccount } from "@/lib/offline/offline-storage";

export default function LoginPage() {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [estHorsLigne, setEstHorsLigne] = useState(false);

  useEffect(() => {
    setEstHorsLigne(!navigator.onLine);
    const onOnline = () => setEstHorsLigne(false);
    const onOffline = () => setEstHorsLigne(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    setErreur(null);

    // 1. Si déjà hors ligne, tentative d'authentification locale immédiate
    if (!navigator.onLine) {
      const res = await authenticateOffline(identifiant, motDePasse);
      if (res.success) {
        window.location.href = "/";
        return;
      }
      setErreur(res.error || "Échec de connexion hors-ligne");
      setChargement(false);
      return;
    }

    // 2. Tentative serveur
    try {
      const formData = new FormData();
      formData.set("identifier", identifiant);
      formData.set("password", motDePasse);

      const res = await login(formData);
      if (res.success) {
        // Mise en cache locale sécurisée des identifiants pour les futures ouvertures hors-ligne
        try {
          const salt = generateSalt();
          const hash = await hashPasswordWithSalt(motDePasse, salt);
          await saveOfflineAccount({
            id: res.userContext?.userId || "offline-id",
            identifier: identifiant.trim().toLowerCase(),
            identifiers: [identifiant.trim().toLowerCase()],
            salt,
            passwordHash: hash,
            userContext: {
              userId: res.userContext?.userId || "offline-id",
              nomComplet: res.userContext?.nomComplet || "Mamadou Sow",
              identifiant,
              role: res.userContext?.role || "directeur",
              hotelId: res.userContext?.hotelId || "hotel-1",
              hotelNom: res.userContext?.hotelNom || "Hôtel Teranga Palace 5★",
              devise: res.userContext?.devise || "XOF",
            },
            lastLoginAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Échec sauvegarde compte local:", e);
        }

        window.location.href = res.redirectUrl || "/";
        return;
      }

      setErreur(res.error || "Erreur de connexion");
      setChargement(false);
    } catch {
      // Repli hors-ligne en cas d'erreur réseau
      const resOffline = await authenticateOffline(identifiant, motDePasse);
      if (resOffline.success) {
        window.location.href = "/";
        return;
      }
      setErreur("Connexion serveur impossible et aucun compte local trouvé sur cet appareil.");
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F1B2B] via-[#070A0F] to-[#1A120B] text-white">
      <div className="w-full max-w-md space-y-6">
        {/* En-tête Marque */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] items-center justify-center text-black font-black text-2xl shadow-xl shadow-amber-500/10 mb-2">
            DH
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            D-HOTEL
          </h1>
          <p className="text-xs text-[#8E9EAF] max-w-xs mx-auto">
            Plateforme intégrée de gestion hôtelière de prestige • DembaSolution
          </p>
        </div>

        {/* Carte de Connexion */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141B26]/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
          <div className="pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-white">
              Espace Sécurisé de l&apos;Établissement
            </h2>
            <p className="text-[11px] text-[#8E9EAF]">
              Connectez-vous avec votre e-mail, identifiant ou numéro de téléphone
            </p>
          </div>

          {estHorsLigne && (
            <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>Mode Hors-Ligne Actif — Authentification locale autonome</span>
            </div>
          )}

          {erreur && (
            <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400">
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Champ Identifiant / E-mail / Téléphone */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F2F5F8]">
                Identifiant, Téléphone ou E-mail
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="ex: amadou_bar ou +221 77 123 45 67"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-hidden focus:border-[#D4AF37] transition-colors"
                />
                <User className="w-4 h-4 text-[#8E9EAF] absolute left-3 top-3" />
              </div>
            </div>

            {/* Champ Mot de Passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#F2F5F8]">
                  Mot de passe
                </label>
                <a
                  href="https://wa.me/221770000000?text=Bonjour,%20je%20souhaite%20r%C3%A9initialiser%20mon%20mot%20de%20passe%20D-HOTEL."
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Aide WhatsApp</span>
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder:text-white/30 text-xs focus:outline-hidden focus:border-[#D4AF37] transition-colors"
                />
                <KeyRound className="w-4 h-4 text-[#8E9EAF] absolute left-3 top-3" />
              </div>
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={chargement}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:opacity-95 text-black font-black text-xs shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {chargement ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Accéder à D-HOTEL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Badge de sécurité Cloudflare & HSTS */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#8E9EAF] border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Chiffrement HSTS • Bouclier Cloudflare WAF actif</span>
          </div>
        </div>

        {/* Pied de page */}
        <p className="text-center text-[11px] text-[#8E9EAF]">
          © {new Date().getFullYear()} DembaSolution • Tous droits réservés
        </p>
      </div>
    </div>
  );
}
