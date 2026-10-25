"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Printer,
  Search,
  Filter,
  FileText,
  User,
  Globe,
  Calendar,
  Hotel,
  CheckCircle2,
  Download,
  Eye,
  AlertCircle,
  Building,
} from "lucide-react";

interface FichePolice {
  id: string;
  ficheNumero: string;
  nom: string;
  prenom: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  profession: string;
  domicileHabituel: string;
  typePiece: "Passeport" | "CNI";
  numeroPiece: string;
  dateDelivrance: string;
  lieuDelivrance: string;
  provenance: string;
  destination: string;
  motifSejour: "Tourisme" | "Affaires" | "Mission Officielle" | "Familial";
  chambre: string;
  dateArrivee: string;
  dateDepartPrevue: string;
  signee: boolean;
}

export default function FichesPolicePage() {
  const [recherche, setRecherche] = useState("");
  const [filtreNationalite, setFiltreNationalite] = useState("tous");
  const [ficheSelectionnee, setFicheSelectionnee] = useState<FichePolice | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [fiches, setFiches] = useState<FichePolice[]>([
    {
      id: "1",
      ficheNumero: "POL-2026-00142",
      nom: "DIOP",
      prenom: "Ibrahima",
      sexe: "M",
      dateNaissance: "14/05/1984",
      lieuNaissance: "Saint-Louis (Sénégal)",
      nationalite: "Sénégalaise",
      profession: "Ingénieur Télécoms",
      domicileHabituel: "Dakar, Mermoz",
      typePiece: "CNI",
      numeroPiece: "1 254 1984 00124",
      dateDelivrance: "10/02/2021",
      lieuDelivrance: "Dakar",
      provenance: "Dakar",
      destination: "Dakar",
      motifSejour: "Affaires",
      chambre: "Chambre 101",
      dateArrivee: "24/10/2026",
      dateDepartPrevue: "27/10/2026",
      signee: true,
    },
    {
      id: "2",
      ficheNumero: "POL-2026-00143",
      nom: "MARTIN",
      prenom: "Sophie",
      sexe: "F",
      dateNaissance: "22/11/1991",
      lieuNaissance: "Lyon (France)",
      nationalite: "Française",
      profession: "Architecte d'intérieur",
      domicileHabituel: "Paris 11e, France",
      typePiece: "Passeport",
      numeroPiece: "21AF45981",
      dateDelivrance: "15/06/2022",
      lieuDelivrance: "Préfecture de Lyon",
      provenance: "Paris CDG",
      destination: "Casamance",
      motifSejour: "Tourisme",
      chambre: "Bungalow Plage 12",
      dateArrivee: "24/10/2026",
      dateDepartPrevue: "29/10/2026",
      signee: true,
    },
    {
      id: "3",
      ficheNumero: "POL-2026-00144",
      nom: "BA",
      prenom: "Amadou Tidiane",
      sexe: "M",
      dateNaissance: "03/09/1979",
      lieuNaissance: "Matam (Sénégal)",
      nationalite: "Sénégalaise",
      profession: "Expert Comptable",
      domicileHabituel: "Thiès, Cité Malick Sy",
      typePiece: "CNI",
      numeroPiece: "1 198 1979 00987",
      dateDelivrance: "05/08/2020",
      lieuDelivrance: "Thiès",
      provenance: "Thiès",
      destination: "Dakar",
      motifSejour: "Mission Officielle",
      chambre: "Suite Junior 201",
      dateArrivee: "24/10/2026",
      dateDepartPrevue: "26/10/2026",
      signee: true,
    },
    {
      id: "4",
      ficheNumero: "POL-2026-00145",
      nom: "AL-MANSOORI",
      prenom: "Rashid",
      sexe: "M",
      dateNaissance: "18/01/1988",
      lieuNaissance: "Dubaï (Émirats Arabes Unis)",
      nationalite: "Émiratie",
      profession: "Directeur d'Investissements",
      domicileHabituel: "Dubaï, Downtown",
      typePiece: "Passeport",
      numeroPiece: "AE890214",
      dateDelivrance: "12/04/2023",
      lieuDelivrance: "Dubaï",
      provenance: "Dubaï DXB",
      destination: "Abidjan",
      motifSejour: "Affaires",
      chambre: "Suite Exécutive 202",
      dateArrivee: "23/10/2026",
      dateDepartPrevue: "28/10/2026",
      signee: true,
    },
  ]);

  const fichesFiltrees = fiches.filter((f) => {
    const correspondRecherche =
      f.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      f.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      f.numeroPiece.toLowerCase().includes(recherche.toLowerCase()) ||
      f.chambre.toLowerCase().includes(recherche.toLowerCase()) ||
      f.ficheNumero.toLowerCase().includes(recherche.toLowerCase());
    const correspondNat =
      filtreNationalite === "tous" ||
      (filtreNationalite === "senegal"
        ? f.nationalite === "Sénégalaise"
        : f.nationalite !== "Sénégalaise");
    return correspondRecherche && correspondNat;
  });

  const handleImprimerFiche = () => {
    window.print();
  };

  const handleExportRegistre = () => {
    setSuccesMsg(
      "Génération du registre journalier officiel (Format PDF Ministère du Tourisme)... Téléchargement lancé."
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Fiches de Police & Registre des Voyageurs
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Conformité réglementaire officielle (Police de l'Air et des Frontières & Ministère du Tourisme)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportRegistre}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-surface border border-surface-border hover:bg-surface-muted transition shadow-sm"
          >
            <Download className="w-4 h-4 text-foreground-muted" />
            Exporter Registre Journalier
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouche d'information légale */}
      <div className="p-4 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary)]/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-foreground">
            Obligation légale de tenue du registre des logeurs (Loi n° 2017-08)
          </p>
          <p className="text-foreground-muted">
            Tout voyageur séjournant dans l'établissement doit obligatoirement remplir et signer une fiche individuelle de police dès son arrivée. Le registre journalier doit être conservé pendant 3 ans à disposition des forces de sécurité.
          </p>
        </div>
      </div>

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom, passeport/CNI, chambre, réf fiche..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>

        <select
          value={filtreNationalite}
          onChange={(e) => setFiltreNationalite(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none"
        >
          <option value="tous">Toutes les nationalités</option>
          <option value="senegal">Nationaux (Sénégal)</option>
          <option value="etrangers">Ressortissants Étrangers</option>
        </select>
      </div>

      {/* Tableau des fiches */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Réf. Fiche</th>
                <th className="px-4 py-3">Voyageur</th>
                <th className="px-4 py-3">Nationalité</th>
                <th className="px-4 py-3">Pièce d'Identité</th>
                <th className="px-4 py-3">Chambre</th>
                <th className="px-4 py-3">Dates Séjour</th>
                <th className="px-4 py-3">Motif</th>
                <th className="px-4 py-3 text-center">Fiche A4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {fichesFiltrees.map((f) => (
                <tr key={f.id} className="hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--accent)]">
                    {f.ficheNumero}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold block text-foreground">
                      {f.nom} {f.prenom}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      Né(e) le {f.dateNaissance} à {f.lieuNaissance}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-muted">
                      <Globe className="w-3 h-3 text-foreground-muted" />
                      {f.nationalite}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground block">
                      {f.typePiece} : {f.numeroPiece}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      Délivré à {f.lieuDelivrance}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">
                    {f.chambre}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    <span>Du {f.dateArrivee}</span>
                    <br />
                    <span>Au {f.dateDepartPrevue}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-muted">
                      {f.motifSejour}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setFicheSelectionnee(f)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] hover:opacity-90 inline-flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Visualiser
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FICHE INDIVIDUELLE DE POLICE (FORMAT IMPRESSION OFFICIEL) */}
      {ficheSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-2xl w-full p-6 space-y-6 my-8 animate-scale-up">
            {/* Entête officielle */}
            <div className="border-b border-surface-border pb-4 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-foreground-muted">
                  RÉPUBLIQUE DU SÉNÉGAL
                </p>
                <p className="text-[11px] text-foreground-muted">
                  Ministère de l'Intérieur • Direction de la Police de l'Air et des Frontières
                </p>
                <h3 className="text-lg font-bold text-foreground mt-2">
                  FICHE INDIVIDUELLE DE POLICE
                </h3>
                <p className="text-xs font-mono text-[var(--accent)]">
                  N° {ficheSelectionnee.ficheNumero}
                </p>
              </div>

              <div className="text-right text-xs text-foreground-muted">
                <p className="font-bold text-foreground">HÔTEL TERANGA PALACE</p>
                <p>Almadies, Dakar • Sénégal</p>
                <p>NINEA: 009845213 2V9</p>
              </div>
            </div>

            {/* Corps de la fiche */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Nom de famille :</span>
                <span className="font-bold text-sm text-foreground">
                  {ficheSelectionnee.nom}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Prénom(s) :</span>
                <span className="font-bold text-sm text-foreground">
                  {ficheSelectionnee.prenom}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Date et lieu de naissance :</span>
                <span className="font-semibold text-foreground">
                  {ficheSelectionnee.dateNaissance} à {ficheSelectionnee.lieuNaissance}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Nationalité :</span>
                <span className="font-semibold text-foreground">
                  {ficheSelectionnee.nationalite}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Profession :</span>
                <span className="font-semibold text-foreground">
                  {ficheSelectionnee.profession}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Domicile habituel :</span>
                <span className="font-semibold text-foreground">
                  {ficheSelectionnee.domicileHabituel}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Titre d'identité présenté :</span>
                <span className="font-bold text-foreground">
                  {ficheSelectionnee.typePiece} N° {ficheSelectionnee.numeroPiece}
                </span>
                <span className="text-[10px] text-foreground-muted block mt-0.5">
                  Délivré le {ficheSelectionnee.dateDelivrance} par {ficheSelectionnee.lieuDelivrance}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Chambre attribuée :</span>
                <span className="font-bold text-sm text-[var(--accent)]">
                  {ficheSelectionnee.chambre}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Provenance :</span>
                <span className="font-semibold text-foreground">
                  {ficheSelectionnee.provenance}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-muted/50 border border-surface-border">
                <span className="text-foreground-muted block">Destination finale :</span>
                <span className="font-semibold text-foreground">
                  {ficheSelectionnee.destination}
                </span>
              </div>
            </div>

            {/* Signature & Validation */}
            <div className="border-t border-surface-border pt-4 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Date d'arrivée : {ficheSelectionnee.dateArrivee}
                </p>
                <p className="text-foreground-muted">
                  Signature électronique certifiée par le voyageur
                </p>
                <div className="h-10 w-32 border border-dashed border-surface-border rounded flex items-center justify-center font-mono text-[11px] text-emerald-600">
                  ✓ SIGNÉ EN DIRECT
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="font-semibold text-foreground">Pour l'établissement</p>
                <p className="text-foreground-muted">Cachet & Signature Réception</p>
                <div className="h-10 w-32 border border-dashed border-surface-border rounded flex items-center justify-center font-mono text-[10px] text-foreground-muted">
                  [Cachet Teranga]
                </div>
              </div>
            </div>

            {/* Actions du modal */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
              <button
                onClick={() => setFicheSelectionnee(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
              >
                Fermer
              </button>
              <button
                onClick={handleImprimerFiche}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer la Fiche A4
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
