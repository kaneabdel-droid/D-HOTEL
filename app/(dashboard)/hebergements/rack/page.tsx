"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  Hotel,
  Sparkles,
  Info,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function RackPlanningPage() {
  const [dateDebut, setDateDebut] = useState(new Date("2026-10-24"));
  const [vueJours, setVueJours] = useState<number>(7);
  const [modalReservation, setModalReservation] = useState<any | null>(null);

  // Génération des jours visibles
  const jours = Array.from({ length: vueJours }).map((_, i) => {
    const d = new Date(dateDebut);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Liste réaliste de chambres par catégorie
  const chambres = [
    {
      id: "101",
      numero: "101",
      type: "Chambre Standard",
      etage: "RDC",
      statutMenage: "propre",
      prix: "45 000 FCFA",
    },
    {
      id: "102",
      numero: "102",
      type: "Chambre Standard",
      etage: "RDC",
      statutMenage: "propre",
      prix: "45 000 FCFA",
    },
    {
      id: "103",
      numero: "103",
      type: "Chambre Deluxe",
      etage: "RDC",
      statutMenage: "en_nettoyage",
      prix: "65 000 FCFA",
    },
    {
      id: "201",
      numero: "201",
      type: "Suite Junior",
      etage: "1er",
      statutMenage: "propre",
      prix: "95 000 FCFA",
    },
    {
      id: "202",
      numero: "202",
      type: "Suite Exécutive",
      etage: "1er",
      statutMenage: "propre",
      prix: "135 000 FCFA",
    },
    {
      id: "204",
      numero: "204",
      type: "Suite Océan",
      etage: "1er",
      statutMenage: "maintenance",
      prix: "150 000 FCFA",
    },
    {
      id: "B01",
      numero: "Villa 1",
      type: "Bungalow Plage",
      etage: "Jardin",
      statutMenage: "propre",
      prix: "180 000 FCFA",
    },
    {
      id: "B02",
      numero: "Villa 2",
      type: "Bungalow Plage",
      etage: "Jardin",
      statutMenage: "propre",
      prix: "180 000 FCFA",
    },
  ];

  // Réservations placées sur la timeline
  const reservations = [
    {
      id: "RES-101",
      chambreId: "101",
      client: "M. Ibrahima Diop",
      arrivee: "2026-10-24",
      depart: "2026-10-27",
      statut: "en_sejour",
      acompte: "Payé Wave",
      nuits: 3,
      couleur: "bg-[#3B82F6] text-white border-blue-600",
    },
    {
      id: "RES-102",
      chambreId: "102",
      client: "Mme Awa Sarr",
      arrivee: "2026-10-26",
      depart: "2026-10-29",
      statut: "confirmee",
      acompte: "Acompte Orange Money",
      nuits: 3,
      couleur: "bg-[#8B5CF6] text-white border-purple-600",
    },
    {
      id: "RES-103",
      chambreId: "103",
      client: "Dr. K. Ndiaye",
      arrivee: "2026-10-24",
      depart: "2026-10-25",
      statut: "depart_prevu",
      acompte: "Facture Entreprise",
      nuits: 1,
      couleur: "bg-[#D4AF37] text-black border-amber-500 font-bold",
    },
    {
      id: "RES-201",
      chambreId: "201",
      client: "M. & Mme Moreau",
      arrivee: "2026-10-24",
      depart: "2026-10-28",
      statut: "en_sejour",
      acompte: "Carte Bancaire",
      nuits: 4,
      couleur: "bg-[#3B82F6] text-white border-blue-600",
    },
    {
      id: "RES-202",
      chambreId: "202",
      client: "Délégation PNUD (VIP)",
      arrivee: "2026-10-25",
      depart: "2026-10-30",
      statut: "confirmee",
      acompte: "Bon de Commande",
      nuits: 5,
      couleur: "bg-[#10B981] text-white border-emerald-600",
    },
    {
      id: "RES-B01",
      chambreId: "B01",
      client: "Famille Bamba Fall",
      arrivee: "2026-10-24",
      depart: "2026-10-31",
      statut: "en_sejour",
      acompte: "Payé Intégral",
      nuits: 7,
      couleur: "bg-[#3B82F6] text-white border-blue-600",
    },
  ];

  function formaterJour(d: Date) {
    return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" }).format(d);
  }

  function getChambreResa(chambreId: string, jourStr: string) {
    return reservations.find((r) => {
      return r.chambreId === chambreId && jourStr >= r.arrivee && jourStr < r.depart;
    });
  }

  return (
    <div className="space-y-6">
      {/* ── EN-TÊTE DU RACK & CONTRÔLES ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-[var(--surface-border)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Hotel className="w-6 h-6 text-[#D4AF37]" />
            <span>Rack d&apos;Occupation (Planning Gantt)</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            Gestion visuelle des séjours, détection d&apos;indisponibilité et check-in express
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                const d = new Date(dateDebut);
                d.setDate(d.getDate() - 7);
                setDateDebut(d);
              }}
              className="p-1 hover:bg-[var(--surface-muted)] rounded"
              title="Semaine précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-[var(--foreground)]">
              {new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(dateDebut)}
            </span>
            <button
              type="button"
              onClick={() => {
                const d = new Date(dateDebut);
                d.setDate(d.getDate() + 7);
                setDateDebut(d);
              }}
              className="p-1 hover:bg-[var(--surface-muted)] rounded"
              title="Semaine suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setVueJours(7)}
              className={`px-2.5 py-1 rounded font-medium ${vueJours === 7 ? "bg-[var(--primary)] text-white" : "text-[var(--foreground-muted)]"}`}
            >
              7 jours
            </button>
            <button
              type="button"
              onClick={() => setVueJours(14)}
              className={`px-2.5 py-1 rounded font-medium ${vueJours === 14 ? "bg-[var(--primary)] text-white" : "text-[var(--foreground-muted)]"}`}
            >
              14 jours
            </button>
          </div>

          <Link
            href="/hebergements/reservations"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle Résa</span>
          </Link>
        </div>
      </div>

      {/* ── LÉGENDE DES COULEURS DU RACK ── */}
      <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] flex-wrap bg-[var(--surface)] p-3 rounded-xl border border-[var(--surface-border)]">
        <span className="font-semibold text-[var(--foreground)]">Légende :</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#3B82F6]" />
          <span>Client en séjour</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#8B5CF6]" />
          <span>Réservation confirmée</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#10B981]" />
          <span>Client VIP / Délégation</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#D4AF37]" />
          <span>Départ dû aujourd&apos;hui</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#EF4444]" />
          <span>Hors service / Travaux</span>
        </span>
      </div>

      {/* ── GRILLE DU RACK (GANTT INTERACTIF) ── */}
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl shadow-xs overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Ligne d'en-tête : Dates */}
          <div className="grid grid-cols-8 border-b border-[var(--surface-border)] bg-[var(--surface-muted)] text-xs font-semibold text-[var(--foreground-muted)]">
            <div className="p-3 border-r border-[var(--surface-border)] w-48 shrink-0">
              Chambre & Type
            </div>
            {jours.map((jour, idx) => {
              const jourStr = jour.toISOString().slice(0, 10);
              const estAujourdhui = jourStr === "2026-10-24";
              return (
                <div
                  key={idx}
                  className={`p-3 text-center border-r border-[var(--surface-border)] ${
                    estAujourdhui ? "bg-[#D4AF37]/15 text-[#9E2A2B] font-bold" : ""
                  }`}
                >
                  <p className="capitalize">{formaterJour(jour)}</p>
                  {estAujourdhui && <span className="text-[10px] text-[#9E2A2B]">Aujourd&apos;hui</span>}
                </div>
              );
            })}
          </div>

          {/* Lignes des Chambres */}
          <div className="divide-y divide-[var(--surface-border)]">
            {chambres.map((chambre) => (
              <div key={chambre.id} className="grid grid-cols-8 text-xs hover:bg-[var(--surface-muted)]/30 transition-colors">
                {/* Colonne Chambre info */}
                <div className="p-3 border-r border-[var(--surface-border)] w-48 shrink-0 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--foreground)] text-sm">
                        {chambre.numero}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          chambre.statutMenage === "propre"
                            ? "bg-[#10B981]"
                            : chambre.statutMenage === "en_nettoyage"
                            ? "bg-[#F59E0B]"
                            : "bg-[#EF4444]"
                        }`}
                        title={chambre.statutMenage}
                      />
                    </div>
                    <p className="text-[10px] text-[var(--foreground-muted)] truncate max-w-[120px]">
                      {chambre.type}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-[var(--foreground-muted)]">
                    {chambre.prix}
                  </span>
                </div>

                {/* Colonnes des jours */}
                {jours.map((jour, jIdx) => {
                  const jourStr = jour.toISOString().slice(0, 10);
                  const resa = getChambreResa(chambre.id, jourStr);
                  const estPremierJour = resa?.arrivee === jourStr;

                  if (chambre.statutMenage === "maintenance") {
                    return (
                      <div
                        key={jIdx}
                        className="border-r border-[var(--surface-border)] p-1 bg-red-500/10 flex items-center justify-center text-[10px] text-red-500 font-bold"
                      >
                        {jIdx === 0 ? "Maintenance" : ""}
                      </div>
                    );
                  }

                  if (resa) {
                    return (
                      <div
                        key={jIdx}
                        onClick={() => setModalReservation(resa)}
                        className="border-r border-[var(--surface-border)] p-1 cursor-pointer flex items-center"
                      >
                        <div
                          className={`w-full py-1.5 px-2 rounded-md shadow-xs text-[11px] truncate border ${resa.couleur}`}
                          title={`${resa.client} (${resa.nuits} nuits)`}
                        >
                          {estPremierJour ? (
                            <span className="font-semibold flex items-center gap-1">
                              <User className="w-3 h-3 shrink-0" />
                              {resa.client}
                            </span>
                          ) : (
                            <span className="opacity-75">· · ·</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={jIdx}
                      className="border-r border-[var(--surface-border)] p-1 hover:bg-[#10B981]/10 transition-colors flex items-center justify-center group cursor-pointer"
                      title="Chambre disponible : cliquez pour réserver"
                    >
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[#10B981]">
                        + Dispo
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODALE DÉTAILS DU SÉJOUR SÉLECTIONNÉ ── */}
      {modalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Folio de Séjour
                </span>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  {modalReservation.client}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalReservation(null)}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--surface-border)]">
                <span className="text-[var(--foreground-muted)]">Chambre attribuée</span>
                <span className="font-semibold text-[var(--foreground)]">{modalReservation.chambreId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--surface-border)]">
                <span className="text-[var(--foreground-muted)]">Période du séjour</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {modalReservation.arrivee} ➔ {modalReservation.depart} ({modalReservation.nuits} nuits)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--surface-border)]">
                <span className="text-[var(--foreground-muted)]">Statut du séjour</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  {modalReservation.statut}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--surface-border)]">
                <span className="text-[var(--foreground-muted)]">Règlement Acompte</span>
                <span className="font-semibold text-[#10B981]">{modalReservation.acompte}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalReservation(null)}
                className="flex-1 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold"
              >
                Accéder au Folio & Facture
              </button>
              <button
                type="button"
                onClick={() => setModalReservation(null)}
                className="px-3 py-2 rounded-lg border border-[var(--surface-border)] hover:bg-[var(--surface-muted)] text-xs text-[var(--foreground)]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
