"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Coffee,
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface ChambreMenage {
  id: string;
  numero: string;
  type: string;
  etage: string;
  statut: "propre" | "a_nettoyer_blanc" | "a_nettoyer_recouche" | "en_cours" | "a_controler" | "maintenance";
  gouvernante: string;
  dernierPassage: string;
  clientEnSejour?: string;
  minibarConso?: string;
}

export default function GouvernancePage() {
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [filtreEtage, setFiltreEtage] = useState<string>("tous");
  const [chambres, setChambres] = useState<ChambreMenage[]>([
    {
      id: "101",
      numero: "101",
      type: "Chambre Standard",
      etage: "RDC",
      statut: "propre",
      gouvernante: "Fatou Ndiaye",
      dernierPassage: "Aujourd'hui 09h30",
      clientEnSejour: "M. Ibrahima Diop",
    },
    {
      id: "102",
      numero: "102",
      type: "Chambre Standard",
      etage: "RDC",
      statut: "a_nettoyer_blanc",
      gouvernante: "Fatou Ndiaye",
      dernierPassage: "Hier 16h00",
      minibarConso: "2 sodas, 1 eau minérale",
    },
    {
      id: "103",
      numero: "103",
      type: "Chambre Deluxe",
      etage: "RDC",
      statut: "en_cours",
      gouvernante: "Mariama Ba",
      dernierPassage: "En cours depuis 15 min",
      clientEnSejour: "Dr. K. Ndiaye",
    },
    {
      id: "201",
      numero: "201",
      type: "Suite Junior",
      etage: "1er",
      statut: "a_controler",
      gouvernante: "Mariama Ba",
      dernierPassage: "Aujourd'hui 11h15",
      clientEnSejour: "M. & Mme Moreau",
    },
    {
      id: "202",
      numero: "202",
      type: "Suite Exécutive",
      etage: "1er",
      statut: "a_nettoyer_recouche",
      gouvernante: "Aïssatou Sow",
      dernierPassage: "Aujourd'hui 08h00",
      clientEnSejour: "Délégation PNUD",
    },
    {
      id: "204",
      numero: "204",
      type: "Suite Océan",
      etage: "1er",
      statut: "maintenance",
      gouvernante: "Non assignée",
      dernierPassage: "Signalé ce matin",
    },
    {
      id: "B01",
      numero: "Villa 1",
      type: "Bungalow Plage",
      etage: "Jardin",
      statut: "propre",
      gouvernante: "Aïssatou Sow",
      dernierPassage: "Aujourd'hui 10h45",
      clientEnSejour: "Famille Bamba Fall",
    },
  ]);

  function changerStatut(id: string, nouveauStatut: ChambreMenage["statut"]) {
    setChambres((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut: nouveauStatut } : c))
    );
  }

  const chambresFiltrees = chambres.filter((c) => {
    const correspondStatut =
      filtreStatut === "tous" || c.statut === filtreStatut;
    const correspondEtage = filtreEtage === "tous" || c.etage === filtreEtage;
    return correspondStatut && correspondEtage;
  });

  return (
    <div className="space-y-6">
      {/* ── EN-TÊTE GOUVERNANCE ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-[var(--surface-border)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#10B981]" />
            <span>Gouvernance & Statuts de Ménage (Housekeeping)</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            Affectations des agents, contrôle qualité des chambres, minibar & maintenance
          </p>
        </div>

        {/* Compteurs rapides */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] font-bold">
            2 Propres
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] font-bold">
            2 À Nettoyer
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] font-bold">
            1 En cours
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#EF4444]/15 text-[#EF4444] font-bold">
            1 Maintenance
          </span>
        </div>
      </div>

      {/* ── BARRE DE FILTRES ── */}
      <div className="flex flex-wrap items-center gap-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--surface-border)] text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--foreground-muted)]" />
          <span className="font-semibold text-[var(--foreground)]">Filtrer par :</span>
        </div>

        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="p-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] font-medium"
        >
          <option value="tous">Tous les statuts</option>
          <option value="propre">Propre / Prête</option>
          <option value="a_nettoyer_blanc">À nettoyer (À blanc - Départ)</option>
          <option value="a_nettoyer_recouche">À nettoyer (Recouche - Séjour)</option>
          <option value="en_cours">En cours de ménage</option>
          <option value="a_controler">À contrôler par Gouvernante</option>
          <option value="maintenance">Hors service / Maintenance</option>
        </select>

        <select
          value={filtreEtage}
          onChange={(e) => setFiltreEtage(e.target.value)}
          className="p-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] font-medium"
        >
          <option value="tous">Tous les étages / zones</option>
          <option value="RDC">Rez-de-Chaussée (RDC)</option>
          <option value="1er">1er Étage</option>
          <option value="Jardin">Villas Jardin / Plage</option>
        </select>
      </div>

      {/* ── GRILLE DES CARTES CHAMBRES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {chambresFiltrees.map((chambre) => {
          const estPropre = chambre.statut === "propre";
          const estEnCours = chambre.statut === "en_cours";
          const estAControler = chambre.statut === "a_controler";
          const estMaintenance = chambre.statut === "maintenance";
          const estANettoyer =
            chambre.statut === "a_nettoyer_blanc" ||
            chambre.statut === "a_nettoyer_recouche";

          return (
            <div
              key={chambre.id}
              className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                {/* En-tête de carte */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--surface-border)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--foreground)]">
                      Chambre {chambre.numero}
                    </h3>
                    <p className="text-[10px] text-[var(--foreground-muted)]">
                      {chambre.type} • {chambre.etage}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      estPropre
                        ? "bg-[#10B981]/15 text-[#10B981]"
                        : estEnCours
                        ? "bg-[#3B82F6]/15 text-[#3B82F6]"
                        : estAControler
                        ? "bg-[#8B5CF6]/15 text-[#8B5CF6]"
                        : estMaintenance
                        ? "bg-[#EF4444]/15 text-[#EF4444]"
                        : "bg-[#F59E0B]/15 text-[#F59E0B]"
                    }`}
                  >
                    {chambre.statut.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Détails opérationnels */}
                <div className="space-y-1.5 py-2 text-xs">
                  <div className="flex items-center justify-between text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Agent</span>
                    </span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {chambre.gouvernante}
                    </span>
                  </div>

                  {chambre.clientEnSejour && (
                    <div className="flex items-center justify-between text-[var(--foreground-muted)]">
                      <span>Occupant</span>
                      <span className="font-semibold text-[var(--foreground)]">
                        {chambre.clientEnSejour}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Dernier pointage</span>
                    </span>
                    <span>{chambre.dernierPassage}</span>
                  </div>

                  {chambre.minibarConso && (
                    <div className="p-2 rounded-lg bg-[var(--surface-muted)] text-[11px] text-[#D4AF37] font-medium flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 shrink-0" />
                      <span>Minibar : {chambre.minibarConso}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'Action Rapide pour Femme de Chambre / Gouvernante */}
              <div className="pt-2 border-t border-[var(--surface-border)] space-y-1.5">
                {estANettoyer && (
                  <button
                    type="button"
                    onClick={() => changerStatut(chambre.id, "en_cours")}
                    className="w-full py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Démarrer le Ménage
                  </button>
                )}

                {estEnCours && (
                  <button
                    type="button"
                    onClick={() => changerStatut(chambre.id, "a_controler")}
                    className="w-full py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7c4def] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Ménage Fini ➔ Prêt à Contrôler
                  </button>
                )}

                {estAControler && (
                  <button
                    type="button"
                    onClick={() => changerStatut(chambre.id, "propre")}
                    className="w-full py-2 rounded-lg bg-[#10B981] hover:bg-[#0ea571] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider Chambre Propre</span>
                  </button>
                )}

                {estPropre && (
                  <div className="text-center py-1.5 text-xs font-bold text-[#10B981] flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Prête à accueillir</span>
                  </div>
                )}

                {estMaintenance && (
                  <button
                    type="button"
                    onClick={() => changerStatut(chambre.id, "propre")}
                    className="w-full py-2 rounded-lg bg-[var(--surface)] border border-[var(--surface-border)] hover:bg-[var(--surface-muted)] text-xs font-bold text-[var(--foreground)]"
                  >
                    Réparation Terminée
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
