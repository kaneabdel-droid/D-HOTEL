"use client";

import { useState } from "react";
import {
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Send,
  Hotel,
  CheckCircle,
  Smartphone,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface Produit {
  id: string;
  nom: string;
  categorie: string;
  prix: number;
  description: string;
}

interface LigneCommande {
  produit: Produit;
  quantite: number;
  instructions?: string;
}

export default function TouchPosPage() {
  const [pointDeVente, setPointDeVente] = useState("Restaurant Gastronomique");
  const [tableSelectionnee, setTableSelectionnee] = useState("Table 04");
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [panier, setPanier] = useState<LigneCommande[]>([
    {
      produit: {
        id: "1",
        nom: "Thieboudienne Royal Penda Mbaye",
        categorie: "Plats Locaux",
        prix: 8500,
        description: "Mérou frais, riz rouge parfumé, légumes du terroir",
      },
      quantite: 2,
    },
    {
      produit: {
        id: "5",
        nom: "Cocktail Teranga Sunset",
        categorie: "Boissons & Bar",
        prix: 4500,
        description: "Rhum ambré, jus de bissap bio, gingembre frais",
      },
      quantite: 2,
    },
  ]);
  const [modalChambre, setModalChambre] = useState(false);
  const [chambreSaisie, setChambreSaisie] = useState("201");
  const [succesPaiement, setSuccesPaiement] = useState<string | null>(null);

  const categories = [
    "Tous",
    "Entrées",
    "Plats Locaux",
    "Grillades & Poissons",
    "Desserts",
    "Boissons & Bar",
    "Vins & Champagnes",
  ];

  const produits: Produit[] = [
    {
      id: "1",
      nom: "Thieboudienne Royal Penda Mbaye",
      categorie: "Plats Locaux",
      prix: 8500,
      description: "Mérou frais, riz rouge parfumé, légumes du terroir",
    },
    {
      id: "2",
      nom: "Yassa au Poulet Fermier Braisé",
      categorie: "Plats Locaux",
      prix: 7000,
      description: "Poulet mariné au citron vert et oignons caramélisés",
    },
    {
      id: "3",
      nom: "Filet de Lotte Grillé au Poivre Vert",
      categorie: "Grillades & Poissons",
      prix: 12000,
      description: "Lotte pêchée du jour, purée de patates douces",
    },
    {
      id: "4",
      nom: "Salade Océane aux Crevettes de Casamance",
      categorie: "Entrées",
      prix: 6500,
      description: "Avocat, mangue fraîche, vinaigrette passion",
    },
    {
      id: "5",
      nom: "Cocktail Teranga Sunset",
      categorie: "Boissons & Bar",
      prix: 4500,
      description: "Rhum ambré, jus de bissap bio, gingembre frais",
    },
    {
      id: "6",
      nom: "Café Touba Gourmand & Thiakry",
      categorie: "Desserts",
      prix: 3500,
      description: "Dessert traditionnel au couscous de mil et yaourt doux",
    },
    {
      id: "7",
      nom: "Gazelle Fraîche 33cl (Bière Locale)",
      categorie: "Boissons & Bar",
      prix: 2500,
      description: "Servie bien glacée",
    },
    {
      id: "8",
      nom: "Assiette de Gambas Géantes Grillées",
      categorie: "Grillades & Poissons",
      prix: 16000,
      description: "Sauce chien maison et aloco d'Abidjan",
    },
  ];

  const produitsFiltres =
    categorieActive === "Tous"
      ? produits
      : produits.filter((p) => p.categorie === categorieActive);

  function ajouterAuPanier(produit: Produit) {
    setPanier((prev) => {
      const existe = prev.find((item) => item.produit.id === produit.id);
      if (existe) {
        return prev.map((item) =>
          item.produit.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }
      return [...prev, { produit, quantite: 1 }];
    });
  }

  function modifierQuantite(id: string, delta: number) {
    setPanier((prev) =>
      prev
        .map((item) => {
          if (item.produit.id === id) {
            const nq = item.quantite + delta;
            return nq > 0 ? { ...item, quantite: nq } : null;
          }
          return item;
        })
        .filter(Boolean) as LigneCommande[]
    );
  }

  const sousTotal = panier.reduce(
    (acc, item) => acc + item.produit.prix * item.quantite,
    0
  );
  const tva = sousTotal * 0.18; // 18% TVA
  const total = sousTotal + tva;

  function handlePayer(mode: string) {
    setSuccesPaiement(`Commande réglée avec succès via ${mode} !`);
    setTimeout(() => {
      setSuccesPaiement(null);
      setPanier([]);
    }, 2500);
  }

  function handleImputerChambre() {
    setModalChambre(false);
    setSuccesPaiement(
      `Montant de ${formatXOF(total)} imputé avec succès sur le Folio de la Chambre ${chambreSaisie} !`
    );
    setTimeout(() => {
      setSuccesPaiement(null);
      setPanier([]);
    }, 2500);
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-3">
      {/* ── EN-TÊTE TOUCH POS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--foreground)]">
              Caisse Tactile Restauration & Bars (Touch POS)
            </h1>
            <p className="text-[11px] text-[var(--foreground-muted)]">
              Point de vente : {pointDeVente} • Table : {tableSelectionnee}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={pointDeVente}
            onChange={(e) => setPointDeVente(e.target.value)}
            className="p-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] font-medium"
          >
            <option>Restaurant Gastronomique</option>
            <option>Bar Piscine & Paillote</option>
            <option>Room-Service</option>
          </select>

          <select
            value={tableSelectionnee}
            onChange={(e) => setTableSelectionnee(e.target.value)}
            className="p-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] font-semibold text-[#D4AF37]"
          >
            <option>Table 01</option>
            <option>Table 02</option>
            <option>Table 04</option>
            <option>Terrasse 01</option>
            <option>Transat Piscine 12</option>
          </select>
        </div>
      </div>

      {/* Message de succès de paiement */}
      {succesPaiement && (
        <div className="p-3 bg-[#10B981]/15 border border-[#10B981] rounded-xl text-center text-xs font-bold text-[#10B981] flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{succesPaiement}</span>
        </div>
      )}

      {/* ── CORPS DU POS : CATALOGUE + TICKET ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Colonne Gauche : Catégories et Cartes Plats (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden space-y-3">
          {/* Onglets des catégories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategorieActive(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  categorieActive === cat
                    ? "bg-[var(--primary)] text-white font-bold"
                    : "bg-[var(--surface)] border border-[var(--surface-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grille des Plats & Boissons */}
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pr-1">
            {produitsFiltres.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => ajouterAuPanier(p)}
                className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] hover:border-[#D4AF37] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-semibold text-[#D4AF37] uppercase">
                    {p.categorie}
                  </span>
                  <h3 className="text-xs font-bold text-[var(--foreground)] mt-0.5 line-clamp-2">
                    {p.nom}
                  </h3>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--surface-border)]">
                  <span className="text-xs font-black text-[var(--primary)]">
                    {formatXOF(p.prix)}
                  </span>
                  <span className="w-6 h-6 rounded-lg bg-[var(--surface-muted)] group-hover:bg-[var(--primary)] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Colonne Droite : Addition & Ticket de Commande (4 cols) */}
        <div className="lg:col-span-4 h-full flex flex-col bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl overflow-hidden shadow-xs">
          <div className="p-3 border-b border-[var(--surface-border)] bg-[var(--surface-muted)] flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-[var(--foreground)]">
                Note de Table — {tableSelectionnee}
              </h2>
              <p className="text-[10px] text-[var(--foreground-muted)]">
                Serveur : Amadou B. • {panier.length} articles
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanier([])}
              className="text-[10px] text-red-500 hover:underline font-semibold"
            >
              Vider
            </button>
          </div>

          {/* Liste des Lignes du Panier */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {panier.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[var(--foreground-muted)]">
                <UtensilsCrossed className="w-8 h-8 mb-2 opacity-30" />
                <span>Aucun article sélectionné.</span>
                <span className="text-[11px] mt-1">Touchez les plats pour les ajouter.</span>
              </div>
            ) : (
              panier.map((item) => (
                <div
                  key={item.produit.id}
                  className="p-2.5 rounded-lg bg-[var(--surface-muted)] flex items-center justify-between text-xs"
                >
                  <div className="overflow-hidden pr-2">
                    <p className="font-bold text-[var(--foreground)] truncate">
                      {item.produit.nom}
                    </p>
                    <p className="text-[11px] text-[var(--foreground-muted)]">
                      {formatXOF(item.produit.prix)} × {item.quantite}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-[var(--foreground)]">
                      {formatXOF(item.produit.prix * item.quantite)}
                    </span>
                    <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => modifierQuantite(item.produit.id, -1)}
                        className="p-1 hover:bg-[var(--surface-muted)] rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1 font-bold text-[11px]">{item.quantite}</span>
                      <button
                        type="button"
                        onClick={() => modifierQuantite(item.produit.id, 1)}
                        className="p-1 hover:bg-[var(--surface-muted)] rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totaux & Clôture */}
          <div className="p-3 border-t border-[var(--surface-border)] bg-[var(--surface-muted)] space-y-2 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[var(--foreground-muted)]">
                <span>Sous-total HT</span>
                <span>{formatXOF(sousTotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--foreground-muted)]">
                <span>TVA (18%)</span>
                <span>{formatXOF(tva)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[var(--foreground)] pt-1 border-t border-[var(--surface-border)]">
                <span>Total TTC</span>
                <span className="text-[var(--primary)]">{formatXOF(total)}</span>
              </div>
            </div>

            {/* Boutons d'Action & Paiement */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={panier.length === 0}
                onClick={() => handlePayer("Espèces")}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[var(--surface)] border border-[var(--surface-border)] hover:bg-white text-xs font-semibold text-[var(--foreground)] disabled:opacity-50"
              >
                <Banknote className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Espèces</span>
              </button>

              <button
                type="button"
                disabled={panier.length === 0}
                onClick={() => handlePayer("Wave / Orange Money")}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[var(--surface)] border border-[var(--surface-border)] hover:bg-white text-xs font-semibold text-[var(--foreground)] disabled:opacity-50"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Mobile Money</span>
              </button>

              <button
                type="button"
                disabled={panier.length === 0}
                onClick={() => setModalChambre(true)}
                className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#bfa032] text-black font-black text-xs shadow-xs disabled:opacity-50 transition-colors"
              >
                <Hotel className="w-4 h-4" />
                <span>Imputer sur la Chambre (Folio)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALE IMPUTER SUR LA NOTE DE CHAMBRE ── */}
      {modalChambre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm bg-surface text-foreground border border-surface-border rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-surface-border shrink-0 bg-surface">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#D4AF37]" />
                <span>Transfert sur Note de Chambre</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalChambre(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Numéro de Chambre <span className="text-danger">*</span></label>
                <input
                  type="text"
                  value={chambreSaisie}
                  onChange={(e) => setChambreSaisie(e.target.value)}
                  className="w-full px-3 py-2 text-base font-bold rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Ex: 201"
                />
              </div>

              {/* Fiche client reconnue */}
              <div className="p-3.5 rounded-xl bg-background border border-surface-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">M. Ibrahima Diallo</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Client Vérifié
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted">
                  Suite Junior 201 • Départ le 27 Octobre
                </p>
                <p className="text-[11px] font-semibold text-[#D4AF37]">
                  Montant à transférer : {formatXOF(total)}
                </p>
              </div>

              {/* Pavé de signature sur tablette */}
              <div className="border border-dashed border-surface-border rounded-xl p-3 text-center bg-background">
                <p className="text-[10px] text-foreground-muted mb-1">
                  Signature du client sur l&apos;écran :
                </p>
                <div className="h-16 flex items-center justify-center text-xs italic text-foreground-muted opacity-60">
                  [ Espace signature tactile ]
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-surface-border shrink-0 flex items-center gap-2 bg-surface">
              <button
                type="button"
                onClick={handleImputerChambre}
                className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-95 text-white font-bold text-xs shadow-xs transition"
              >
                Valider le Transfert
              </button>
              <button
                type="button"
                onClick={() => setModalChambre(false)}
                className="px-4 py-2.5 rounded-xl border border-surface-border text-xs text-foreground font-semibold hover:bg-surface-muted transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
