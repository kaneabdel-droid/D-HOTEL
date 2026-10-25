"use client";

import { useState } from "react";
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  AlertTriangle,
  BadgeAlert,
  ChevronRight,
  ShieldCheck,
  Building,
  Users,
  Briefcase,
  X,
  ExternalLink,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { GRILLE_HOTEL_CONVENTION, TYPES_CONTRAT } from "@/lib/rh";

interface ContratTravail {
  id: string;
  salarieNom: string;
  matricule: string;
  poste: string;
  departement: string;
  typeContrat: "cdi" | "cdd" | "saisonnier" | "journalier" | "prestation" | "stage";
  numeroContrat: string;
  dateDebut: string;
  dateFin?: string;
  periodeEssaiMois: number;
  salaireBase: number;
  sursalaire: number;
  primes: number;
  statut: "actif" | "en_cours_essai" | "a_renouveler" | "termine";
  categorieConventionnelle: string;
}

export default function ContratsConventionsPage() {
  const [ongletActif, setOngletActif] = useState<"contrats" | "convention">("contrats");
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [contrats, setContrats] = useState<ContratTravail[]>([
    {
      id: "CTR-001",
      salarieNom: "Fatou Bintou Ndiaye",
      matricule: "SAL-001",
      poste: "Chef de Réception",
      departement: "Réception & Front-Desk",
      typeContrat: "cdi",
      numeroContrat: "CTR-2022-CDI-001",
      dateDebut: "2022-03-01",
      periodeEssaiMois: 3,
      salaireBase: 225000,
      sursalaire: 55000,
      primes: 30000,
      statut: "actif",
      categorieConventionnelle: "Catégorie 7 - Agent de maîtrise confirmé",
    },
    {
      id: "CTR-002",
      salarieNom: "Cheikh Tidiane Diouf",
      matricule: "SAL-002",
      poste: "Chef Exécutif Cuisine",
      departement: "Cuisine & Pâtisserie",
      typeContrat: "cdi",
      numeroContrat: "CTR-2021-CDI-014",
      dateDebut: "2021-08-15",
      periodeEssaiMois: 3,
      salaireBase: 450000,
      sursalaire: 180000,
      primes: 70000,
      statut: "actif",
      categorieConventionnelle: "Catégorie 9 - Cadre supérieur",
    },
    {
      id: "CTR-003",
      salarieNom: "Mariama Diallo",
      matricule: "SAIS-005",
      poste: "Femme de chambre (Haute Saison)",
      departement: "Hébergement & Étages (Housekeeping)",
      typeContrat: "saisonnier",
      numeroContrat: "CTR-2025-SAIS-088",
      dateDebut: "2025-11-01",
      dateFin: "2026-04-30",
      periodeEssaiMois: 1,
      salaireBase: 87500,
      sursalaire: 15000,
      primes: 10000,
      statut: "a_renouveler",
      categorieConventionnelle: "Catégorie 3 - Employé d'étage / Commis",
    },
    {
      id: "CTR-004",
      salarieNom: "Ibrahima Ba",
      matricule: "SAL-009",
      poste: "Réceptionniste de Nuit",
      departement: "Réception & Front-Desk",
      typeContrat: "cdd",
      numeroContrat: "CTR-2025-CDD-032",
      dateDebut: "2025-09-01",
      dateFin: "2026-02-28",
      periodeEssaiMois: 2,
      salaireBase: 135000,
      sursalaire: 20000,
      primes: 15000,
      statut: "a_renouveler",
      categorieConventionnelle: "Catégorie 5 - Réceptionniste confirmé / Barman / Chef de partie",
    },
    {
      id: "CTR-005",
      salarieNom: "Ousseynou Fall",
      matricule: "EXT-006",
      poste: "Extra Barman Banquets",
      departement: "Restaurant, Bar & Room Service",
      typeContrat: "journalier",
      numeroContrat: "CTR-2026-EXT-003",
      dateDebut: "2026-01-01",
      dateFin: "2026-06-30",
      periodeEssaiMois: 0,
      salaireBase: 135000,
      sursalaire: 0,
      primes: 0,
      statut: "actif",
      categorieConventionnelle: "Catégorie 5 - Réceptionniste confirmé / Barman / Chef de partie",
    },
    {
      id: "CTR-006",
      salarieNom: "Dakar Froid & Clim Services",
      matricule: "PREST-007",
      poste: "Maintenance Centrale Froid",
      departement: "Maintenance, Froid & Technique",
      typeContrat: "prestation",
      numeroContrat: "CONV-2024-BNC-005",
      dateDebut: "2024-01-01",
      dateFin: "2026-12-31",
      periodeEssaiMois: 0,
      salaireBase: 350000,
      sursalaire: 0,
      primes: 0,
      statut: "actif",
      categorieConventionnelle: "Prestataire Extérieur (BNC)",
    },
  ]);

  // Formulaire nouveau contrat
  const [formSalarieNom, setFormSalarieNom] = useState("");
  const [formMatricule, setFormMatricule] = useState("");
  const [formType, setFormType] = useState<"cdi" | "cdd" | "saisonnier" | "journalier" | "prestation" | "stage">("cdd");
  const [formPoste, setFormPoste] = useState("");
  const [formDept, setFormDept] = useState("Réception & Front-Desk");
  const [formDateDebut, setFormDateDebut] = useState(new Date().toISOString().slice(0, 10));
  const [formDateFin, setFormDateFin] = useState("");
  const [formEssai, setFormEssai] = useState(2);
  const [formCat, setFormCat] = useState(GRILLE_HOTEL_CONVENTION[4].intitule);
  const [formBase, setFormBase] = useState(GRILLE_HOTEL_CONVENTION[4].salaireBaseMinimal);
  const [formSursalaire, setFormSursalaire] = useState(0);
  const [formPrimes, setFormPrimes] = useState(0);

  const contratsFiltres = contrats.filter((c) => {
    const matchRecherche =
      c.salarieNom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
      c.poste.toLowerCase().includes(recherche.toLowerCase()) ||
      c.numeroContrat.toLowerCase().includes(recherche.toLowerCase());
    const matchType = filtreType === "tous" || c.typeContrat === filtreType;
    return matchRecherche && matchType;
  });

  const totalActifs = contrats.filter((c) => c.statut === "actif").length;
  const totalCdi = contrats.filter((c) => c.typeContrat === "cdi").length;
  const totalCddOuSaisonnier = contrats.filter((c) => c.typeContrat === "cdd" || c.typeContrat === "saisonnier").length;
  const alertesEcheance = contrats.filter((c) => c.statut === "a_renouveler").length;

  function handleCreerContrat(e: React.FormEvent) {
    e.preventDefault();
    if (!formSalarieNom || !formMatricule) return;

    const nouveau: ContratTravail = {
      id: `CTR-${Date.now()}`,
      salarieNom: formSalarieNom.trim(),
      matricule: formMatricule.toUpperCase().trim(),
      poste: formPoste || "Collaborateur",
      departement: formDept,
      typeContrat: formType,
      numeroContrat: `CTR-${new Date().getFullYear()}-${formType.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      dateDebut: formDateDebut,
      dateFin: formType === "cdi" ? undefined : formDateFin || undefined,
      periodeEssaiMois: Number(formEssai),
      salaireBase: Number(formBase),
      sursalaire: Number(formSursalaire),
      primes: Number(formPrimes),
      statut: "actif",
      categorieConventionnelle: formCat,
    };

    setContrats([nouveau, ...contrats]);
    setModalOuvert(false);
    setNotification(`Le contrat ${nouveau.numeroContrat} pour ${nouveau.salarieNom} a été enregistré.`);
    setTimeout(() => setNotification(null), 5000);
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Contrats & Conventions</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Convention Hôtelière
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Gestion des contrats de travail (CDI, CDD, Saisonnier, Extra, Forfait BNC) et grille conventionnelle officielle du Sénégal.
          </p>
        </div>
        <button
          onClick={() => setModalOuvert(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Rédiger un contrat
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Contrats Actifs</span>
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalActifs}</p>
          <p className="text-xs text-muted-foreground mt-1">Personnel en poste</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">CDI Titulaires</span>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalCdi}</p>
          <p className="text-xs text-emerald-600 mt-1">Permanents de l'hôtel</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">CDD & Saisonniers</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalCddOuSaisonnier}</p>
          <p className="text-xs text-blue-600 mt-1">Haute saison & extras</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Alertes Échéance</span>
            <BadgeAlert className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{alertesEcheance}</p>
          <p className="text-xs text-rose-500 mt-1">À renouveler sous 30 jours</p>
        </div>
      </div>

      {/* Onglets navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setOngletActif("contrats")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
            ongletActif === "contrats"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Contrats en cours ({contrats.length})
        </button>
        <button
          onClick={() => setOngletActif("convention")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition ${
            ongletActif === "convention"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Building className="h-4 w-4" />
          Grille Conventionnelle Hôtellerie Sénégal ({GRILLE_HOTEL_CONVENTION.length} catégories)
        </button>
      </div>

      {ongletActif === "contrats" ? (
        <div className="space-y-4">
          {/* Recherche & Filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par numéro de contrat, collaborateur, matricule ou poste..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="tous">Tous les types de contrat</option>
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="saisonnier">Saisonnier</option>
                <option value="journalier">Journalier / Extra</option>
                <option value="prestation">Prestation BNC</option>
              </select>
            </div>
          </div>

          {/* Table des contrats */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-3">Réf. Contrat & Collaborateur</th>
                    <th className="px-4 py-3">Type & Convention</th>
                    <th className="px-4 py-3">Dates d'Effet & Échéance</th>
                    <th className="px-4 py-3">Période d'Essai</th>
                    <th className="px-4 py-3">Rémunération Conventionnelle</th>
                    <th className="px-4 py-3">Statut Contrat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contratsFiltres.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Aucun contrat ne correspond à votre recherche.
                      </td>
                    </tr>
                  ) : (
                    contratsFiltres.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{c.salarieNom}</div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono text-primary font-medium">{c.numeroContrat}</span>
                            <span>• {c.poste}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${
                              c.typeContrat === "cdi"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : c.typeContrat === "cdd"
                                ? "bg-blue-500/10 text-blue-600"
                                : c.typeContrat === "saisonnier"
                                ? "bg-purple-500/10 text-purple-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {c.typeContrat}
                          </span>
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[200px]">
                            {c.categorieConventionnelle}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <div className="text-foreground">
                            <strong>Début :</strong> {c.dateDebut}
                          </div>
                          <div className="text-muted-foreground mt-0.5">
                            {c.dateFin ? (
                              <span className="text-rose-600 font-medium">Fin : {c.dateFin}</span>
                            ) : (
                              <span className="text-emerald-600">Durée indéterminée</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {c.periodeEssaiMois > 0 ? (
                            <span>{c.periodeEssaiMois} mois (validée)</span>
                          ) : (
                            <span>Sans période d'essai</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">
                            {formatXOF(c.salaireBase + c.sursalaire + c.primes)}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Base: {formatXOF(c.salaireBase)}
                            {c.sursalaire > 0 && ` • Sur: ${formatXOF(c.sursalaire)}`}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              c.statut === "actif"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : c.statut === "a_renouveler"
                                ? "bg-rose-500/10 text-rose-600 font-bold animate-pulse"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {c.statut === "actif" && <CheckCircle2 className="h-3 w-3" />}
                            {c.statut === "a_renouveler" && <AlertTriangle className="h-3 w-3" />}
                            {c.statut === "actif" ? "En cours d'exécution" : "Fin imminente (Renouvellement requis)"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Grille Conventionnelle Hôtellerie Sénégal */
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Convention Collective Nationale des Entreprises Hôtelières et Touristiques du Sénégal
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Barème légal des salaires de base minimaux obligatoires selon le Décret et l'accord de branche de l'hôtellerie sénégalaise (base 173.33 heures mensuelles).
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3">Code & Catégorie</th>
                  <th className="px-4 py-3">Salaire de Base Min. Mensuel</th>
                  <th className="px-4 py-3">Taux Horaire Minimal</th>
                  <th className="px-4 py-3">Métiers & Postes Types dans l'Hôtel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {GRILLE_HOTEL_CONVENTION.map((g) => (
                  <tr key={g.code} className="hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-foreground font-mono">{g.code}</div>
                      <div className="text-xs text-muted-foreground">{g.intitule}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-emerald-600">{formatXOF(g.salaireBaseMinimal)}</div>
                      <span className="text-[10px] text-muted-foreground">Plancher légal</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {formatXOF(g.tauxHoraireMinimal)} / h
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {g.exemplesPostes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Créer Contrat */}
      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Rédiger un Nouveau Contrat de Travail</h2>
                <p className="text-xs text-muted-foreground">
                  Création d'un contrat conforme à la convention collective nationale de l'hôtellerie.
                </p>
              </div>
              <button
                onClick={() => setModalOuvert(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreerContrat} className="space-y-4 mt-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Collaborateur / Salarié *</label>
                  <input
                    type="text"
                    required
                    value={formSalarieNom}
                    onChange={(e) => setFormSalarieNom(e.target.value)}
                    placeholder="Nom et prénom complet"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Matricule Salarié *</label>
                  <input
                    type="text"
                    required
                    value={formMatricule}
                    onChange={(e) => setFormMatricule(e.target.value)}
                    placeholder="Ex: SAL-010"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Type de Contrat *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    {TYPES_CONTRAT.map((tc) => (
                      <option key={tc.value} value={tc.value}>
                        {tc.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Poste Contractuel *</label>
                  <input
                    type="text"
                    required
                    value={formPoste}
                    onChange={(e) => setFormPoste(e.target.value)}
                    placeholder="Ex: Serveur de restaurant"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Période d'Essai (Mois)</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={formEssai}
                    onChange={(e) => setFormEssai(Number(e.target.value))}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Date de Début d'Effet *</label>
                  <input
                    type="date"
                    required
                    value={formDateDebut}
                    onChange={(e) => setFormDateDebut(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Date de Fin {formType === "cdi" ? "(Non applicable en CDI)" : "*"}
                  </label>
                  <input
                    type="date"
                    disabled={formType === "cdi"}
                    value={formDateFin}
                    onChange={(e) => setFormDateFin(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
                <label className="text-xs font-semibold text-foreground">Catégorie Convention Collective Hôtelière</label>
                <select
                  value={formCat}
                  onChange={(e) => {
                    setFormCat(e.target.value);
                    const cat = GRILLE_HOTEL_CONVENTION.find((g) => g.intitule === e.target.value);
                    if (cat) setFormBase(cat.salaireBaseMinimal);
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {GRILLE_HOTEL_CONVENTION.map((g) => (
                    <option key={g.code} value={g.intitule}>
                      {g.intitule} (Min: {formatXOF(g.salaireBaseMinimal)})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Salaire de Base (FCFA) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formBase}
                      onChange={(e) => setFormBase(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Sursalaire Négocié (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={formSursalaire}
                      onChange={(e) => setFormSursalaire(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Primes Mensuelles (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={formPrimes}
                      onChange={(e) => setFormPrimes(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOuvert(false)}
                  className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
                >
                  Valider et signer le contrat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
