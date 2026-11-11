"use client";

import { useState, useEffect } from "react";
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Crown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Coins,
  History,
  Eye,
  Heart,
  ShieldAlert,
  X,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { loadHotelData, saveHotelData, clearHotelData } from "@/lib/hotel-storage";

interface ClientCRM {
  id: string;
  civilite: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  nationalite: string;
  typePiece: string;
  numeroPiece: string;
  categorie: "VIP Gold" | "Entreprise" | "Particulier" | "Diplomate";
  nbSejours: number;
  totalDepense: number;
  dernierSejour: string;
  preferences: string[];
  historiqueSejours: { date: string; chambre: string; montant: number }[];
}

const DEFAULT_CLIENTS: ClientCRM[] = [
  {
    id: "cli-demo-1",
    civilite: "M.",
    nom: "DIOP",
    prenom: "Ibrahima",
    telephone: "+221 77 450 12 34",
    email: "i.diop@telecom-sn.com",
    nationalite: "Sénégalaise",
    typePiece: "CNI",
    numeroPiece: "1 254 1984 00124",
    categorie: "VIP Gold",
    nbSejours: 6,
    totalDepense: 1420000,
    dernierSejour: "24/10/2026 (En séjour)",
    preferences: ["Chambre côté jardin calme", "Lit King Size", "Eau Kirène en chambre", "Café Touba le matin"],
    historiqueSejours: [
      { date: "24/10/2026", chambre: "Chambre 101", montant: 135000 },
      { date: "12/08/2026", chambre: "Suite Junior 201", montant: 285000 },
    ],
  },
  {
    id: "cli-demo-2",
    civilite: "Mme",
    nom: "MARTIN",
    prenom: "Sophie",
    telephone: "+33 6 45 78 12 90",
    email: "sophie.martin@paris-archi.fr",
    nationalite: "Française",
    typePiece: "Passeport",
    numeroPiece: "21AF45981",
    categorie: "VIP Gold",
    nbSejours: 3,
    totalDepense: 2150000,
    dernierSejour: "24/10/2026 (En séjour)",
    preferences: ["Bungalow vue mer", "Régime pesco-végétarien", "Oreillers en plumes"],
    historiqueSejours: [
      { date: "24/10/2026", chambre: "Bungalow Plage 12", montant: 900000 },
      { date: "15/01/2026", chambre: "Bungalow Plage 11", montant: 720000 },
    ],
  },
  {
    id: "cli-demo-3",
    civilite: "S.E. M.",
    nom: "AL-MANSOORI",
    prenom: "Rashid",
    telephone: "+971 50 123 4567",
    email: "almansoori@invest-uae.ae",
    nationalite: "Émiratie",
    typePiece: "Passeport",
    numeroPiece: "N8871290",
    categorie: "Diplomate",
    nbSejours: 2,
    totalDepense: 3800000,
    dernierSejour: "10/09/2026",
    preferences: ["Suite Présidentielle", "Voiture avec chauffeur", "Discrétion absolue"],
    historiqueSejours: [
      { date: "10/09/2026", chambre: "Suite Royale", montant: 3800000 },
    ],
  },
  {
    id: "cli-demo-4",
    civilite: "Mme",
    nom: "FALL",
    prenom: "Aminata",
    telephone: "+221 78 901 23 45",
    email: "a.fall@ong-afrique.org",
    nationalite: "Sénégalaise",
    typePiece: "Passeport",
    numeroPiece: "SN091244",
    categorie: "Entreprise",
    nbSejours: 4,
    totalDepense: 890000,
    dernierSejour: "02/10/2026",
    preferences: ["Facture avec mention TVA", "Arrivée tardive après 22h", "Chambre étage élevé"],
    historiqueSejours: [
      { date: "02/10/2026", chambre: "Chambre Standard 102", montant: 180000 },
      { date: "15/06/2026", chambre: "Chambre Deluxe 103", montant: 260000 },
    ],
  },
];

