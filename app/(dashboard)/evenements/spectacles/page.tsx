"use client";

import { useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  Ticket,
  PlusCircle,
  Search,
  CheckCircle2,
  Music,
  Flame,
  Check,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface SoireeEvenement {
  id: string;
  titre: string;
  theme: string;
  lieu: string;
  date: string;
  horaire: string;
  tarifExterne: number;
  residentGratuit: boolean;
  jaugeTotal: number;
  placesReservees: number;
  artisteOuGroupe: string;
  description: string;
}

export default function SpectaclesSoireesPage() {
  const [recherche, setRecherche] = useState("");
  const [modalReservation, setModalReservation] = useState<SoireeEvenement | null>(null);
  const [nomClient, setNomClient] = useState("");
  const [chambreClient, setChambreClient] = useState("101");
  const [nbPlaces, setNbPlaces] = useState(2);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [soirees, setSoirees] = useState<SoireeEvenement[]>([
    {
      id: "1",
      titre: "Nuit Acoustique Kora & Voix du Sahel",
      theme: "Musique Vivante & Dîner aux Chandelles",
      lieu: "Terrasse Panoramique Bord de Mer",
      date: "Vendredi 30 Octobre 2026",
      horaire: "20h30 - 23h30",
      tarifExterne: 25000,
      residentGratuit: true,
      jaugeTotal: 80,
      placesReservees: 64,
      artisteOuGroupe: "Maître Noumoucounda Cissoko & Invités",
      description: "Ambiance feutrée au son de la kora mandingue, buffet de fruits de mer et cocktails dégustation.",
    },
    {
      id: "2",
      titre: "Grand Barbecue & Grillades de la Plage",
      theme: "Feu de Camp, Méchoui & Jazz Afro",
      lieu: "Crique Sauvage & Plage Privée",
      date: "Samedi 31 Octobre 2026",
      horaire: "19h30 - Minuit",
      tarifExterne: 30000,
      residentGratuit: false,
      jaugeTotal: 120,
      placesReservees: 95,
      artisteOuGroupe: "Dakar Afro-Jazz Collective",
      description: "Thiof grillé au feu de bois, agneau mariné aux herbes du Sahel, animation danses traditionnelles et DJ set.",
    },
    {
      id: "3",
      titre: "Soirée Teranga Salsa & Rumba Océan",
      theme: "Cocktails Cubains & Danses Latines",
      lieu: "Lounge Bar & Paillote Piscine",
      date: "Samedi 07 Novembre 2026",
      horaire: "21h00 - 02h00",
      tarifExterne: 15000,
      residentGratuit: true,
      jaugeTotal: 150,
      placesReservees: 78,
      artisteOuGroupe: "Orchestra Africando Tribute",
      description: "Cours d'initiation à la salsa en bord de piscine suivi d'une grande fête dansante avec tapas et cocktails signature.",
    },
  ]);

  const handleReserver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalReservation) return;

    setSoirees((prev) =>
      prev.map((s) =>
        s.id === modalReservation.id
          ? { ...s, placesReservees: s.placesReservees + nbPlaces }
          : s
      )
    );

    const cout = modalReservation.residentGratuit ? 0 : modalReservation.tarifExterne * nbPlaces;
    setSuccesMsg(
      `Réservation de ${nbPlaces} place(s) confirmée pour ${modalReservation.titre}. ${
        cout > 0
          ? `${formatXOF(cout)} imputés sur la Chambre ${chambreClient}.`
          : "Accès résident offert."
      }`
    );
    setModalReservation(null);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Music className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Spectacles, Dîners-Concerts & Soirées
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Programmation culturelle, billetterie des animations de l'hôtel et réservations de tables
          </p>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Grille des Soirées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {soirees.map((soiree) => {
          const tauxRemplissage = Math.round(
            (soiree.placesReservees / soiree.jaugeTotal) * 100
          );

          return (
            <div
              key={soiree.id}
              className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[var(--primary-soft)] text-[var(--primary)]">
                    {soiree.theme}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {soiree.jaugeTotal - soiree.placesReservees} places dispo
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {soiree.titre}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--accent)] mt-0.5">
                    Artiste : {soiree.artisteOuGroupe}
                  </p>
                </div>

                <p className="text-xs text-foreground-muted leading-relaxed">
                  {soiree.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-surface-border text-xs text-foreground-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-foreground" />
                    <span>{soiree.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-foreground" />
                    <span>{soiree.horaire}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-foreground" />
                    <span>{soiree.lieu}</span>
                  </div>
                </div>

                {/* Barre de progression jauge */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-muted">Taux d'occupation :</span>
                    <span className="font-bold text-foreground">{tauxRemplissage}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all"
                      style={{ width: `${tauxRemplissage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-muted/40 border-t border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-foreground-muted block">
                    Tarif par personne :
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {formatXOF(soiree.tarifExterne)}
                  </span>
                  {soiree.residentGratuit && (
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      (Gratuit pour les résidents)
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setModalReservation(soiree)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
                >
                  Réserver des Places
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL RÉSERVATION SPECTACLE */}
      {modalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-start justify-between shrink-0 bg-surface">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Réserver : {modalReservation.titre}
                </h3>
                <p className="text-xs text-foreground-muted">
                  {modalReservation.date} • {modalReservation.lieu}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalReservation(null)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReserver} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Chambre du client résident <span className="text-danger">*</span>
                  </label>
                  <select
                    value={chambreClient}
                    onChange={(e) => setChambreClient(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="101">Chambre 101 (M. Ibrahima Diop)</option>
                    <option value="102">Chambre 102 (Mme Awa Sarr)</option>
                    <option value="201">Suite Junior 201 (M. Amadou Tidiane Ba)</option>
                    <option value="B12">Bungalow Plage 12 (Mme Sophie Martin)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Nombre de couverts / places <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={nbPlaces}
                    onChange={(e) => setNbPlaces(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-background border border-surface-border flex items-center justify-between text-xs">
                  <span className="text-foreground-muted font-medium">Montant à imputer sur folio :</span>
                  <span className="font-bold text-sm text-[var(--primary)]">
                    {modalReservation.residentGratuit
                      ? "Offert (Résident)"
                      : formatXOF(modalReservation.tarifExterne * nbPlaces)}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setModalReservation(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
                >
                  Confirmer la Réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
