"use client";

import { useState } from "react";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Layers,
  Sparkles,
  Warehouse,
  Boxes,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface ArticleStock {
  id: string;
  nom: string;
  depot: "Économat Central" | "Chambre Froide" | "Cave & Boissons" | "Produits d'Accueil";
  unite: string;
  stockActuel: number;
  seuilMinimum: number;
  valeurPump: number; // Prix Unitaire Moyen Pondéré
  dernierMouvement: string;
}

export default function StocksEconomatPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreDepot, setFiltreDepot] = useState("tous");
  const [modalMouvement, setModalMouvement] = useState<ArticleStock | null>(null);
  const [typeMouvement, setTypeMouvement] = useState<"entree" | "sortie" | "perte">("sortie");
  const [quantiteMvt, setQuantiteMvt] = useState(5);
  const [motifMvt, setMotifMvt] = useState("Transfert Cuisine Restaurant");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [articles, setArticles] = useState<ArticleStock[]>([
    {
      id: "1",
      nom: "Filet de Mérou blanc (Thiof frais)",
      depot: "Chambre Froide",
      unite: "kg",
      stockActuel: 14.5,
      seuilMinimum: 10,
      valeurPump: 8000,
      dernierMouvement: "Sortie 3.5 kg à 12:15",
    },
    {
      id: "2",
      nom: "Riz Rouge Parfumé de la Vallée",
      depot: "Économat Central",
      unite: "Sacs de 25kg",
      stockActuel: 8,
      seuilMinimum: 4,
      valeurPump: 16500,
      dernierMouvement: "Entrée 10 sacs le 22/10",
    },
    {
      id: "3",
      nom: "Bière Gazelle 33cl (Caisses de 24)",
      depot: "Cave & Boissons",
      unite: "Caisses (24 blles)",
      stockActuel: 18,
      seuilMinimum: 15,
      valeurPump: 14500,
      dernierMouvement: "Sortie 4 caisses Bar Piscine",
    },
    {
      id: "4",
      nom: "Champagne Taittinger Brut Réserve",
      depot: "Cave & Boissons",
      unite: "Bouteilles 75cl",
      stockActuel: 4,
      seuilMinimum: 6,
      valeurPump: 38000,
      dernierMouvement: "Sortie 1 bouteille Suite 201",
    },
    {
      id: "5",
      nom: "Savonnettes Végétales Karité 40g (Accueil)",
      depot: "Produits d'Accueil",
      unite: "Cartons de 100",
      stockActuel: 12,
      seuilMinimum: 5,
      valeurPump: 18000,
      dernierMouvement: "Sortie 2 cartons Étage 1",
    },
    {
      id: "6",
      nom: "Filet de Bœuf Zébu du Sahel",
      depot: "Chambre Froide",
      unite: "kg",
      stockActuel: 6.2,
      seuilMinimum: 8,
      valeurPump: 9500,
      dernierMouvement: "Sortie 4 kg Grillade",
    },
  ]);

  const valeurTotaleStocks = articles.reduce(
    (acc, a) => acc + a.stockActuel * a.valeurPump,
    0
  );

  const nbAlertes = articles.filter((a) => a.stockActuel <= a.seuilMinimum).length;

  const handleValiderMouvement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalMouvement) return;

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== modalMouvement.id) return art;
        const delta = typeMouvement === "entree" ? quantiteMvt : -quantiteMvt;
        return {
          ...art,
          stockActuel: Math.max(0, art.stockActuel + delta),
          dernierMouvement: `${
            typeMouvement === "entree"
              ? "Entrée"
              : typeMouvement === "sortie"
              ? "Sortie"
              : "Perte/Casse"
          } ${quantiteMvt} ${art.unite} (${motifMvt})`,
        };
      })
    );

    setSuccesMsg(
      `Mouvement de stock enregistré sur "${modalMouvement.nom}". Stock actualisé.`
    );
    setModalMouvement(null);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const articlesFiltres = articles.filter((a) => {
    const correspondRecherche =
      a.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      a.depot.toLowerCase().includes(recherche.toLowerCase());
    const correspondDepot =
      filtreDepot === "tous" || a.depot === filtreDepot;
    return correspondRecherche && correspondDepot;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Warehouse className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Économat : Stocks Multi-Dépôts & PUMP
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Valorisation permanente au Coût Moyen Unitaire Pondéré et alertes de seuil d'approvisionnement
          </p>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouches KPIs Valorisation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Valeur Totale du Stock</span>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatXOF(valeurTotaleStocks)}
            </p>
          </div>
          <Coins className="w-8 h-8 text-[var(--accent)]/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Alertes Seuil Minimum</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {nbAlertes} articles
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Nombre de Références Actives</span>
            <p className="text-2xl font-bold text-[var(--primary)] mt-1">
              {articles.length} articles
            </p>
          </div>
          <Boxes className="w-8 h-8 text-[var(--primary)]/30" />
        </div>
      </div>

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher un produit, ingrédient, boisson..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={filtreDepot}
          onChange={(e) => setFiltreDepot(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Tous les dépôts de stockage</option>
          <option value="Économat Central">Économat Central</option>
          <option value="Chambre Froide">Chambre Froide</option>
          <option value="Cave & Boissons">Cave & Boissons</option>
          <option value="Produits d'Accueil">Produits d'Accueil</option>
        </select>
      </div>

      {/* Tableau des stocks */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Désignation</th>
                <th className="px-4 py-3">Magasin / Dépôt</th>
                <th className="px-4 py-3 text-center">Stock Actuel</th>
                <th className="px-4 py-3 text-right">PUMP</th>
                <th className="px-4 py-3 text-right">Valeur Stock</th>
                <th className="px-4 py-3">Dernier Mouvement</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {articlesFiltres.map((art) => {
                const alerte = art.stockActuel <= art.seuilMinimum;
                const valeurLigne = art.stockActuel * art.valeurPump;

                return (
                  <tr key={art.id} className="hover:bg-surface-muted/30 transition">
                    <td className="px-4 py-3">
                      <span className="font-bold text-foreground block">
                        {art.nom}
                      </span>
                      <span className="text-xs text-foreground-muted">
                        Unité : {art.unite}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-surface-muted text-foreground">
                        {art.depot}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-black text-sm ${
                          alerte ? "text-rose-600" : "text-foreground"
                        }`}
                      >
                        {art.stockActuel} {art.unite}
                      </span>
                      {alerte && (
                        <span className="block text-[10px] font-bold text-rose-500">
                          Seuil min: {art.seuilMinimum}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground-muted text-xs">
                      {formatXOF(art.valeurPump)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">
                      {formatXOF(valeurLigne)}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground-muted">
                      {art.dernierMouvement}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setModalMouvement(art)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] hover:opacity-90 transition"
                      >
                        Mouvement
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL MOUVEMENT DE STOCK */}
      {modalMouvement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">
              Mouvement : {modalMouvement.nom}
            </h3>
            <p className="text-xs text-foreground-muted">
              Stock actuel : <strong>{modalMouvement.stockActuel} {modalMouvement.unite}</strong> ({modalMouvement.depot})
            </p>

            <form onSubmit={handleValiderMouvement} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Nature du mouvement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeMouvement("sortie")}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      typeMouvement === "sortie"
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "bg-surface border-surface-border text-foreground-muted"
                    }`}
                  >
                    Sortie Cuisine
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeMouvement("entree")}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      typeMouvement === "entree"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-surface border-surface-border text-foreground-muted"
                    }`}
                  >
                    Entrée Achat
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeMouvement("perte")}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      typeMouvement === "perte"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-surface border-surface-border text-foreground-muted"
                    }`}
                  >
                    Perte / Casse
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Quantité ({modalMouvement.unite}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={quantiteMvt}
                  onChange={(e) => setQuantiteMvt(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Motif / Destination
                </label>
                <input
                  type="text"
                  value={motifMvt}
                  onChange={(e) => setMotifMvt(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalMouvement(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
