"use client";

import { useState } from "react";
import {
  Wrench,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  UserCheck,
  Hotel,
  ShieldAlert,
  Flame,
  Zap,
  Droplets,
  Tv,
  KeyRound,
  Check,
} from "lucide-react";

interface IncidentMaintenance {
  id: string;
  titre: string;
  emplacement: string;
  typeEquipement: "Climatisation" | "Plomberie" | "Électricité" | "Serrure / Clé" | "TV / Réseau" | "Mobilier";
  niveauUrgence: "critique" | "modere" | "faible";
  signalePar: string;
  heureSignalement: string;
  technicienAssigne: string | null;
  statut: "signale" | "en_cours" | "resolu";
  impactChambre: boolean; // Si oui -> met la chambre en Hors Service
  description: string;
}

export default function MaintenancePage() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreUrgence, setFiltreUrgence] = useState("tous");
  const [modalNouveauTicket, setModalNouveauTicket] = useState(false);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire nouveau ticket
  const [nouvelEmplacement, setNouvelEmplacement] = useState("Chambre 204");
  const [nouveauType, setNouveauType] = useState<IncidentMaintenance["typeEquipement"]>("Climatisation");
  const [nouvelleUrgence, setNouvelleUrgence] = useState<IncidentMaintenance["niveauUrgence"]>("critique");
  const [nouveauTitre, setNouveauTitre] = useState("");
  const [nouvelleDescription, setNouvelleDescription] = useState("");
  const [impactHorsService, setImpactHorsService] = useState(true);

  const [incidents, setIncidents] = useState<IncidentMaintenance[]>([
    {
      id: "1",
      titre: "Fuite d'eau groupe de condensation climatiseur",
      emplacement: "Suite Océan 204",
      typeEquipement: "Climatisation",
      niveauUrgence: "critique",
      signalePar: "Fatou Ndiaye (Femme de chambre)",
      heureSignalement: "Il y a 35 min",
      technicienAssigne: "Babacar Fall",
      statut: "en_cours",
      impactChambre: true,
      description: "Écoulement important sur le mur près du minibar. Chambre passée automatiquement en Hors Service.",
    },
    {
      id: "2",
      titre: "Serrure magnétique déprogrammée",
      emplacement: "Chambre 105",
      typeEquipement: "Serrure / Clé",
      niveauUrgence: "modere",
      signalePar: "Réception (Check-in)",
      heureSignalement: "Il y a 1h 15m",
      technicienAssigne: "Moussa Sène",
      statut: "resolu",
      impactChambre: false,
      description: "Piles du boîtier changées et reprogrammation avec la carte maîtresse.",
    },
    {
      id: "3",
      titre: "Éclairage terrasse extérieure défectueux",
      emplacement: "Restaurant / Paillote Piscine",
      typeEquipement: "Électricité",
      niveauUrgence: "faible",
      signalePar: "Maître d'Hôtel",
      heureSignalement: "Ce matin 08:30",
      technicienAssigne: "Babacar Fall",
      statut: "signale",
      impactChambre: false,
      description: "3 spots LED encastrés au sol ne s'allument plus avant le service du soir.",
    },
    {
      id: "4",
      titre: "Mitigeur douche bloqué en eau tiède",
      emplacement: "Bungalow Plage 14",
      typeEquipement: "Plomberie",
      niveauUrgence: "modere",
      signalePar: "Gouvernante Générale",
      heureSignalement: "Hier 17:40",
      technicienAssigne: "Moussa Sène",
      statut: "en_cours",
      impactChambre: false,
      description: "Détartrage de la cartouche thermostatique nécessaire.",
    },
  ]);

  const handleCreerTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauTitre) return;

    const nouveau: IncidentMaintenance = {
      id: String(Date.now()),
      titre: nouveauTitre,
      emplacement: nouvelEmplacement,
      typeEquipement: nouveauType,
      niveauUrgence: nouvelleUrgence,
      signalePar: "Direction / Réception",
      heureSignalement: "À l'instant",
      technicienAssigne: "Babacar Fall (Technicien de garde)",
      statut: "signale",
      impactChambre: impactHorsService,
      description: nouvelleDescription,
    };

    setIncidents([nouveau, ...incidents]);
    setModalNouveauTicket(false);
    setNouveauTitre("");
    setNouvelleDescription("");
    setSuccesMsg(
      `Ticket de maintenance créé pour ${nouveau.emplacement}. ${
        nouveau.impactChambre ? "Chambre basculée en 'Hors Service' sur le rack." : ""
      }`
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const changerStatut = (id: string, nouveauStatut: IncidentMaintenance["statut"]) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, statut: nouveauStatut } : inc))
    );
    setSuccesMsg("Statut de l'intervention actualisé.");
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  const incidentsFiltres = incidents.filter((inc) => {
    const correspondRecherche =
      inc.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      inc.emplacement.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut =
      filtreStatut === "tous" || inc.statut === filtreStatut;
    const correspondUrgence =
      filtreUrgence === "tous" || inc.niveauUrgence === filtreUrgence;
    return correspondRecherche && correspondStatut && correspondUrgence;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Maintenance & Pannes Techniques
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Signalement en temps réel, assignation des techniciens & gestion des chambres hors service
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNouveauTicket(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Signaler une Panne
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Compteurs d'état */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Urgences Critiques</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {incidents.filter((i) => i.niveauUrgence === "critique" && i.statut !== "resolu").length}
            </p>
          </div>
          <ShieldAlert className="w-8 h-8 text-rose-500/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">En Cours d'Intervention</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {incidents.filter((i) => i.statut === "en_cours").length}
            </p>
          </div>
          <Clock className="w-8 h-8 text-amber-500/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Chambres Hors Service</span>
            <p className="text-2xl font-bold text-[var(--primary)] mt-1">
              {incidents.filter((i) => i.impactChambre && i.statut !== "resolu").length}
            </p>
          </div>
          <Hotel className="w-8 h-8 text-[var(--primary)]/30" />
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par titre, chambre, équipement..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Tous les statuts</option>
          <option value="signale">Nouveaux signalés</option>
          <option value="en_cours">En cours de réparation</option>
          <option value="resolu">Résolus</option>
        </select>

        <select
          value={filtreUrgence}
          onChange={(e) => setFiltreUrgence(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Toutes les urgences</option>
          <option value="critique">Critique (Bloquant)</option>
          <option value="modere">Modéré</option>
          <option value="faible">Faible</option>
        </select>
      </div>

      {/* Liste des tickets */}
      <div className="space-y-3">
        {incidentsFiltres.map((inc) => {
          const estCritique = inc.niveauUrgence === "critique";
          const estResolu = inc.statut === "resolu";

          return (
            <div
              key={inc.id}
              className={`p-5 rounded-xl bg-surface border transition hover:shadow-md ${
                estResolu
                  ? "border-surface-border opacity-70"
                  : estCritique
                  ? "border-rose-300 dark:border-rose-900/60"
                  : "border-surface-border"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        estCritique
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : inc.niveauUrgence === "modere"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-surface-muted text-foreground-muted"
                      }`}
                    >
                      {inc.niveauUrgence}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-muted text-foreground font-semibold">
                      {inc.typeEquipement}
                    </span>
                    <span className="text-sm font-bold text-[var(--accent)]">
                      {inc.emplacement}
                    </span>
                    {inc.impactChambre && !estResolu && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                        Chambre Hors Service
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {inc.titre}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {inc.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-xs text-foreground-muted">
                    <span className="block font-medium text-foreground">
                      {inc.technicienAssigne || "Non assigné"}
                    </span>
                    <span>{inc.heureSignalement}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {inc.statut === "signale" && (
                      <button
                        onClick={() => changerStatut(inc.id, "en_cours")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                      >
                        Prendre en charge
                      </button>
                    )}
                    {inc.statut === "en_cours" && (
                      <button
                        onClick={() => changerStatut(inc.id, "resolu")}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Clôturer & Remettre en service
                      </button>
                    )}
                    {estResolu && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Réparation validée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NOUVEAU TICKET */}
      {modalNouveauTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">Signaler une panne technique</h3>
            <form onSubmit={handleCreerTicket} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">
                  Chambre ou Zone de l'Hôtel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chambre 204, Terrasse Piscine, Cuisine..."
                  value={nouvelEmplacement}
                  onChange={(e) => setNouvelEmplacement(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground-muted block mb-1">
                    Corps de métier
                  </label>
                  <select
                    value={nouveauType}
                    onChange={(e) => setNouveauType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                  >
                    <option value="Climatisation">Climatisation</option>
                    <option value="Plomberie">Plomberie</option>
                    <option value="Électricité">Électricité</option>
                    <option value="Serrure / Clé">Serrure / Clé</option>
                    <option value="TV / Réseau">TV / Réseau</option>
                    <option value="Mobilier">Mobilier</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground-muted block mb-1">
                    Urgence
                  </label>
                  <select
                    value={nouvelleUrgence}
                    onChange={(e) => setNouvelleUrgence(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                  >
                    <option value="critique">Critique (Bloquant)</option>
                    <option value="modere">Modéré</option>
                    <option value="faible">Faible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">
                  Intitulé du problème *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fuite d'eau, clim qui souffle tiède..."
                  value={nouveauTitre}
                  onChange={(e) => setNouveauTitre(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={3}
                  placeholder="Préciser l'emplacement exact et les symptômes..."
                  value={nouvelleDescription}
                  onChange={(e) => setNouvelleDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="impactHs"
                  checked={impactHorsService}
                  onChange={(e) => setImpactHorsService(e.target.checked)}
                  className="rounded text-[var(--primary)]"
                />
                <label htmlFor="impactHs" className="text-xs text-foreground font-medium">
                  Mettre la chambre automatiquement en "Hors Service" sur le Rack
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalNouveauTicket(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Transmettre au Technicien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
