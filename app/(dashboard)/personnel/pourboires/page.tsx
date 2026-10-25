"use client";

import { useState } from "react";
import {
  Coins,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Users,
  Percent,
  Check,
  Calendar,
  Layers,
  Sparkles,
  Banknote,
  CreditCard,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface LignePourboire {
  id: string;
  collaborateur: string;
  departement: "Salle & Bar" | "Cuisine" | "Gouvernance";
  heuresPresence: number;
  partTheoriqueFCFA: number;
  statutVersement: "verse" | "en_attente";
}

export default function PourboiresPage() {
  const [modalAjoutPourboire, setModalAjoutPourboire] = useState(false);
  const [montantAjoute, setMontantAjoute] = useState(50000);
  const [originePourboire, setOriginePourboire] = useState<"especes" | "carte">("carte");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [totalTroncMois, setTotalTroncMois] = useState(840000);

  const [lignes, setLignes] = useState<LignePourboire[]>([
    {
      id: "1",
      collaborateur: "Amadou Sow (Maître d'Hôtel)",
      departement: "Salle & Bar",
      heuresPresence: 160,
      partTheoriqueFCFA: 140000,
      statutVersement: "en_attente",
    },
    {
      id: "2",
      collaborateur: "Ousmane Diallo (Barman)",
      departement: "Salle & Bar",
      heuresPresence: 155,
      partTheoriqueFCFA: 135000,
      statutVersement: "en_attente",
    },
    {
      id: "3",
      collaborateur: "Fatoumata Ba (Serveuse)",
      departement: "Salle & Bar",
      heuresPresence: 150,
      partTheoriqueFCFA: 130000,
      statutVersement: "en_attente",
    },
    {
      id: "4",
      collaborateur: "Cheikh Tidiane Diouf (Chef Cuisine)",
      departement: "Cuisine",
      heuresPresence: 168,
      partTheoriqueFCFA: 135000,
      statutVersement: "en_attente",
    },
    {
      id: "5",
      collaborateur: "Alioune Badara (Cuisinier)",
      departement: "Cuisine",
      heuresPresence: 160,
      partTheoriqueFCFA: 120000,
      statutVersement: "en_attente",
    },
    {
      id: "6",
      collaborateur: "Aïssatou Sy (Gouvernante)",
      departement: "Gouvernance",
      heuresPresence: 150,
      partTheoriqueFCFA: 90000,
      statutVersement: "en_attente",
    },
    {
      id: "7",
      collaborateur: "Fatou Ndiaye (Femme de chambre)",
      departement: "Gouvernance",
      heuresPresence: 150,
      partTheoriqueFCFA: 90000,
      statutVersement: "en_attente",
    },
  ]);

  const handleAjoutPourboire = (e: React.FormEvent) => {
    e.preventDefault();
    setTotalTroncMois((prev) => prev + montantAjoute);
    setModalAjoutPourboire(false);
    setSuccesMsg(
      `Pourboire de ${formatXOF(montantAjoute)} (${originePourboire}) ajouté au tronc mensuel.`
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const payerTousLesPourboires = () => {
    setLignes((prev) => prev.map((l) => ({ ...l, statutVersement: "verse" })));
    setSuccesMsg(
      "Distribution générale du tronc validée. Reçus de versement émis pour l'ensemble de l'équipe."
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Gestion du Tronc des Pourboires (Tips)
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Collecte transparente (espèces et cartes) et répartition au barème officiel de l'hôtel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalAjoutPourboire(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Enregistrer un Pourboire
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouches Clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Tronc Total Collecté ce Mois</span>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatXOF(totalTroncMois)}
            </p>
          </div>
          <Coins className="w-8 h-8 text-[var(--accent)]/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Bénéficiaires Éligibles</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {lignes.length} collaborateurs
            </p>
          </div>
          <Users className="w-8 h-8 text-emerald-500/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Clé de Répartition</span>
            <p className="text-xs font-bold text-foreground mt-2">
              Salle (55%) • Cuisine (30%) • Ménage (15%)
            </p>
          </div>
          <Percent className="w-8 h-8 text-[var(--primary)]/30" />
        </div>
      </div>

      {/* Tableau de Répartition */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">
            Tableau de Ventilation par Collaborateur (Octobre 2026)
          </h3>
          <button
            onClick={payerTousLesPourboires}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Valider le Versement Général
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Collaborateur</th>
                <th className="px-4 py-3">Département</th>
                <th className="px-4 py-3 text-center">Heures Travaillées</th>
                <th className="px-4 py-3 text-right">Part Attribuée</th>
                <th className="px-4 py-3 text-center">Statut du Versement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {lignes.map((l) => (
                <tr key={l.id} className="hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-3 font-bold text-foreground">
                    {l.collaborateur}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    {l.departement}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-foreground">
                    {l.heuresPresence}h
                  </td>
                  <td className="px-4 py-3 text-right font-black text-foreground">
                    {formatXOF(l.partTheoriqueFCFA)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold capitalize ${
                        l.statutVersement === "verse"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {l.statutVersement === "verse" ? "✓ Versé" : "En attente clôture"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ENREGISTRER POURBOIRE */}
      {modalAjoutPourboire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">Enregistrer un pourboire</h3>
            <form onSubmit={handleAjoutPourboire} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Montant collecté (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={montantAjoute}
                  onChange={(e) => setMontantAjoute(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-bold text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Origine du versement
                </label>
                <select
                  value={originePourboire}
                  onChange={(e) => setOriginePourboire(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                >
                  <option value="carte">Pourboire Carte Bancaire / Mobile Money (POS)</option>
                  <option value="especes">Pourboire Espèces (Boîte physique)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAjoutPourboire(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Ajouter au Tronc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
