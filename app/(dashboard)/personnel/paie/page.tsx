"use client";

import { useState } from "react";
import {
  FileText,
  Calculator,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  DollarSign,
  ChevronRight,
  Eye,
  AlertCircle,
  Building,
  CreditCard,
  Printer,
  Sparkles,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import {
  MOIS_FR,
  genererCalculBulletin,
  type CollaborateurRh,
  type BulletinPaieCalcule,
} from "@/lib/rh";
import { genererBulletinPaiePdf } from "@/lib/pdf/bulletin-paie-pdf";

export default function PaiePage() {
  const [anneeSelectionnee, setAnneeSelectionnee] = useState(2026);
  const [moisSelectionne, setMoisSelectionne] = useState(2); // Février
  const [recherche, setRecherche] = useState("");
  const [bulletinActif, setBulletinActif] = useState<BulletinPaieCalcule | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [telechargementEnCours, setTelechargementEnCours] = useState<string | null>(null);

  // Collaborateurs de l'hôtel pour le calcul de paie
  const collaborateursHotel: CollaborateurRh[] = [
    {
      id: "1",
      matricule: "SAL-001",
      nom: "Ndiaye",
      prenom: "Fatou Bintou",
      statut: "permanent",
      typeContrat: "cdi",
      poste: "Chef de Réception",
      departement: "Réception & Front-Desk",
      dateEmbauche: "2022-03-01",
      telephone: "+221 77 450 11 22",
      situationFamiliale: "marie",
      nombreEnfants: 2,
      nombreConjoints: 1,
      partsIr: 2.5,
      regimeIpres: "general",
      numeroIpres: "IPRES-445892-A",
      numeroCss: "CSS-881290-01",
      categorieConventionnelle: "Catégorie 7 - Agent de maîtrise confirmé",
      salaireBase: 225000,
      sursalaire: 55000,
      primesMensuelles: 30000,
      indemniteTransport: 26000,
      modePaiement: "virement",
      coordonneesBancaires: "CBAO SN012 01001 02345678901 45",
    },
    {
      id: "2",
      matricule: "SAL-002",
      nom: "Diouf",
      prenom: "Cheikh Tidiane",
      statut: "permanent",
      typeContrat: "cdi",
      poste: "Chef Exécutif Cuisine",
      departement: "Cuisine & Pâtisserie",
      dateEmbauche: "2021-08-15",
      telephone: "+221 76 800 55 66",
      situationFamiliale: "marie",
      nombreEnfants: 3,
      nombreConjoints: 1,
      partsIr: 3.0,
      regimeIpres: "cadre",
      numeroIpres: "IPRES-112349-C",
      numeroCss: "CSS-881290-02",
      categorieConventionnelle: "Catégorie 9 - Cadre supérieur",
      salaireBase: 450000,
      sursalaire: 180000,
      primesMensuelles: 70000,
      indemniteTransport: 26000,
      modePaiement: "virement",
      coordonneesBancaires: "SGBS SN011 01002 09876543210 12",
    },
    {
      id: "3",
      matricule: "SAL-003",
      nom: "Sow",
      prenom: "Amadou",
      statut: "permanent",
      typeContrat: "cdi",
      poste: "Maître d'Hôtel",
      departement: "Restaurant, Bar & Room Service",
      dateEmbauche: "2023-01-10",
      telephone: "+221 78 120 33 44",
      situationFamiliale: "celibataire",
      nombreEnfants: 0,
      nombreConjoints: 0,
      partsIr: 1.0,
      regimeIpres: "general",
      numeroIpres: "IPRES-778901-B",
      numeroCss: "CSS-881290-03",
      categorieConventionnelle: "Catégorie 7 - Agent de maîtrise confirmé",
      salaireBase: 225000,
      sursalaire: 25000,
      primesMensuelles: 20000,
      indemniteTransport: 26000,
      modePaiement: "wave",
      coordonneesBancaires: "+221 78 120 33 44 (Wave Personnel)",
    },
    {
      id: "4",
      matricule: "SAL-004",
      nom: "Sy",
      prenom: "Aïssatou",
      statut: "permanent",
      typeContrat: "cdi",
      poste: "Gouvernante Générale",
      departement: "Hébergement & Étages (Housekeeping)",
      dateEmbauche: "2022-06-01",
      telephone: "+221 77 900 77 88",
      situationFamiliale: "divorce",
      nombreEnfants: 2,
      nombreConjoints: 0,
      partsIr: 2.0,
      regimeIpres: "cadre",
      numeroIpres: "IPRES-556780-K",
      numeroCss: "CSS-881290-04",
      categorieConventionnelle: "Catégorie 8 - Cadre intermédiaire",
      salaireBase: 310000,
      sursalaire: 60000,
      primesMensuelles: 40000,
      indemniteTransport: 26000,
      modePaiement: "virement",
      coordonneesBancaires: "BICIS SN020 01003 04567891234 88",
    },
    {
      id: "5",
      matricule: "SAIS-005",
      nom: "Diallo",
      prenom: "Mariama",
      statut: "saisonnier",
      typeContrat: "saisonnier",
      poste: "Femme de chambre (Haute Saison)",
      departement: "Hébergement & Étages (Housekeeping)",
      dateEmbauche: "2025-11-01",
      telephone: "+221 77 654 32 10",
      situationFamiliale: "celibataire",
      nombreEnfants: 1,
      nombreConjoints: 0,
      partsIr: 1.5,
      regimeIpres: "general",
      numeroIpres: "IPRES-998811-M",
      numeroCss: "CSS-881290-05",
      categorieConventionnelle: "Catégorie 3 - Employé d'étage / Commis",
      salaireBase: 87500,
      sursalaire: 15000,
      primesMensuelles: 10000,
      indemniteTransport: 26000,
      modePaiement: "wave",
      coordonneesBancaires: "+221 77 654 32 10 (Wave)",
    },
    {
      id: "6",
      matricule: "EXT-006",
      nom: "Fall",
      prenom: "Ousseynou",
      statut: "journalier",
      typeContrat: "journalier",
      poste: "Extra Barman Banquets",
      departement: "Restaurant, Bar & Room Service",
      dateEmbauche: "2026-01-05",
      telephone: "+221 70 555 12 34",
      situationFamiliale: "celibataire",
      nombreEnfants: 0,
      nombreConjoints: 0,
      partsIr: 1.0,
      regimeIpres: "general",
      categorieConventionnelle: "Catégorie 5 - Réceptionniste confirmé / Barman / Chef de partie",
      salaireBase: 135000,
      sursalaire: 0,
      primesMensuelles: 0,
      indemniteTransport: 26000,
      modePaiement: "especes",
    },
    {
      id: "7",
      matricule: "PREST-007",
      nom: "Dakar Froid & Clim Services",
      prenom: "Société",
      statut: "prestataire",
      typeContrat: "prestation",
      poste: "Contrat Entretien Froid & Chauffage Central",
      departement: "Maintenance, Froid & Technique",
      dateEmbauche: "2024-01-01",
      telephone: "+221 33 824 55 99",
      situationFamiliale: "celibataire",
      nombreEnfants: 0,
      nombreConjoints: 0,
      partsIr: 1.0,
      regimeIpres: "exempte",
      categorieConventionnelle: "Prestataire Extérieur (BNC)",
      salaireBase: 350000,
      sursalaire: 0,
      primesMensuelles: 0,
      indemniteTransport: 0,
      modePaiement: "virement",
      coordonneesBancaires: "ECOBANK SN034 01004 01239874561 23",
    },
  ];

  // Calcul automatique de tous les bulletins de la période
  const [bulletins, setBulletins] = useState<BulletinPaieCalcule[]>(() =>
    collaborateursHotel.map((collab) => {
      // Heures supp et acomptes simulés pour réalisme hôtelier
      const hs = collab.matricule === "SAL-003" ? 6 : collab.matricule === "SAL-002" ? 8 : 0;
      const absences = collab.matricule === "SAL-010" ? 1 : 0;
      return genererCalculBulletin(collab, 2, 2026, hs, absences, 0);
    })
  );

  const bulletinsFiltres = bulletins.filter(
    (b) =>
      b.nomComplet.toLowerCase().includes(recherche.toLowerCase()) ||
      b.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
      b.poste.toLowerCase().includes(recherche.toLowerCase()) ||
      b.departement.toLowerCase().includes(recherche.toLowerCase())
  );

  // Totaux globaux de la période de paie
  const totalMasseBrute = bulletins.reduce((acc, b) => acc + b.salaireBrutTotal, 0);
  const totalRetenues = bulletins.reduce((acc, b) => acc + b.totalRetenuesSalariales, 0);
  const totalNetAPayer = bulletins.reduce((acc, b) => acc + b.netAPayer, 0);
  const totalChargesPatronales = bulletins.reduce((acc, b) => acc + b.totalChargesPatronales, 0);
  const totalCoutEmployeur = bulletins.reduce((acc, b) => acc + b.coutTotalEmployeur, 0);

  function recalculerPeriode() {
    const recalcules = collaborateursHotel.map((collab) => {
      const hs = collab.matricule === "SAL-003" ? 6 : collab.matricule === "SAL-002" ? 8 : 0;
      return genererCalculBulletin(collab, moisSelectionne, anneeSelectionnee, hs, 0, 0);
    });
    setBulletins(recalcules);
    setNotification(
      `Période ${MOIS_FR[moisSelectionne - 1]} ${anneeSelectionnee} recalculée avec succès (${recalcules.length} bulletins générés).`
    );
    setTimeout(() => setNotification(null), 5000);
  }

  async function telechargerPdf(bulletin: BulletinPaieCalcule) {
    try {
      setTelechargementEnCours(bulletin.matricule);
      genererBulletinPaiePdf(bulletin);
      setNotification(`Bulletin officiel de ${bulletin.nomComplet} (${bulletin.matricule}) téléchargé en PDF.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setTelechargementEnCours(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Bulletins & Paie</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Sénégal (OHADA / UEMOA)
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Calcul automatisé des salaires, déductions IPRES/CSS/IR/TRIMF et édition des bulletins de paie A4 en haute définition.
          </p>
        </div>

        {/* Sélecteurs de Période & Bouton Recalculer */}
        <div className="flex items-center gap-2">
          <select
            value={moisSelectionne}
            onChange={(e) => setMoisSelectionne(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20"
          >
            {MOIS_FR.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={anneeSelectionnee}
            onChange={(e) => setAnneeSelectionnee(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/20"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
          <button
            onClick={recalculerPeriode}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            <Calculator className="h-4 w-4" />
            Calculer la paie
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cartes KPI Financières de la Période */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Masse Brute</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xl font-bold text-foreground mt-2">{formatXOF(totalMasseBrute)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Salaires de base + primes + HS</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Retenues Salariales</span>
            <FileText className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-xl font-bold text-rose-600 mt-2">{formatXOF(totalRetenues)}</p>
          <p className="text-[11px] text-rose-500 mt-1">IPRES (5.6%) + IR + TRIMF</p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">NET À PAYER GLOBAL</span>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{formatXOF(totalNetAPayer)}</p>
          <p className="text-[11px] text-emerald-700 mt-1">À virer / verser aux collaborateurs</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Charges Patronales</span>
            <Building className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-foreground mt-2">{formatXOF(totalChargesPatronales)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">IPRES (8.4%) + CSS + CFCE (3%)</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Coût Global Hôtel</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-foreground mt-2">{formatXOF(totalCoutEmployeur)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Brut + Charges patronales</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom de salarié, matricule ou poste..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Tableau des bulletins */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3">Matricule & Salarié</th>
                <th className="px-4 py-3">Département & Statut</th>
                <th className="px-4 py-3 text-right">Salaire Brut</th>
                <th className="px-4 py-3 text-right">Retenues Salariales</th>
                <th className="px-4 py-3 text-right">NET À PAYER</th>
                <th className="px-4 py-3 text-right">Coût Employeur</th>
                <th className="px-4 py-3 text-center">Édition Bulletin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bulletinsFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun bulletin trouvé pour cette période.
                  </td>
                </tr>
              ) : (
                bulletinsFiltres.map((b) => (
                  <tr key={b.collaborateurId} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{b.nomComplet}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span className="font-mono text-primary font-medium">{b.matricule}</span>
                        <span>• {b.poste}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground text-xs">{b.departement}</div>
                      <span className="text-[11px] text-muted-foreground">{b.statut}</span>
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {formatXOF(b.salaireBrutTotal)}
                    </td>

                    <td className="px-4 py-3 text-right text-rose-600 font-medium">
                      -{formatXOF(b.totalRetenuesSalariales)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-emerald-600 text-sm bg-emerald-500/10 px-2 py-0.5 rounded">
                        {formatXOF(b.netAPayer)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {formatXOF(b.coutTotalEmployeur)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setBulletinActif(b)}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition"
                          title="Voir le détail du calcul"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Détail
                        </button>
                        <button
                          onClick={() => telechargerPdf(b)}
                          disabled={telechargementEnCours === b.matricule}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
                          title="Télécharger le PDF A4 officiel"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF A4
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail du Bulletin de Paie */}
      {bulletinActif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Haut Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Bulletin de Paie — {bulletinActif.nomComplet}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Matricule : {bulletinActif.matricule} • Période : {bulletinActif.periodeTexte}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => telechargerPdf(bulletinActif)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Télécharger PDF
                </button>
                <button
                  onClick={() => setBulletinActif(null)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Corps du Bulletin avec les 4 Sections */}
            <div className="space-y-4 mt-4">
              {/* Synthèse générale */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/30 p-2 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Département</span>
                  <strong className="text-foreground">{bulletinActif.departement}</strong>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Convention</span>
                  <strong className="text-foreground">{bulletinActif.categorie}</strong>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Jours / Heures</span>
                  <strong className="text-foreground">
                    {bulletinActif.joursTravailles} j • {bulletinActif.heuresNormales} h
                  </strong>
                </div>
                <div className="rounded-lg bg-muted/30 p-2 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Heures Supp.</span>
                  <strong className="text-foreground">{bulletinActif.heuresSupp} h</strong>
                </div>
              </div>

              {/* Tableau des lignes détaillées */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/70 text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-3 py-2">Rubrique / Libellé</th>
                      <th className="px-3 py-2 text-right">Base</th>
                      <th className="px-3 py-2 text-center">Taux</th>
                      <th className="px-3 py-2 text-right">Part Salariale</th>
                      <th className="px-3 py-2 text-right">Part Patronale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bulletinActif.lignes.map((l, index) => (
                      <tr
                        key={index}
                        className={
                          l.type === "gain"
                            ? "hover:bg-emerald-500/5"
                            : l.type === "retenue_salariale"
                            ? "hover:bg-rose-500/5"
                            : "hover:bg-blue-500/5"
                        }
                      >
                        <td className="px-3 py-2 font-medium text-foreground">{l.libelle}</td>
                        <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                          {l.base > 0 ? formatXOF(l.base) : "—"}
                        </td>
                        <td className="px-3 py-2 text-center text-muted-foreground">
                          {l.taux != null ? `${l.taux}%` : "—"}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-mono font-medium ${
                            l.type === "gain"
                              ? "text-emerald-600"
                              : l.montantSalarial > 0
                              ? "text-rose-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {l.montantSalarial !== 0 ? formatXOF(l.montantSalarial) : "—"}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                          {l.montantPatronal != null && l.montantPatronal > 0
                            ? formatXOF(l.montantPatronal)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux & Net à Payer */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex gap-4">
                    <span>
                      Brut Total : <strong>{formatXOF(bulletinActif.salaireBrutTotal)}</strong>
                    </span>
                    <span>
                      Retenues : <strong className="text-rose-600">-{formatXOF(bulletinActif.totalRetenuesSalariales)}</strong>
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Coût global employeur : <strong>{formatXOF(bulletinActif.coutTotalEmployeur)}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-muted-foreground block">
                    NET À PAYER SALARIÉ
                  </span>
                  <span className="text-2xl font-black text-primary">
                    {formatXOF(bulletinActif.netAPayer)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bas Modal */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setBulletinActif(null)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
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
