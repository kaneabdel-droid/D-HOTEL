"use client";

import { useState } from "react";
import {
  Compass,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles,
  ShieldCheck,
  Coins,
  Anchor,
  Bike,
  TreePine,
  Check,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface SortieExcursion {
  id: string;
  nom: string;
  categorie: "Safari & Faune" | "Pirogue & Mangrove" | "Aventure & Quads" | "Pêche & Océan" | "Spa & Bien-être";
  dateSortie: string;
  horaireDepart: string;
  duree: string;
  prixParPersonne: number;
  jaugeMax: number;
  inscrits: number;
  guideAssigne: string;
  vehiculeOuEmbarcation: string;
  dechargeSignee: boolean;
  participants: { chambre: string; client: string; nb: number; paye: boolean }[];
}

export default function ExcursionsPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreCat, setFiltreCat] = useState("tous");
  const [modalInscription, setModalInscription] = useState<SortieExcursion | null>(null);
  const [chambreInscrite, setChambreInscrite] = useState("101");
  const [nbPersonnes, setNbPersonnes] = useState(2);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [sorties, setSorties] = useState<SortieExcursion[]>([
    {
      id: "1",
      nom: "Safari Réserve Animalière de Bandia",
      categorie: "Safari & Faune",
      dateSortie: "Aujourd'hui 24 Oct",
      horaireDepart: "15h30",
      duree: "3h30",
      prixParPersonne: 35000,
      jaugeMax: 12,
      inscrits: 8,
      guideAssigne: "Ousmane Diagne",
      vehiculeOuEmbarcation: "Minibus 4x4 Safari 1",
      dechargeSignee: true,
      participants: [
        { chambre: "Suite 201", client: "M. Ba", nb: 2, paye: true },
        { chambre: "Villa 12", client: "Mme Martin", nb: 1, paye: true },
        { chambre: "Chambres 104-106", client: "Délégation Sonatel", nb: 5, paye: true },
      ],
    },
    {
      id: "2",
      nom: "Balade Pirogue & Îles du Delta du Saloum",
      categorie: "Pirogue & Mangrove",
      dateSortie: "Demain 25 Oct",
      horaireDepart: "09h00",
      duree: "4h00",
      prixParPersonne: 28000,
      jaugeMax: 16,
      inscrits: 10,
      guideAssigne: "Babacar Sarr (Piroguier)",
      vehiculeOuEmbarcation: "Grande Pirogue Royale 'Saloum'",
      dechargeSignee: true,
      participants: [
        { chambre: "Chambre 101", client: "M. Diop", nb: 2, paye: true },
        { chambre: "Chambre 102", client: "Mme Sarr", nb: 2, paye: true },
      ],
    },
    {
      id: "3",
      nom: "Randonnée Quads & Dunes du Littoral",
      categorie: "Aventure & Quads",
      dateSortie: "Demain 25 Oct",
      horaireDepart: "16h00",
      duree: "2h00",
      prixParPersonne: 45000,
      jaugeMax: 8,
      inscrits: 6,
      guideAssigne: "Ibrahima Touré",
      vehiculeOuEmbarcation: "Flotte Quads Yamaha 450cc",
      dechargeSignee: true,
      participants: [
        { chambre: "Suite 202", client: "M. Al-Mansoori", nb: 2, paye: true },
      ],
    },
    {
      id: "4",
      nom: "Rituel Massage Teranga aux Huiles de Baobab (Spa)",
      categorie: "Spa & Bien-être",
      dateSortie: "Tous les jours",
      horaireDepart: "Sur RDV (10h-20h)",
      duree: "1h15",
      prixParPersonne: 32000,
      jaugeMax: 4,
      inscrits: 3,
      guideAssigne: "Khadija (Praticienne Spa)",
      vehiculeOuEmbarcation: "Cabine Océane Spa 1",
      dechargeSignee: true,
      participants: [
        { chambre: "Villa 1", client: "Mme Fall", nb: 1, paye: true },
      ],
    },
  ]);

  const handleInscrire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalInscription) return;

    setSorties((prev) =>
      prev.map((s) =>
        s.id === modalInscription.id
          ? {
              ...s,
              inscrits: s.inscrits + nbPersonnes,
              participants: [
                ...s.participants,
                {
                  chambre: `Chambre ${chambreInscrite}`,
                  client: "Client en séjour",
                  nb: nbPersonnes,
                  paye: true,
                },
              ],
            }
          : s
      )
    );

    const montant = modalInscription.prixParPersonne * nbPersonnes;
    setSuccesMsg(
      `${nbPersonnes} participant(s) inscrit(s) à "${modalInscription.nom}". ${formatXOF(
        montant
      )} imputés sur le Folio de la Chambre ${chambreInscrite}.`
    );
    setModalInscription(null);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const sortiesFiltrees = sorties.filter((s) => {
    const correspondRecherche =
      s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      s.guideAssigne.toLowerCase().includes(recherche.toLowerCase());
    const correspondCat = filtreCat === "tous" || s.categorie === filtreCat;
    return correspondRecherche && correspondCat;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Planning des Excursions & Loisirs
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Safaris, circuits pirogue, quads, soins spa et imputation directe sur la note de chambre
          </p>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher une excursion, un guide, un lieu..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={filtreCat}
          onChange={(e) => setFiltreCat(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Toutes les activités</option>
          <option value="Safari & Faune">Safari & Faune</option>
          <option value="Pirogue & Mangrove">Pirogue & Mangrove</option>
          <option value="Aventure & Quads">Aventure & Quads</option>
          <option value="Spa & Bien-être">Spa & Bien-être</option>
        </select>
      </div>

      {/* Grille des Excursions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortiesFiltrees.map((sortie) => {
          const placesRestantes = sortie.jaugeMax - sortie.inscrits;

          return (
            <div
              key={sortie.id}
              className="p-5 rounded-2xl bg-surface border border-surface-border hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-surface-muted text-foreground-muted">
                    {sortie.categorie}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      placesRestantes > 0
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {placesRestantes > 0
                      ? `${placesRestantes} places restantes`
                      : "Complet"}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-foreground">
                  {sortie.nom}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs text-foreground-muted pt-2 border-t border-surface-border">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-foreground" />
                    <span>{sortie.dateSortie}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-foreground" />
                    <span>
                      {sortie.horaireDepart} ({sortie.duree})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Users className="w-3.5 h-3.5 text-foreground" />
                    <span>
                      Guide : <strong>{sortie.guideAssigne}</strong> ({sortie.vehiculeOuEmbarcation})
                    </span>
                  </div>
                </div>

                {/* Inscrits récents */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase text-foreground-muted block mb-1">
                    Chambres inscrites ({sortie.inscrits} / {sortie.jaugeMax}) :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sortie.participants.map((p, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-surface-muted border border-surface-border font-medium text-foreground"
                      >
                        {p.chambre} ({p.nb}p)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-foreground-muted block">
                    Tarif par personne :
                  </span>
                  <span className="text-base font-bold text-foreground">
                    {formatXOF(sortie.prixParPersonne)}
                  </span>
                </div>

                <button
                  onClick={() => setModalInscription(sortie)}
                  disabled={placesRestantes <= 0}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition disabled:opacity-40"
                >
                  Inscrire une Chambre
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL INSCRIPTION EXCURSION */}
      {modalInscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">
              Inscrire à : {modalInscription.nom}
            </h3>
            <p className="text-xs text-foreground-muted">
              Départ : {modalInscription.dateSortie} à {modalInscription.horaireDepart} • Guide : {modalInscription.guideAssigne}
            </p>

            <form onSubmit={handleInscrire} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Chambre du voyageur
                </label>
                <select
                  value={chambreInscrite}
                  onChange={(e) => setChambreInscrite(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                >
                  <option value="101">Chambre 101 (M. Ibrahima Diop)</option>
                  <option value="102">Chambre 102 (Mme Awa Sarr)</option>
                  <option value="201">Suite Junior 201 (M. Amadou Tidiane Ba)</option>
                  <option value="B12">Bungalow Plage 12 (Mme Sophie Martin)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Nombre de participants
                </label>
                <input
                  type="number"
                  min="1"
                  max={modalInscription.jaugeMax - modalInscription.inscrits}
                  value={nbPersonnes}
                  onChange={(e) => setNbPersonnes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/60 flex items-center justify-between text-xs">
                <span className="text-foreground-muted">Montant imputé sur le folio :</span>
                <span className="font-bold text-sm text-[var(--primary)]">
                  {formatXOF(modalInscription.prixParPersonne * nbPersonnes)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="decharge"
                  defaultChecked
                  required
                  className="rounded text-[var(--primary)]"
                />
                <label htmlFor="decharge" className="text-foreground font-medium">
                  Décharge médicale et d'assurance signée par le voyageur
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalInscription(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Confirmer & Imputer au Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
