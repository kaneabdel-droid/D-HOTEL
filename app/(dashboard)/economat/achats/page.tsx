"use client";

import { useState } from "react";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Clock,
  Truck,
  Phone,
  Coins,
  Warehouse,
  Check,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface CommandeAchat {
  id: string;
  numeroBon: string;
  fournisseur: string;
  categorie: string;
  telephone: string;
  dateEmission: string;
  dateLivraisonPrevue: string;
  montantTotal: number;
  statut: "brouillon" | "envoye" | "receptionne" | "facture";
  articlesCommandes: { nom: string; quantite: string; prix: number }[];
}

export default function AchatsFournisseursPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [modalCommande, setModalCommande] = useState(false);
  const [commandeSelectionnee, setCommandeSelectionnee] = useState<CommandeAchat | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [commandes, setCommandes] = useState<CommandeAchat[]>([
    {
      id: "1",
      numeroBon: "BC-2026-0089",
      fournisseur: "Marée Dakar & Poissonnerie Royale",
      categorie: "Produits de la mer frais",
      telephone: "+221 77 500 12 34",
      dateEmission: "24/10/2026",
      dateLivraisonPrevue: "25/10/2026 à 07h00",
      montantTotal: 340000,
      statut: "envoye",
      articlesCommandes: [
        { nom: "Mérou blanc Thiof entier", quantite: "25 kg", prix: 200000 },
        { nom: "Filet de Lotte", quantite: "15 kg", prix: 105000 },
        { nom: "Crevettes géantes de Casamance", quantite: "5 kg", prix: 35000 },
      ],
    },
    {
      id: "2",
      numeroBon: "BC-2026-0088",
      fournisseur: "Boucherie Sahélienne & Élevage",
      categorie: "Viandes fraîches & Volailles",
      telephone: "+221 78 222 99 00",
      dateEmission: "23/10/2026",
      dateLivraisonPrevue: "24/10/2026",
      montantTotal: 480000,
      statut: "receptionne",
      articlesCommandes: [
        { nom: "Filet de Zébu première qualité", quantite: "30 kg", prix: 285000 },
        { nom: "Poulets fermiers entiers", quantite: "40 pièces", prix: 140000 },
        { nom: "Gigot d'agneau", quantite: "10 kg", prix: 55000 },
      ],
    },
    {
      id: "3",
      numeroBon: "BC-2026-0087",
      fournisseur: "Caves & Vignobles d'Afrique",
      categorie: "Boissons, Vins & Spiritueux",
      telephone: "+221 76 111 45 78",
      dateEmission: "20/10/2026",
      dateLivraisonPrevue: "22/10/2026",
      montantTotal: 1250000,
      statut: "facture",
      articlesCommandes: [
        { nom: "Champagne Taittinger Brut", quantite: "24 blles", prix: 720000 },
        { nom: "Vins de Bordeaux AOC", quantite: "60 blles", prix: 380000 },
        { nom: "Sirop de Bissap & Spiritueux", quantite: "Cartons", prix: 150000 },
      ],
    },
  ]);

  const pointerReception = (id: string) => {
    setCommandes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut: "receptionne" } : c))
    );
    setSuccesMsg(
      "Bon de réception validé. Les quantités d'articles ont été intégrées aux stocks de l'Économat."
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const commandesFiltrees = commandes.filter((c) => {
    const correspondRecherche =
      c.fournisseur.toLowerCase().includes(recherche.toLowerCase()) ||
      c.numeroBon.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut =
      filtreStatut === "tous" || c.statut === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Commandes Fournisseurs & Réceptions
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Bons de commande achats, suivi des livraisons et validation des réceptions en stock
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalCommande(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Bon de Commande
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
            placeholder="Rechercher par fournisseur ou numéro de bon..."
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
          <option value="envoye">En attente de livraison</option>
          <option value="receptionne">Réceptionné en stock</option>
          <option value="facture">Facturé & Réglé</option>
        </select>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">N° Bon Commande</th>
                <th className="px-4 py-3">Fournisseur Partenaire</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Date Émission</th>
                <th className="px-4 py-3">Livraison Prévue</th>
                <th className="px-4 py-3 text-right">Montant Total</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {commandesFiltrees.map((cmd) => (
                <tr key={cmd.id} className="hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-[var(--accent)]">
                    {cmd.numeroBon}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-foreground block">
                      {cmd.fournisseur}
                    </span>
                    <span className="text-xs text-foreground-muted flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {cmd.telephone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    {cmd.categorie}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {cmd.dateEmission}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground font-semibold">
                    {cmd.dateLivraisonPrevue}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    {formatXOF(cmd.montantTotal)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        cmd.statut === "receptionne"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : cmd.statut === "facture"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {cmd.statut === "receptionne"
                        ? "Livré & Réceptionné"
                        : cmd.statut === "facture"
                        ? "Facture Comptabilisée"
                        : "En cours de livraison"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cmd.statut === "envoye" ? (
                      <button
                        onClick={() => pointerReception(cmd.id)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 mx-auto shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Pointer Réception
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">
                        ✓ En stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOUVELLE COMMANDE */}
      {modalCommande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <h3 className="text-base font-bold text-foreground">Créer un bon de commande fournisseur</h3>
              <button
                type="button"
                onClick={() => setModalCommande(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalCommande(false);
                setSuccesMsg("Bon de commande généré et transmis au fournisseur.");
                setTimeout(() => setSuccesMsg(null), 3000);
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Fournisseur agréé <span className="text-danger">*</span>
                  </label>
                  <select className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                    <option value="Marée Dakar">Marée Dakar & Poissonnerie Royale</option>
                    <option value="Boucherie Sahélienne">Boucherie Sahélienne & Élevage</option>
                    <option value="Caves & Vignobles">Caves & Vignobles d&apos;Afrique</option>
                    <option value="Maraîchers des Niayes">Maraîchers des Niayes (Légumes frais)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Date de livraison souhaitée <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-10-26"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Articles et quantités prévues
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ex: 20kg Thiof frais, 10kg Lotte, 5kg Crevettes géantes..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-background text-foreground placeholder:text-foreground-muted/60 border border-surface-border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setModalCommande(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition"
                >
                  Émettre le Bon de Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
