"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hotel,
  Sparkles,
  UtensilsCrossed,
  Building,
  Compass,
  Package,
  Users,
  Coins,
  UserCheck,
  BarChart3,
  Search,
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
  SlidersHorizontal,
  PlusCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { SECTIONS_MENUS, type MenuItem, type SousMenuItem } from "@/lib/menus";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

const ICONES: Record<string, any> = {
  LayoutDashboard,
  Hotel,
  Sparkles,
  UtensilsCrossed,
  Building,
  Compass,
  Package,
  Users,
  Coins,
  UserCheck,
  BarChart3,
};

interface AppShellProps {
  children: React.ReactNode;
  hotelNom?: string;
  utilisateurNom?: string;
  roleLibelle?: string;
}

export function AppShell({
  children,
  hotelNom = "Hôtel Teranga Palace 5★",
  utilisateurNom = "Mamadou Sow (Directeur)",
  roleLibelle = "Direction Générale",
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOuvert, setMobileOuvert] = useState(false);
  const [sectionsOuvertes, setSectionsOuvertes] = useState<Record<string, boolean>>({
    reception: true,
    gouvernance: false,
    restauration: false,
    evenements: false,
    loisirs: false,
    economat: false,
    tresorerie: false,
    personnel: false,
    direction: false,
  });
  const [searchModalOuvert, setSearchModalOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");

  // Raccourci Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOuvert((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOuvert(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fermeture du menu mobile lors d'un changement d'URL
  useEffect(() => {
    setMobileOuvert(false);
  }, [pathname]);

  const toggleSection = (id: string) => {
    setSectionsOuvertes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const estLienActif = (href?: string) => {
    if (!href) return false;
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ── BARRE LATÉRALE SLACK (DESKTOP) ── */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] z-30 select-none">
        {/* En-tête : Établissement & Sélecteur */}
        <div className="p-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center text-[#120F05] font-black shadow-md tracking-wider text-sm">
                DH
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-white leading-tight truncate max-w-[170px]">
                  {hotelNom}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span className="text-[11px] text-[var(--sidebar-muted)]">Système connecté</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton recherche rapide Ctrl+K */}
          <button
            type="button"
            onClick={() => setSearchModalOuvert(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--sidebar-hover)] border border-[var(--sidebar-border)] text-xs text-[var(--sidebar-muted)] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Rechercher...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-black/30 rounded border border-white/10 text-white/70">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Navigation des 10 Modules Métier */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
          {SECTIONS_MENUS.map((item) => {
            const IconeComp = ICONES[item.icone] || LayoutDashboard;
            const aDesSousMenus = item.items && item.items.length > 0;
            const estOuvert = sectionsOuvertes[item.id];
            const estParentActif = item.items?.some((sm) => estLienActif(sm.href));
            const estDirectActif = estLienActif(item.href);

            if (!aDesSousMenus) {
              return (
                <Link
                  key={item.id}
                  href={item.href || "/"}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    estDirectActif
                      ? "bg-[var(--sidebar-actif)] text-[var(--sidebar-actif-foreground)] font-semibold shadow-xs"
                      : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-hover)]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <IconeComp className="w-4 h-4 shrink-0" />
                    <span>{item.titre}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#9E2A2B] text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            }

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSection(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    estParentActif
                      ? "text-[#D4AF37] font-semibold"
                      : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-hover)]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <IconeComp className="w-4 h-4 shrink-0" />
                    <span>{item.titre}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-[var(--sidebar-muted)] transition-transform duration-200",
                      estOuvert ? "rotate-180" : ""
                    )}
                  />
                </button>

                {estOuvert && (
                  <div className="pl-7 pr-1 py-1 space-y-0.5 border-l border-[var(--sidebar-border)] ml-4">
                    {item.items?.map((sub) => {
                      const actif = estLienActif(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={cn(
                            "flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all",
                            actif
                              ? "bg-[var(--sidebar-actif)] text-[var(--sidebar-actif-foreground)] font-semibold"
                              : "text-[var(--sidebar-muted)] hover:text-white hover:bg-[var(--sidebar-hover)]"
                          )}
                        >
                          <span>{sub.titre}</span>
                          {sub.badge && (
                            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#D4AF37] text-black font-black">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Pied de sidebar : Profil & Session */}
        <div className="p-3 border-t border-[var(--sidebar-border)] bg-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                MS
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate max-w-[130px]">
                  {utilisateurNom}
                </p>
                <p className="text-[10px] text-[var(--sidebar-muted)] truncate max-w-[130px]">
                  {roleLibelle}
                </p>
              </div>
            </div>
            <Link
              href="/login"
              title="Déconnexion"
              className="p-1.5 text-[var(--sidebar-muted)] hover:text-white hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ── CONTENU PRINCIPAL + TOPBAR ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TopBar Supérieure */}
        <header className="h-14 border-b border-[var(--surface-border)] bg-[var(--surface)] px-4 flex items-center justify-between z-20 shrink-0">
          {/* Menu Mobile Hamburger & Titre */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOuvert(true)}
              className="lg:hidden p-1.5 rounded-lg border border-[var(--surface-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-medium text-[var(--foreground-muted)]">
                D-HOTEL
              </span>
              <span className="hidden sm:inline-block text-xs text-[var(--surface-border)]">/</span>
              <span className="text-sm font-semibold text-[var(--foreground)] tracking-tight">
                {SECTIONS_MENUS.find((m) => estLienActif(m.href))?.titre ||
                  "Gestion Opérationnelle"}
              </span>
            </div>
          </div>

          {/* Outils : Actions rapides, Thèmes & Alertes */}
          <div className="flex items-center gap-2.5">
            {/* Bouton Check-in / Nouvelle Résa rapide */}
            <Link
              href="/hebergements/reservations"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nouvelle Réservation</span>
            </Link>

            {/* Sélecteur de langue (FR, EN, AR) */}
            <LanguageSwitcher />

            {/* Sélecteur de thèmes (Palace, Oasis, Midnight) */}
            <ThemeSwitcher />

            {/* Cloche d'alertes hôtelières */}
            <button
              type="button"
              className="relative p-2 rounded-full border border-[var(--surface-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors"
              title="Alertes & Tâches"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
            </button>
          </div>
        </header>

        {/* Corps de la Page (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* ── BARRE MOBILE INFERIEURE (BOTTOM BAR) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--surface-border)] px-2 flex items-center justify-around z-30 shadow-lg">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-medium",
            pathname === "/" ? "text-[var(--primary)] font-bold" : "text-[var(--foreground-muted)]"
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Accueil</span>
        </Link>
        <Link
          href="/hebergements/rack"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-medium",
            pathname.startsWith("/hebergements/rack") ? "text-[var(--primary)] font-bold" : "text-[var(--foreground-muted)]"
          )}
        >
          <Hotel className="w-4 h-4" />
          <span>Rack</span>
        </Link>
        <Link
          href="/restauration/pos"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-medium",
            pathname.startsWith("/restauration/pos") ? "text-[var(--primary)] font-bold" : "text-[var(--foreground-muted)]"
          )}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Caisse POS</span>
        </Link>
        <Link
          href="/gouvernance"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-medium",
            pathname.startsWith("/gouvernance") ? "text-[var(--primary)] font-bold" : "text-[var(--foreground-muted)]"
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ménage</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOuvert(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-[var(--foreground-muted)]"
        >
          <Menu className="w-4 h-4" />
          <span>Modules</span>
        </button>
      </div>

      {/* ── TIROIR MOBILE (SIDEBAR DRAWER) ── */}
      {mobileOuvert && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOuvert(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-[var(--sidebar-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black font-black text-xs">
                  DH
                </div>
                <span className="font-bold text-sm text-white truncate max-w-[170px]">
                  {hotelNom}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOuvert(false)}
                className="p-1 text-[var(--sidebar-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
              {SECTIONS_MENUS.map((item) => {
                const IconeComp = ICONES[item.icone] || LayoutDashboard;
                return (
                  <div key={item.id} className="space-y-0.5">
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOuvert(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white hover:bg-[var(--sidebar-hover)]"
                      >
                        <IconeComp className="w-4 h-4" />
                        <span>{item.titre}</span>
                      </Link>
                    ) : (
                      <div className="px-3 py-1.5 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        {item.titre}
                      </div>
                    )}
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileOuvert(false)}
                        className="block pl-7 pr-3 py-1.5 rounded-md text-xs text-[var(--sidebar-muted)] hover:text-white hover:bg-[var(--sidebar-hover)]"
                      >
                        {sub.titre}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── MODALE RECHERCHE RAPIDE (CTRL + K) ── */}
      {searchModalOuvert && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-[var(--surface-border)] flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher une chambre, un client, une réservation, un plat..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-hidden"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[var(--surface-muted)] rounded border border-[var(--surface-border)] text-[var(--foreground-muted)]">
                ESC
              </kbd>
            </div>

            <div className="p-3 max-h-72 overflow-y-auto space-y-1 text-xs">
              <p className="px-2 py-1 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                Accès Immédiat
              </p>
              <Link
                href="/hebergements/rack"
                onClick={() => setSearchModalOuvert(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground)]"
              >
                <Hotel className="w-4 h-4 text-[#D4AF37]" />
                <span>Voir le Rack des Chambres (Planning Gantt)</span>
              </Link>
              <Link
                href="/hebergements/reservations"
                onClick={() => setSearchModalOuvert(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground)]"
              >
                <PlusCircle className="w-4 h-4 text-[#10B981]" />
                <span>Créer une Nouvelle Réservation</span>
              </Link>
              <Link
                href="/restauration/pos"
                onClick={() => setSearchModalOuvert(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground)]"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#3B82F6]" />
                <span>Ouvrir la Caisse Tactile (Touch POS)</span>
              </Link>
              <Link
                href="/gouvernance"
                onClick={() => setSearchModalOuvert(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--foreground)]"
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>Consulter le Statut de Ménage des Chambres</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