export default function ClientsCRMPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreCat, setFiltreCat] = useState("tous");
  const [clientSelectionne, setClientSelectionne] = useState<ClientCRM | null>(null);
  const [modalNouveauClient, setModalNouveauClient] = useState(false);
  const [modalModifierClient, setModalModifierClient] = useState<ClientCRM | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire d'ajout
  const [nouvelleCivilite, setNouvelleCivilite] = useState("M.");
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouveauPrenom, setNouveauPrenom] = useState("");
  const [nouveauTel, setNouveauTel] = useState("");
  const [nouveauEmail, setNouveauEmail] = useState("");
  const [nouvelleNat, setNouvelleNat] = useState("Sénégalaise");
  const [nouveauTypePiece, setNouveauTypePiece] = useState("CNI");
  const [nouveauNumPiece, setNouveauNumPiece] = useState("");
  const [nouvelleCat, setNouvelleCat] = useState<ClientCRM["categorie"]>("Particulier");
  const [nouvellePref, setNouvellePref] = useState("");

  // Données persistantes
  const [clients, setClients] = useState<ClientCRM[]>(DEFAULT_CLIENTS);
  const [isExempleFiligrane, setIsExempleFiligrane] = useState(true);

  useEffect(() => {
    const loaded = loadHotelData<ClientCRM>("dhotel_clients", DEFAULT_CLIENTS);
    setClients(loaded.items);
    setIsExempleFiligrane(loaded.isExempleFiligrane);
  }, []);

  const handleAjoutClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauNom || !nouveauTel) return;

    const prefs = nouvellePref
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const nouveau: ClientCRM = {
      id: "cli-" + Date.now(),
      civilite: nouvelleCivilite,
      nom: nouveauNom.toUpperCase().trim(),
      prenom: nouveauPrenom.trim(),
      telephone: nouveauTel.trim(),
      email: nouveauEmail.trim() || "non-renseigne@client.sn",
      nationalite: nouvelleNat,
      typePiece: nouveauTypePiece,
      numeroPiece: nouveauNumPiece.trim() || "Non communiquée",
      categorie: nouvelleCat,
      nbSejours: 0,
      totalDepense: 0,
      dernierSejour: "Nouveau client (aucun séjour)",
      preferences: prefs.length > 0 ? prefs : ["Aucune préférence renseignée"],
      historiqueSejours: [],
    };

    const updated = isExempleFiligrane ? [nouveau] : [nouveau, ...clients];
    setClients(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_clients", updated);

    setModalNouveauClient(false);
    setNouveauNom("");
    setNouveauPrenom("");
    setNouveauTel("");
    setNouveauEmail("");
    setNouveauNumPiece("");
    setNouvellePref("");

    setSuccesMsg(`Fiche client créée avec succès pour ${nouveau.civilite} ${nouveau.nom} ${nouveau.prenom}.`);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const handleModifierClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalModifierClient) return;

    const updated = clients.map((c) =>
      c.id === modalModifierClient.id ? modalModifierClient : c
    );
    setClients(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_clients", updated);

    setModalModifierClient(null);
    setSuccesMsg(`Fiche client de ${modalModifierClient.nom} mise à jour avec succès.`);
    setTimeout(() => setSuccesMsg(null), 3500);
  };

  const handleSupprimerClient = (id: string, nom: string, prenom: string) => {
    if (!window.confirm(`Confirmez-vous la suppression du client ${nom} ${prenom} ?`)) {
      return;
    }

    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_clients", updated);

    setSuccesMsg(`Client ${nom} ${prenom} supprimé.`);
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  const handleViderExemples = () => {
    if (window.confirm("Voulez-vous vider tous les exemples de clients pour démarrer avec un fichier vierge ?")) {
      setClients([]);
      setIsExempleFiligrane(false);
      clearHotelData("dhotel_clients");
      setSuccesMsg("Fichier clients vidé. Vous pouvez enregistrer vos premiers clients réels.");
      setTimeout(() => setSuccesMsg(null), 4000);
    }
  };

  const handleConvertirExemples = () => {
    const converted = clients.map((c, i) => ({
      ...c,
      id: "cli-reel-" + (i + 1) + "-" + Date.now(),
    }));
    setClients(converted);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_clients", converted);
    setSuccesMsg("Les profils clients d'exemple ont été convertis en données réelles modifiables.");
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const clientsFiltres = clients.filter((c) => {
    const correspondRecherche =
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.telephone.toLowerCase().includes(recherche.toLowerCase()) ||
      c.email.toLowerCase().includes(recherche.toLowerCase()) ||
      c.numeroPiece.toLowerCase().includes(recherche.toLowerCase());
    const correspondCat = filtreCat === "tous" || c.categorie === filtreCat;
    return correspondRecherche && correspondCat;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Fichier Clients (CRM 360°)
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Historique des séjours, dépenses cumulées (Lifetime Value) et préférences personnalisées
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNouveauClient(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-white hover:opacity-95 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Client
          </button>
        </div>
      </div>

      {/* Bannière filigrane sans impact */}
      {isExempleFiligrane && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Clients d&apos;exemple en filigrane :</strong> Votre établissement ne possède pas encore de clients enregistrés. Ces {clients.length} fiches sont affichées à titre indicatif et sans impact. Vous pouvez les modifier, les supprimer ou ajouter vos propres clients réels.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConvertirExemples}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition cursor-pointer"
            >
              Conserver et Modifier
            </button>
            <button
              onClick={handleViderExemples}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-black/5 text-amber-900 dark:text-amber-200 text-xs font-semibold transition cursor-pointer"
            >
              Partir de zéro
            </button>
          </div>
        </div>
      )}

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, e-mail, passeport..."
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
          <option value="tous">Tous les segments clients</option>
          <option value="VIP Gold">VIP Gold</option>
          <option value="Entreprise">Entreprises en compte</option>
          <option value="Diplomate">Corps Diplomatique</option>
          <option value="Particulier">Particuliers</option>
        </select>
      </div>

      {/* Grille des Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientsFiltres.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-surface border border-surface-border rounded-2xl text-foreground-muted">
            Aucun client enregistré.
          </div>
        ) : null}

        {clientsFiltres.map((client) => {
          const estVip = client.categorie === "VIP Gold" || client.categorie === "Diplomate";

          return (
            <div
              key={client.id}
              className={`p-5 rounded-2xl bg-surface border border-surface-border hover:shadow-md transition space-y-4 flex flex-col justify-between ${isExempleFiligrane ? "opacity-75 border-dashed border-amber-500/40" : ""
                }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${estVip
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-surface-muted text-foreground-muted"
                        }`}
                    >
                      {estVip && <Crown className="w-3 h-3 text-amber-600" />}
                      {client.categorie}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-muted font-medium text-foreground-muted">
                      {client.nationalite}
                    </span>
                    {isExempleFiligrane && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        Exemple
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-foreground">
                    {client.nbSejours} séjour(s)
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {client.civilite} {client.nom} {client.prenom}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-foreground-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {client.telephone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {client.email}
                    </span>
                  </div>
                </div>

                {/* Préférences */}
                <div className="pt-2 border-t border-surface-border">
                  <span className="text-[11px] font-bold uppercase text-[var(--accent)] flex items-center gap-1 mb-1">
                    <Heart className="w-3 h-3" />
                    Préférences :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {client.preferences.map((p, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-surface-muted text-foreground font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-foreground-muted block">
                    Cumul dépenses :
                  </span>
                  <span className="text-base font-black text-foreground">
                    {formatXOF(client.totalDepense)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setClientSelectionne(client)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Dossier 360°
                  </button>
                  <button
                    onClick={() => setModalModifierClient(client)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-surface-border/60 hover:bg-surface-border text-foreground transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleSupprimerClient(client.id, client.nom, client.prenom)}
                    className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                    title="Supprimer ce client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL MODIFIER CLIENT */}
      {modalModifierClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-lg font-bold text-foreground">
                Modifier Client : {modalModifierClient.nom} {modalModifierClient.prenom}
              </h3>
              <button
                type="button"
                onClick={() => setModalModifierClient(null)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModifierClient} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium mb-1">Civilité</label>
                  <select
                    value={modalModifierClient.civilite}
                    onChange={(e) =>
                      setModalModifierClient({ ...modalModifierClient, civilite: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  >
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Dr.">Dr.</option>
                    <option value="S.E. M.">S.E. M.</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={modalModifierClient.nom}
                    onChange={(e) =>
                      setModalModifierClient({ ...modalModifierClient, nom: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={modalModifierClient.prenom}
                    onChange={(e) =>
                      setModalModifierClient({ ...modalModifierClient, prenom: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={modalModifierClient.telephone}
                    onChange={(e) =>
                      setModalModifierClient({ ...modalModifierClient, telephone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">E-mail</label>
                  <input
                    type="email"
                    value={modalModifierClient.email}
                    onChange={(e) =>
                      setModalModifierClient({ ...modalModifierClient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Nationalité</label>
                  <input
                    type="text"
                    value={modalModifierClient.nationalite}
                    onChange={(e) =>
                      setModalModifierClient({ ...modalModifierClient, nationalite: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Segment Client</label>
                  <select
                    value={modalModifierClient.categorie}
                    onChange={(e: any) =>
                      setModalModifierClient({ ...modalModifierClient, categorie: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="VIP Gold">VIP Gold</option>
                    <option value="Entreprise">Entreprise en compte</option>
                    <option value="Diplomate">Corps Diplomatique</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalModifierClient(null)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-95"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOUVEAU CLIENT */}
      {modalNouveauClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-lg font-bold text-foreground">Ajouter un Client CRM</h3>
              <button
                type="button"
                onClick={() => setModalNouveauClient(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAjoutClient} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium mb-1">Civilité</label>
                  <select
                    value={nouvelleCivilite}
                    onChange={(e) => setNouvelleCivilite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  >
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Dr.">Dr.</option>
                    <option value="S.E. M.">S.E. M.</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="DIOP"
                    value={nouveauNom}
                    onChange={(e) => setNouveauNom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Moussa"
                    value={nouveauPrenom}
                    onChange={(e) => setNouveauPrenom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 000 00 00"
                    value={nouveauTel}
                    onChange={(e) => setNouveauTel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="moussa@domaine.sn"
                    value={nouveauEmail}
                    onChange={(e) => setNouveauEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Nationalité</label>
                  <input
                    type="text"
                    value={nouvelleNat}
                    onChange={(e) => setNouvelleNat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Segment Client</label>
                  <select
                    value={nouvelleCat}
                    onChange={(e: any) => setNouvelleCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="VIP Gold">VIP Gold</option>
                    <option value="Entreprise">Entreprise en compte</option>
                    <option value="Diplomate">Corps Diplomatique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Préférences déclarées (séparées par virgules)</label>
                <input
                  type="text"
                  placeholder="Lit King Size, Eau minérale, Vue mer..."
                  value={nouvellePref}
                  onChange={(e) => setNouvellePref(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalNouveauClient(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-95"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DOSSIER CLIENT 360° */}
      {clientSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-start justify-between shrink-0 bg-surface">
              <div>
                <span className="text-[11px] text-[var(--accent)] uppercase font-bold tracking-wider">
                  Fiche Voyageur CRM
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  {clientSelectionne.civilite} {clientSelectionne.nom} {clientSelectionne.prenom}
                </h3>
                <p className="text-xs text-foreground-muted">
                  Segment : {clientSelectionne.categorie} • {clientSelectionne.nationalite} ({clientSelectionne.typePiece} : {clientSelectionne.numeroPiece})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <Crown className="w-5 h-5" />
                </span>
                <button
                  type="button"
                  onClick={() => setClientSelectionne(null)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Historique des Séjours */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase text-foreground-muted mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Historique des Séjours & Chambres Préférées
                </h4>
                <div className="bg-background rounded-xl border border-surface-border divide-y divide-surface-border text-xs">
                  {clientSelectionne.historiqueSejours.length === 0 ? (
                    <p className="p-3 text-foreground-muted">Aucun séjour archivé pour le moment.</p>
                  ) : (
                    clientSelectionne.historiqueSejours.map((h, i) => (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-foreground block">
                            Séjour du {h.date}
                          </span>
                          <span className="text-foreground-muted text-[11px]">
                            Chambre : {h.chambre}
                          </span>
                        </div>
                        <span className="font-bold text-foreground">
                          {formatXOF(h.montant)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-foreground-muted mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Préférences Exclusives
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {clientSelectionne.preferences.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-surface-muted text-foreground font-medium text-xs border border-surface-border"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-surface-border shrink-0 flex justify-end bg-surface">
              <button
                type="button"
                onClick={() => setClientSelectionne(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition"
              >
                Fermer la Fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
