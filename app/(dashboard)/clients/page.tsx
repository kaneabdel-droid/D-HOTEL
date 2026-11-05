"use client";

import { useState } from "react";
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
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

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

export default function ClientsCRMPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreCat, setFiltreCat] = useState("tous");
  const [clientSelectionne, setClientSelectionne] = useState<ClientCRM | null>(null);
  const [modalNouveauClient, setModalNouveauClient] = useState(false);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [clients, setClients] = useState<ClientCRM[]>([
    {
      id: "1",
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
      preferences: ["Chambre côté jardin calme", "Lit King Size", "Eau Kirène en chambre à l'arrivée", "Café Touba le matin"],
      historiqueSejours: [
        { date: "24/10/2026", chambre: "Chambre 101", montant: 135000 },
        { date: "12/08/2026", chambre: "Suite Junior 201", montant: 285000 },
        { date: "05/04/2026", chambre: "Chambre Deluxe 103", montant: 195000 },
      ],
    },
    {
      id: "2",
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
      preferences: ["Bungalow vue mer direct", "Régime pesco-végétarien", "Oreillers en plumes d'oie", "Champagne brut"],
      historiqueSejours: [
        { date: "24/10/2026", chambre: "Bungalow Plage 12", montant: 900000 },
        { date: "15/01/2026", chambre: "Bungalow Plage 11", montant: 720000 },
      ],
    },
    {
      id: "3",
      civilite: "S.E. M.",
      nom: "AL-MANSOORI",
      prenom: "Rashid",
      telephone: "+971 50 123 4567",
      email: "almansoori@invest-uae.ae",
      nationalite: "Émiratie",
      typePiece: "Passeport",
      numeroPiece: "AE890214",
      categorie: "Diplomate",
      nbSejours: 4,
      totalDepense: 3800000,
      dernierSejour: "23/10/2026",
      preferences: ["Suite Exécutive étage élevé", "Discrétion absolue", "Transfert VTC privé aéroport", "Jus de mangue fraîche"],
      historiqueSejours: [
        { date: "23/10/2026", chambre: "Suite Exécutive 202", montant: 675000 },
        { date: "02/06/2026", chambre: "Suite Présidentielle", montant: 1850000 },
      ],
    },
    {
      id: "4",
      civilite: "M.",
      nom: "BA",
      prenom: "Amadou Tidiane",
      telephone: "+221 70 800 11 22",
      email: "a.ba@audit-expert.sn",
      nationalite: "Sénégalaise",
      typePiece: "CNI",
      numeroPiece: "1 198 1979 00987",
      categorie: "Entreprise",
      nbSejours: 5,
      totalDepense: 980000,
      dernierSejour: "24/10/2026",
      preferences: ["Facture avec NINEA entreprise", "Départ tardif 14h accordé"],
      historiqueSejours: [
        { date: "24/10/2026", chambre: "Suite Junior 201", montant: 190000 },
        { date: "14/09/2026", chambre: "Chambre 102", montant: 135000 },
      ],
    },
  ]);

  const clientsFiltres = clients.filter((c) => {
    const correspondRecherche =
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.telephone.includes(recherche) ||
      c.email.toLowerCase().includes(recherche.toLowerCase());
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Client
          </button>
        </div>
      </div>

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
        {clientsFiltres.map((client) => {
          const estVip = client.categorie === "VIP Gold" || client.categorie === "Diplomate";

          return (
            <div
              key={client.id}
              className="p-5 rounded-2xl bg-surface border border-surface-border hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        estVip
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
                  </div>

                  <span className="text-xs font-bold text-foreground">
                    {client.nbSejours} séjours passés
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
                    Préférences déclarées :
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
                    Cumul dépenses (LTV) :
                  </span>
                  <span className="text-base font-black text-foreground">
                    {formatXOF(client.totalDepense)}
                  </span>
                </div>

                <button
                  onClick={() => setClientSelectionne(client)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] hover:opacity-90 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Dossier 360°
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
                  {clientSelectionne.historiqueSejours.map((h, i) => (
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
                  ))}
                </div>
              </div>

              {/* Bilan LTV */}
              <div className="p-3.5 rounded-xl bg-background border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-foreground-muted block text-[11px]">Valeur Client Globale (LTV) :</span>
                  <span className="text-lg font-black text-foreground">
                    {formatXOF(clientSelectionne.totalDepense)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Client Très Fidèle
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end bg-surface">
              <button
                type="button"
                onClick={() => setClientSelectionne(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOUVEAU CLIENT */}
      {modalNouveauClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-base font-bold text-foreground">Créer un nouveau profil client</h3>
              <button
                type="button"
                onClick={() => setModalNouveauClient(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalNouveauClient(false);
                setSuccesMsg("Fiche client créée avec succès.");
                setTimeout(() => setSuccesMsg(null), 3000);
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Civilité</label>
                    <select className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                      <option>M.</option>
                      <option>Mme</option>
                      <option>Dr.</option>
                      <option>S.E.</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="font-semibold text-foreground block mb-1">Nom de famille <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="ex: DIALLO"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
              </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Prénom(s) <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mamadou Lamine"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Téléphone mobile <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Segment client</label>
                  <select className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                    <option value="VIP Gold">VIP Gold</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="Particulier">Particulier</option>
                    <option value="Diplomate">Diplomate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Préférences particulières</label>
                <textarea
                  rows={2}
                  placeholder="ex: Lit king size, chambre calme, fruits frais..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              </div>

              <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setModalNouveauClient(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
                >
                  Créer le Dossier Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
