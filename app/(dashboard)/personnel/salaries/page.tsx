"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  FileText,
  BadgePercent,
  CreditCard,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import {
  DEPARTEMENTS_HOTEL,
  GRILLE_HOTEL_CONVENTION,
  REGIMES_IPRES,
  SITUATIONS_FAMILLE,
  STATUTS_COLLABORATEUR,
  TYPES_CONTRAT,
  calculerPartsFiscales,
  type CollaborateurRh,
  type DepartementHotel,
} from "@/lib/rh";

export default function SalariesPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreDept, setFiltreDept] = useState("tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [collabSelectionne, setCollabSelectionne] = useState<CollaborateurRh | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Liste initiale des collaborateurs de l'hôtel
  const [collaborateurs, setCollaborateurs] = useState<CollaborateurRh[]>([
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
      email: "fatou.ndiaye@terangapalace.sn",
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
      email: "cheikh.diouf@terangapalace.sn",
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
      email: "amadou.sow@terangapalace.sn",
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
      email: "aissatou.sy@terangapalace.sn",
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
      poste: "Extra Barman / Soirées Banquets",
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
      email: "contact@dakarfroid.sn",
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
      coordonneesBancaires: "ECOBANK SN034 01004 01239874561 23 (NINEA 004561239 1P4)",
    },
    {
      id: "8",
      matricule: "PREST-008",
      nom: "Afro-Jazz Live Dakar",
      prenom: "Groupe Musical",
      statut: "prestataire",
      typeContrat: "prestation",
      poste: "Animation Soirées Piscine & Restaurant (3 soirs/semaine)",
      departement: "MICE, Événements & Piscine",
      dateEmbauche: "2025-10-01",
      telephone: "+221 77 333 44 55",
      email: "management@afrojazz.sn",
      situationFamiliale: "celibataire",
      nombreEnfants: 0,
      nombreConjoints: 0,
      partsIr: 1.0,
      regimeIpres: "exempte",
      categorieConventionnelle: "Prestation Artistique & Événementielle",
      salaireBase: 400000,
      sursalaire: 0,
      primesMensuelles: 0,
      indemniteTransport: 0,
      modePaiement: "cheque",
    },
  ]);

  // Formulaire d'ajout
  const [formNom, setFormNom] = useState("");
  const [formPrenom, setFormPrenom] = useState("");
  const [formMatricule, setFormMatricule] = useState(`SAL-00${collaborateurs.length + 1}`);
  const [formStatut, setFormStatut] = useState<"permanent" | "saisonnier" | "journalier" | "prestataire">("permanent");
  const [formTypeContrat, setFormTypeContrat] = useState("cdi");
  const [formPoste, setFormPoste] = useState("");
  const [formDept, setFormDept] = useState<DepartementHotel>("Réception & Front-Desk");
  const [formDateEmbauche, setFormDateEmbauche] = useState(new Date().toISOString().slice(0, 10));
  const [formTel, setFormTel] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSituation, setFormSituation] = useState<"celibataire" | "marie" | "divorce" | "veuf">("celibataire");
  const [formEnfants, setFormEnfants] = useState(0);
  const [formConjoints, setFormConjoints] = useState(0);
  const [formRegimeIpres, setFormRegimeIpres] = useState<"general" | "cadre" | "exempte">("general");
  const [formNumIpres, setFormNumIpres] = useState("");
  const [formNumCss, setFormNumCss] = useState("");
  const [formCatConvention, setFormCatConvention] = useState(GRILLE_HOTEL_CONVENTION[3].intitule);
  const [formSalaireBase, setFormSalaireBase] = useState(GRILLE_HOTEL_CONVENTION[3].salaireBaseMinimal);
  const [formSursalaire, setFormSursalaire] = useState(0);
  const [formPrimes, setFormPrimes] = useState(0);
  const [formTransport, setFormTransport] = useState(26000);
  const [formModePaiement, setFormModePaiement] = useState<"virement" | "wave" | "orange_money" | "cheque" | "especes">("virement");
  const [formRib, setFormRib] = useState("");

  const partsCalculees = formStatut === "prestataire" ? 1.0 : calculerPartsFiscales(formSituation, formEnfants);

  // Filtrage
  const collaborateursFiltres = collaborateurs.filter((c) => {
    const matchRecherche =
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
      c.poste.toLowerCase().includes(recherche.toLowerCase());
    const matchStatut = filtreStatut === "tous" || c.statut === filtreStatut;
    const matchDept = filtreDept === "tous" || c.departement === filtreDept;
    return matchRecherche && matchStatut && matchDept;
  });

  const totalEffectif = collaborateurs.length;
  const totalSalaries = collaborateurs.filter((c) => c.statut !== "prestataire").length;
  const totalPrestataires = collaborateurs.filter((c) => c.statut === "prestataire").length;
  const masseSalarialeBase = collaborateurs.reduce((acc, c) => acc + (c.salaireBase + c.sursalaire + c.primesMensuelles), 0);

  function ouvrirAjout() {
    setFormNom("");
    setFormPrenom("");
    setFormMatricule(`SAL-00${collaborateurs.length + 1}`);
    setFormStatut("permanent");
    setFormTypeContrat("cdi");
    setFormPoste("");
    setFormTel("");
    setFormEmail("");
    setFormSituation("celibataire");
    setFormEnfants(0);
    setFormConjoints(0);
    setFormRegimeIpres("general");
    setFormCatConvention(GRILLE_HOTEL_CONVENTION[3].intitule);
    setFormSalaireBase(GRILLE_HOTEL_CONVENTION[3].salaireBaseMinimal);
    setFormSursalaire(0);
    setFormPrimes(0);
    setFormTransport(26000);
    setFormModePaiement("virement");
    setFormRib("");
    setModalOuvert(true);
  }

  function handleChangementCategorie(catIntitule: string) {
    setFormCatConvention(catIntitule);
    const cat = GRILLE_HOTEL_CONVENTION.find((g) => g.intitule === catIntitule);
    if (cat) {
      setFormSalaireBase(cat.salaireBaseMinimal);
      if (cat.code.startsWith("CAT-8") || cat.code.startsWith("CAT-9") || cat.code.startsWith("CADRE")) {
        setFormRegimeIpres("cadre");
      } else {
        setFormRegimeIpres("general");
      }
    }
  }

  function handleEnregistrerCollaborateur(e: React.FormEvent) {
    e.preventDefault();
    if (!formNom || !formMatricule) return;

    const nouveau: CollaborateurRh = {
      id: Date.now().toString(),
      matricule: formMatricule.toUpperCase().trim(),
      nom: formNom.trim(),
      prenom: formPrenom.trim(),
      statut: formStatut,
      typeContrat: formTypeContrat,
      poste: formPoste || (formStatut === "prestataire" ? "Prestation de service" : "Collaborateur"),
      departement: formDept,
      dateEmbauche: formDateEmbauche,
      telephone: formTel,
      email: formEmail,
      situationFamiliale: formSituation,
      nombreEnfants: Number(formEnfants),
      nombreConjoints: Number(formConjoints),
      partsIr: partsCalculees,
      regimeIpres: formRegimeIpres,
      numeroIpres: formNumIpres,
      numeroCss: formNumCss,
      categorieConventionnelle: formCatConvention,
      salaireBase: Number(formSalaireBase),
      sursalaire: Number(formSursalaire),
      primesMensuelles: Number(formPrimes),
      indemniteTransport: formStatut === "prestataire" ? 0 : Number(formTransport),
      modePaiement: formModePaiement,
      coordonneesBancaires: formRib,
    };

    setCollaborateurs([nouveau, ...collaborateurs]);
    setModalOuvert(false);
    setNotification(`Le profil ${nouveau.matricule} - ${nouveau.prenom} ${nouveau.nom} a été créé avec succès.`);
    setTimeout(() => setNotification(null), 5000);
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Salariés & Prestataires</h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              RH & Paie
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Fichier collaborateurs, état civil, parts fiscales IR, régimes IPRES/CSS et forfaits prestataires BNC.
          </p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un collaborateur
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
            <span className="text-xs font-medium text-muted-foreground">Effectif Global</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalEffectif}</p>
          <p className="text-xs text-muted-foreground mt-1">Présents dans l'hôtel</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Salariés (CDI / CDD)</span>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalSalaries}</p>
          <p className="text-xs text-emerald-600 mt-1">Soumis IPRES / CSS</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Prestataires BNC</span>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{totalPrestataires}</p>
          <p className="text-xs text-amber-600 mt-1">Retenue VRS 5%</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Masse Salariale Brute</span>
            <BadgePercent className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{formatXOF(masseSalarialeBase)}</p>
          <p className="text-xs text-muted-foreground mt-1">Base + Sursalaire + Primes / mois</p>
        </div>
      </div>

      {/* Barre de recherche & filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par matricule, nom, prénom ou poste..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="tous">Tous les statuts</option>
            <option value="permanent">Salariés Permanents</option>
            <option value="saisonnier">Saisonniers</option>
            <option value="journalier">Journaliers / Extras</option>
            <option value="prestataire">Prestataires Extérieurs</option>
          </select>
          <select
            value={filtreDept}
            onChange={(e) => setFiltreDept(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="tous">Tous les départements</option>
            {DEPARTEMENTS_HOTEL.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des collaborateurs */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3">Matricule & Identité</th>
                <th className="px-4 py-3">Poste & Département</th>
                <th className="px-4 py-3">Statut & Convention</th>
                <th className="px-4 py-3">Situation & Parts IR</th>
                <th className="px-4 py-3">Rémunération Mensuelle</th>
                <th className="px-4 py-3">Règlement</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {collaborateursFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun collaborateur ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                collaborateursFiltres.map((collab) => {
                  const salaireTotalFixe = collab.salaireBase + collab.sursalaire + collab.primesMensuelles;
                  return (
                    <tr key={collab.id} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">
                          {collab.prenom} {collab.nom}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <span className="font-mono bg-muted px-1.5 py-0.2 rounded text-[11px] font-medium">
                            {collab.matricule}
                          </span>
                          <span>• {collab.telephone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{collab.poste}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building className="h-3 w-3" />
                          <span>{collab.departement}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                              collab.statut === "permanent"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : collab.statut === "saisonnier"
                                ? "bg-blue-500/10 text-blue-600"
                                : collab.statut === "journalier"
                                ? "bg-purple-500/10 text-purple-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {STATUTS_COLLABORATEUR[collab.statut] || collab.statut}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[180px]">
                          {collab.categorieConventionnelle || "Grille standard"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {collab.statut === "prestataire" ? (
                          <span className="text-xs text-muted-foreground">Exonéré (BNC 5%)</span>
                        ) : (
                          <div>
                            <div className="font-medium text-foreground flex items-center gap-1">
                              <span>{collab.partsIr} part(s)</span>
                              <span className="text-xs text-muted-foreground">({collab.situationFamiliale})</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {collab.nombreEnfants} enfant(s) • IPRES {collab.regimeIpres}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{formatXOF(salaireTotalFixe)}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Base: {formatXOF(collab.salaireBase)}
                          {collab.sursalaire > 0 && ` + Sur: ${formatXOF(collab.sursalaire)}`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="capitalize text-xs font-medium text-foreground flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{collab.modePaiement}</span>
                        </div>
                        {collab.coordonneesBancaires && (
                          <div className="text-[11px] text-muted-foreground truncate max-w-[150px] mt-0.5" title={collab.coordonneesBancaires}>
                            {collab.coordonneesBancaires}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setCollabSelectionne(collab)}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition"
                        >
                          Fiche
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Fiche Collaborateur */}
      {collabSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {collabSelectionne.prenom[0]}
                  {collabSelectionne.nom[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {collabSelectionne.prenom} {collabSelectionne.nom}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {collabSelectionne.matricule} • {collabSelectionne.poste}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCollabSelectionne(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border">
                <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Informations Générales
                </h3>
                <p>
                  <span className="text-muted-foreground">Département :</span>{" "}
                  <strong className="text-foreground">{collabSelectionne.departement}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Date d'embauche :</span>{" "}
                  <strong className="text-foreground">{collabSelectionne.dateEmbauche}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Téléphone :</span>{" "}
                  <strong className="text-foreground">{collabSelectionne.telephone}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Email :</span>{" "}
                  <strong className="text-foreground">{collabSelectionne.email || "Non renseigné"}</strong>
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border">
                <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Fiscalité & Protection Sociale
                </h3>
                <p>
                  <span className="text-muted-foreground">Situation :</span>{" "}
                  <strong className="text-foreground capitalize">{collabSelectionne.situationFamiliale}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Enfants / Conjoints :</span>{" "}
                  <strong className="text-foreground">
                    {collabSelectionne.nombreEnfants} enfant(s) • {collabSelectionne.nombreConjoints} conjoint(s)
                  </strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Parts fiscales IR :</span>{" "}
                  <strong className="text-foreground">{collabSelectionne.partsIr} part(s)</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Régime IPRES :</span>{" "}
                  <strong className="text-foreground capitalize">{collabSelectionne.regimeIpres}</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">N° IPRES / CSS :</span>{" "}
                  <strong className="text-foreground">
                    {collabSelectionne.numeroIpres || "—"} / {collabSelectionne.numeroCss || "—"}
                  </strong>
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border md:col-span-2">
                <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Rémunération & Coordonnées Bancaires
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                  <div className="rounded bg-background p-2 border border-border">
                    <span className="text-[11px] text-muted-foreground block">Salaire de Base</span>
                    <strong className="text-sm text-foreground">{formatXOF(collabSelectionne.salaireBase)}</strong>
                  </div>
                  <div className="rounded bg-background p-2 border border-border">
                    <span className="text-[11px] text-muted-foreground block">Sursalaire</span>
                    <strong className="text-sm text-foreground">{formatXOF(collabSelectionne.sursalaire)}</strong>
                  </div>
                  <div className="rounded bg-background p-2 border border-border">
                    <span className="text-[11px] text-muted-foreground block">Primes Mensuelles</span>
                    <strong className="text-sm text-foreground">{formatXOF(collabSelectionne.primesMensuelles)}</strong>
                  </div>
                  <div className="rounded bg-background p-2 border border-border">
                    <span className="text-[11px] text-muted-foreground block">Total Brut Mensuel</span>
                    <strong className="text-sm text-emerald-600">
                      {formatXOF(
                        collabSelectionne.salaireBase +
                          collabSelectionne.sursalaire +
                          collabSelectionne.primesMensuelles +
                          collabSelectionne.indemniteTransport
                      )}
                    </strong>
                  </div>
                </div>
                <p className="pt-2 text-xs text-muted-foreground">
                  Mode de règlement : <strong className="text-foreground capitalize">{collabSelectionne.modePaiement}</strong>
                  {collabSelectionne.coordonneesBancaires && (
                    <span> — Réf : {collabSelectionne.coordonneesBancaires}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setCollabSelectionne(null)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajout Collaborateur */}
      {modalOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Ajouter un Collaborateur ou Prestataire</h2>
                <p className="text-xs text-muted-foreground">
                  Enregistrement d'un salarié ou d'un intervenant externe dans le système RH de D-HOTEL.
                </p>
              </div>
              <button
                onClick={() => setModalOuvert(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEnregistrerCollaborateur} className="space-y-4 mt-4">
              {/* Type & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Statut RH *</label>
                  <select
                    value={formStatut}
                    onChange={(e) => setFormStatut(e.target.value as any)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="permanent">Salarié Permanent</option>
                    <option value="saisonnier">Saisonnier Hôtellerie</option>
                    <option value="journalier">Journalier / Extra</option>
                    <option value="prestataire">Prestataire Extérieur (BNC)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Type de Contrat *</label>
                  <select
                    value={formTypeContrat}
                    onChange={(e) => setFormTypeContrat(e.target.value)}
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
                  <label className="text-xs font-semibold text-foreground">Matricule Interne *</label>
                  <input
                    type="text"
                    required
                    value={formMatricule}
                    onChange={(e) => setFormMatricule(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground uppercase"
                  />
                </div>
              </div>

              {/* Identité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formPrenom}
                    onChange={(e) => setFormPrenom(e.target.value)}
                    placeholder="Ex: Babacar ou Nom d'entreprise"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Nom de famille / Raison Sociale *</label>
                  <input
                    type="text"
                    required
                    value={formNom}
                    onChange={(e) => setFormNom(e.target.value)}
                    placeholder="Ex: Ndiaye"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Poste & Département */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Poste / Fonction *</label>
                  <input
                    type="text"
                    required
                    value={formPoste}
                    onChange={(e) => setFormPoste(e.target.value)}
                    placeholder="Ex: Réceptionniste d'accueil, Chef de Rang..."
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Département Hôtelier *</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value as DepartementHotel)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    {DEPARTEMENTS_HOTEL.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={formTel}
                    onChange={(e) => setFormTel(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="employe@terangapalace.sn"
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Date Embauche / Début *</label>
                  <input
                    type="date"
                    required
                    value={formDateEmbauche}
                    onChange={(e) => setFormDateEmbauche(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Situation Familiale & Parts Fiscales (si pas prestataire) */}
              {formStatut !== "prestataire" && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Situation de Famille & Fiscalité (Code Général des Impôts)
                    </h3>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Parts fiscales calculées : {partsCalculees} part(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Situation Matrimoniale</label>
                      <select
                        value={formSituation}
                        onChange={(e) => setFormSituation(e.target.value as any)}
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                      >
                        {SITUATIONS_FAMILLE.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Enfants à charge</label>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        value={formEnfants}
                        onChange={(e) => setFormEnfants(Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Nombre de conjoints</label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={formConjoints}
                        onChange={(e) => setFormConjoints(Number(e.target.value))}
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Régime Retraite IPRES</label>
                      <select
                        value={formRegimeIpres}
                        onChange={(e) => setFormRegimeIpres(e.target.value as any)}
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                      >
                        {REGIMES_IPRES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs text-muted-foreground">N° Immatriculation IPRES</label>
                      <input
                        type="text"
                        value={formNumIpres}
                        onChange={(e) => setFormNumIpres(e.target.value)}
                        placeholder="Ex: IPRES-123456-X"
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">N° Caisse Sécurité Sociale (CSS)</label>
                      <input
                        type="text"
                        value={formNumCss}
                        onChange={(e) => setFormNumCss(e.target.value)}
                        placeholder="Ex: CSS-987654-Y"
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Rémunération & Convention Hôtelière */}
              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Rémunération & Grille Conventionnelle de l'Hôtellerie
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground">Catégorie Convention Collective Hôtellerie</label>
                    <select
                      value={formCatConvention}
                      onChange={(e) => handleChangementCategorie(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    >
                      {GRILLE_HOTEL_CONVENTION.map((g) => (
                        <option key={g.code} value={g.intitule}>
                          {g.intitule} (Min: {formatXOF(g.salaireBaseMinimal)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Salaire de Base Conventionnel (FCFA) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formSalaireBase}
                      onChange={(e) => setFormSalaireBase(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Sursalaire Contractuel Négocié (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={formSursalaire}
                      onChange={(e) => setFormSursalaire(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Primes Mensuelles Régulières (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={formPrimes}
                      onChange={(e) => setFormPrimes(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground">Indemnité de Transport Légale (Dakar: 26 000 F)</label>
                    <input
                      type="number"
                      min="0"
                      value={formTransport}
                      onChange={(e) => setFormTransport(Number(e.target.value))}
                      className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Mode de règlement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Mode de Règlement</label>
                  <select
                    value={formModePaiement}
                    onChange={(e) => setFormModePaiement(e.target.value as any)}
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="virement">Virement Bancaire</option>
                    <option value="wave">Wave Mobile Money</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="cheque">Chèque Bancaire</option>
                    <option value="especes">Espèces (Contre Émargement)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Coordonnées / RIB / N° Mobile</label>
                  <input
                    type="text"
                    value={formRib}
                    onChange={(e) => setFormRib(e.target.value)}
                    placeholder="Ex: CBAO SN... ou +221 77..."
                    className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono"
                  />
                </div>
              </div>

              {/* Boutons actions */}
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
                  Enregistrer le collaborateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
