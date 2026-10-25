"use client";

import { useState } from "react";
import {
  UtensilsCrossed,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Wine,
  Coffee,
  Coins,
  Layers,
  FileSpreadsheet,
  Flame,
  Percent,
  Eye,
  Info,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface IngredientRecette {
  nom: string;
  quantite: string;
  coutUnitaire: number;
}

interface PlatMenu {
  id: string;
  nom: string;
  categorie: "Entrées" | "Plats Signature" | "Grillades & Poissons" | "Desserts" | "Cocktails Bar";
  prixVente: number;
  coutMatiere: number;
  description: string;
  actif: boolean;
  destockageAutomatique: boolean;
  ingredients: IngredientRecette[];
}

export default function CartesMenusPage() {
  const [recherche, setRecherche] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("tous");
  const [platSelectionne, setPlatSelectionne] = useState<PlatMenu | null>(null);
  const [modalNouveauPlat, setModalNouveauPlat] = useState(false);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [plats, setPlats] = useState<PlatMenu[]>([
    {
      id: "1",
      nom: "Filet de Lotte Grillé au Poivre de Penja",
      categorie: "Plats Signature",
      prixVente: 16500,
      coutMatiere: 4800,
      description: "Pêche locale du jour saisie au feu de bois, tombée d'épinards et émulsion vanille-citron.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Filet de Lotte fraîche", quantite: "220g", coutUnitaire: 3300 },
        { nom: "Poivre noir de Penja", quantite: "5g", coutUnitaire: 300 },
        { nom: "Beurre doux d'Isigny", quantite: "30g", coutUnitaire: 400 },
        { nom: "Épinards frais locaux", quantite: "100g", coutUnitaire: 500 },
        { nom: "Crème & Citron vert", quantite: "5cl", coutUnitaire: 300 },
      ],
    },
    {
      id: "2",
      nom: "Thieboudienne Royal Penda Mbaye",
      categorie: "Plats Signature",
      prixVente: 12500,
      coutMatiere: 3200,
      description: "Le grand classique sénégalais au mérou blanc, légumes du terroir, riz rouge et nététou.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Mérou blanc (Thiof)", quantite: "250g", coutUnitaire: 2000 },
        { nom: "Riz rouge brisé de la vallée", quantite: "180g", coutUnitaire: 350 },
        { nom: "Concentré de tomate & Huile", quantite: "60g", coutUnitaire: 350 },
        { nom: "Assortiment légumes (Manioc, Carotte, Chou)", quantite: "200g", coutUnitaire: 500 },
      ],
    },
    {
      id: "3",
      nom: "Carpaccio d'Espadon aux Agrumes & Baies Roses",
      categorie: "Entrées",
      prixVente: 8500,
      coutMatiere: 2100,
      description: "Tranches extra-fines d'espadon mariné au jus d'orange amère et huile d'olive vierge.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Espadon frais", quantite: "140g", coutUnitaire: 1400 },
        { nom: "Agrumes (Orange, Citron)", quantite: "1 pièce", coutUnitaire: 300 },
        { nom: "Huile d'olive & Baies roses", quantite: "3cl", coutUnitaire: 400 },
      ],
    },
    {
      id: "4",
      nom: "Burger Teranga au Bœuf Zébu & Aloco",
      categorie: "Grillades & Poissons",
      prixVente: 11000,
      coutMatiere: 2900,
      description: "Steak haché zébu façon bouchère (180g), oignons confits au bissap, cheddar et frites d'igname.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Bœuf Zébu haché", quantite: "180g", coutUnitaire: 1500 },
        { nom: "Pain brioché artisanal", quantite: "1 unité", coutUnitaire: 400 },
        { nom: "Banane plantain (Aloco)", quantite: "150g", coutUnitaire: 500 },
        { nom: "Fromage & Sauce Teranga", quantite: "50g", coutUnitaire: 500 },
      ],
    },
    {
      id: "5",
      nom: "Cocktail Signature : Teranga Sunset Spritz",
      categorie: "Cocktails Bar",
      prixVente: 7500,
      coutMatiere: 1800,
      description: "Liqueur de Bissap infusée aux épices, Prosecco, gin local et zeste de pamplemousse rose.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Prosecco DOC", quantite: "8cl", coutUnitaire: 900 },
        { nom: "Sirop de Bissap maison", quantite: "4cl", coutUnitaire: 200 },
        { nom: "Gin artisanal de Dakar", quantite: "3cl", coutUnitaire: 600 },
        { nom: "Eau gazeuse & Glace", quantite: "10cl", coutUnitaire: 100 },
      ],
    },
    {
      id: "6",
      nom: "Fondant Chocolat Noir & Cœur de Mangue Rôtie",
      categorie: "Desserts",
      prixVente: 6500,
      coutMatiere: 1400,
      description: "Chocolat 70% pur cacao, coulis tiède de mangue de Casamance et sorbet coco.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Chocolat noir 70%", quantite: "80g", coutUnitaire: 600 },
        { nom: "Mangue fraîche", quantite: "100g", coutUnitaire: 400 },
        { nom: "Beurre, Œufs & Sucre", quantite: "60g", coutUnitaire: 400 },
      ],
    },
  ]);

  const platsFiltres = plats.filter((p) => {
    const correspondRecherche =
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.description.toLowerCase().includes(recherche.toLowerCase());
    const correspondCat =
      categorieFiltre === "tous" || p.categorie === categorieFiltre;
    return correspondRecherche && correspondCat;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Cartes, Menus & Fiches Recettes
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Gestion de la carte gastronomique, ratios matière (Food Cost %) et déstockage automatique
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNouveauPlat(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Plat / Recette
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouche Food Cost */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Percent className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <span className="font-bold text-foreground block">
              Contrôle Permanent du Food Cost %
            </span>
            <span className="text-foreground-muted">
              Le coût matière moyen de la carte est actuellement de <strong>26.4%</strong> (Objectif standard Palace : &lt; 28%).
            </span>
          </div>
        </div>
      </div>

      {/* Filtres & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Rechercher un plat, cocktail, ingrédient..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
          />
        </div>

        <select
          value={categorieFiltre}
          onChange={(e) => setCategorieFiltre(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border text-foreground"
        >
          <option value="tous">Toutes les catégories</option>
          <option value="Entrées">Entrées</option>
          <option value="Plats Signature">Plats Signature</option>
          <option value="Grillades & Poissons">Grillades & Poissons</option>
          <option value="Desserts">Desserts</option>
          <option value="Cocktails Bar">Cocktails Bar</option>
        </select>
      </div>

      {/* Grille des Plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platsFiltres.map((plat) => {
          const ratioFoodCost = Math.round((plat.coutMatiere / plat.prixVente) * 100);
          const margeBrute = plat.prixVente - plat.coutMatiere;

          return (
            <div
              key={plat.id}
              className="p-5 rounded-xl bg-surface border border-surface-border hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-surface-muted text-foreground-muted">
                    {plat.categorie}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      ratioFoodCost <= 28
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    }`}
                  >
                    Food Cost: {ratioFoodCost}%
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground">
                  {plat.nom}
                </h3>
                <p className="text-xs text-foreground-muted line-clamp-2">
                  {plat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground-muted">Prix de vente TTC :</span>
                  <span className="text-base font-bold text-foreground">
                    {formatXOF(plat.prixVente)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <span>Coût matière (PUMP) : {formatXOF(plat.coutMatiere)}</span>
                  <span className="font-semibold text-emerald-600">
                    Marge : +{formatXOF(margeBrute)}
                  </span>
                </div>

                <button
                  onClick={() => setPlatSelectionne(plat)}
                  className="w-full mt-2 py-1.5 text-xs font-semibold rounded-lg bg-surface-muted hover:bg-surface-border transition text-foreground flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Fiche Technique & Déstockage
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL FICHE TECHNIQUE RECETTE */}
      {platSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="border-b border-surface-border pb-3">
              <span className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">
                Fiche Technique Culinaire
              </span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                {platSelectionne.nom}
              </h3>
              <p className="text-xs text-foreground-muted mt-1">
                Catégorie : {platSelectionne.categorie} • Déstockage automatique à chaque commande POS
              </p>
            </div>

            {/* Ingrédients */}
            <div>
              <h4 className="text-xs font-bold uppercase text-foreground-muted mb-2">
                Nomenclature des ingrédients (pour 1 portion)
              </h4>
              <div className="bg-surface-muted/40 rounded-xl border border-surface-border divide-y divide-surface-border text-xs">
                {platSelectionne.ingredients.map((ing, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground block">
                        {ing.nom}
                      </span>
                      <span className="text-foreground-muted">
                        Grammage : {ing.quantite}
                      </span>
                    </div>
                    <span className="font-bold text-foreground">
                      {formatXOF(ing.coutUnitaire)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilan financier de la recette */}
            <div className="p-4 rounded-xl bg-surface-muted/70 border border-surface-border grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-foreground-muted block text-[10px] uppercase">
                  Coût Ingrédients
                </span>
                <span className="font-bold text-sm text-foreground">
                  {formatXOF(platSelectionne.coutMatiere)}
                </span>
              </div>
              <div>
                <span className="text-foreground-muted block text-[10px] uppercase">
                  Prix Carte TTC
                </span>
                <span className="font-bold text-sm text-[var(--accent)]">
                  {formatXOF(platSelectionne.prixVente)}
                </span>
              </div>
              <div>
                <span className="text-foreground-muted block text-[10px] uppercase">
                  Marge Brute
                </span>
                <span className="font-bold text-sm text-emerald-600">
                  +{formatXOF(platSelectionne.prixVente - platSelectionne.coutMatiere)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setPlatSelectionne(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setSuccesMsg("Fiche recette actualisée avec l'Économat.");
                  setPlatSelectionne(null);
                  setTimeout(() => setSuccesMsg(null), 3000);
                }}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
              >
                Enregistrer la Fiche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOUVEAU PLAT */}
      {modalNouveauPlat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">Ajouter un plat au menu</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalNouveauPlat(false);
                setSuccesMsg("Nouveau plat ajouté à la carte.");
                setTimeout(() => setSuccesMsg(null), 3000);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Nom du plat / cocktail *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Pavé de Thiof braisé aux herbes"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Catégorie
                </label>
                <select className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border">
                  <option value="Plats Signature">Plats Signature</option>
                  <option value="Entrées">Entrées</option>
                  <option value="Grillades & Poissons">Grillades & Poissons</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Cocktails Bar">Cocktails Bar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">
                    Prix de vente TTC (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">
                    Coût matière estimé (FCFA)
                  </label>
                  <input
                    type="number"
                    placeholder="4000"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Description / Ingrédients clés
                </label>
                <textarea
                  rows={2}
                  placeholder="Garniture, assaisonnement, allergènes éventuels..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalNouveauPlat(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                >
                  Créer la Recette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
