"use client";

import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ChefHat,
  Eye,
  SlidersHorizontal,
  X,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { loadHotelData, saveHotelData, clearHotelData } from "@/lib/hotel-storage";

interface IngredientFiche {
  nom: string;
  quantite: string;
  coutUnitaire: number;
}

interface PlatMenu {
  id: string;
  nom: string;
  categorie: string;
  prixVente: number;
  coutMatiere: number;
  description: string;
  actif: boolean;
  destockageAutomatique: boolean;
  ingredients: IngredientFiche[];
}

const DEFAULT_PLATS: PlatMenu[] = [
  {
    id: "plat-demo-1",
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
    id: "plat-demo-2",
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
    id: "plat-demo-3",
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
    id: "plat-demo-4",
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
    id: "plat-demo-5",
    nom: "Cocktail Signature : Teranga Sunset Spritz",
    categorie: "Cocktails Bar",
    prixVente: 7500,
    coutMatiere: 1800,
    description: "Liqueur de Bissap infusée aux épices, Prosecco, gin local et zeste de pamplemousse rose.",
    actif: true,
    destockageAutomatique: true,
    ingredients: [
      { nom: "Liqueur de Bissap épicée", quantite: "4cl", coutUnitaire: 700 },
      { nom: "Prosecco DOC", quantite: "8cl", coutUnitaire: 800 },
      { nom: "Gin artisanal local", quantite: "2cl", coutUnitaire: 300 },
    ],
  },
];

export default function CartesMenusPage() {
  const [recherche, setRecherche] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("tous");
  const [platSelectionne, setPlatSelectionne] = useState<PlatMenu | null>(null);
  const [modalNouveauPlat, setModalNouveauPlat] = useState(false);
  const [modalModifierPlat, setModalModifierPlat] = useState<PlatMenu | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire d'ajout
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleCategorie, setNouvelleCategorie] = useState("Plats Signature");
  const [nouveauPrixVente, setNouveauPrixVente] = useState("12000");
  const [nouveauCoutMatiere, setNouveauCoutMatiere] = useState("3500");
  const [nouvelleDesc, setNouvelleDesc] = useState("");

  // Données persistantes
  const [plats, setPlats] = useState<PlatMenu[]>(DEFAULT_PLATS);
  const [isExempleFiligrane, setIsExempleFiligrane] = useState(true);

  useEffect(() => {
    const loaded = loadHotelData<PlatMenu>("dhotel_plats", DEFAULT_PLATS);
    setPlats(loaded.items);
    setIsExempleFiligrane(loaded.isExempleFiligrane);
  }, []);

  const handleAjoutPlat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauNom.trim()) return;

    const nouveau: PlatMenu = {
      id: "plat-" + Date.now(),
      nom: nouveauNom.trim(),
      categorie: nouvelleCategorie,
      prixVente: Number(nouveauPrixVente) || 0,
      coutMatiere: Number(nouveauCoutMatiere) || 0,
      description: nouvelleDesc.trim() || "Préparation maison selon arrivage du jour.",
      actif: true,
      destockageAutomatique: true,
      ingredients: [
        { nom: "Ingrédients principaux", quantite: "Portion", coutUnitaire: Number(nouveauCoutMatiere) || 0 },
      ],
    };

    const updated = isExempleFiligrane ? [nouveau] : [nouveau, ...plats];
    setPlats(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_plats", updated);

    setModalNouveauPlat(false);
    setNouveauNom("");
    setNouvelleDesc("");
    setSuccesMsg(`Article « ${nouveau.nom} » ajouté à la carte.`);
    setTimeout(() => setSuccesMsg(null), 3500);
  };

  const handleModifierPlat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalModifierPlat) return;

    const updated = plats.map((p) =>
      p.id === modalModifierPlat.id ? modalModifierPlat : p
    );
    setPlats(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_plats", updated);

    setModalModifierPlat(null);
    setSuccesMsg(`Article « ${modalModifierPlat.nom} » mis à jour.`);
    setTimeout(() => setSuccesMsg(null), 3500);
  };

  const handleSupprimerPlat = (id: string, nom: string) => {
    if (!window.confirm(`Confirmez-vous le retrait de « ${nom} » de la carte ?`)) {
      return;
    }

    const updated = plats.filter((p) => p.id !== id);
    setPlats(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_plats", updated);

    setSuccesMsg(`Article « ${nom} » supprimé.`);
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  const handleViderExemples = () => {
    if (window.confirm("Voulez-vous vider tous les exemples de menu pour démarrer avec une carte vierge ?")) {
      setPlats([]);
      setIsExempleFiligrane(false);
      clearHotelData("dhotel_plats");
      setSuccesMsg("Carte vidée. Vous pouvez créer vos propres recettes et plats.");
      setTimeout(() => setSuccesMsg(null), 4000);
    }
  };

  const handleConvertirExemples = () => {
    const converted = plats.map((p, i) => ({
      ...p,
      id: "plat-reel-" + (i + 1) + "-" + Date.now(),
    }));
    setPlats(converted);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_plats", converted);
    setSuccesMsg("Les plats d'exemple ont été convertis en recettes réelles modifiables.");
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const categories = [
    "tous",
    "Entrées",
    "Plats Signature",
    "Grillades & Poissons",
    "Desserts Gourmands",
    "Cocktails Bar",
  ];

  const platsFiltres = plats.filter((p) => {
    const matchNom =
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.description.toLowerCase().includes(recherche.toLowerCase());
    const matchCat = categorieFiltre === "tous" || p.categorie === categorieFiltre;
    return matchNom && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Cartes, Menus & Fiches Techniques (Food & Beverage)
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Calcul automatique du Food Cost %, marge brute et déstockage PUMP
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNouveauPlat(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-white hover:opacity-95 shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Ajouter un Plat
          </button>
        </div>
      </div>

      {/* Bannière filigrane sans impact */}
      {isExempleFiligrane && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Recettes d&apos;exemple en filigrane :</strong> Votre établissement ne possède pas encore de carte enregistrée. Ces {plats.length} plats sont affichés à titre indicatif et sans impact. Vous pouvez les modifier, les supprimer ou ajouter vos propres plats réels.
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
            placeholder="Rechercher par nom de plat ou ingrédient..."
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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "tous" ? "Toutes les catégories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Grille des Plats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platsFiltres.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-surface border border-surface-border rounded-2xl text-foreground-muted">
            Aucun article à la carte.
          </div>
        ) : null}

        {platsFiltres.map((plat) => {
          const ratioFoodCost = plat.prixVente > 0 ? Math.round((plat.coutMatiere / plat.prixVente) * 100) : 0;
          const margeBrute = plat.prixVente - plat.coutMatiere;

          return (
            <div
              key={plat.id}
              className={`p-5 rounded-xl bg-surface border border-surface-border hover:shadow-md transition space-y-3 flex flex-col justify-between ${
                isExempleFiligrane ? "opacity-75 border-dashed border-amber-500/40" : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-surface-muted text-foreground-muted">
                      {plat.categorie}
                    </span>
                    {isExempleFiligrane && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        Exemple
                      </span>
                    )}
                  </div>
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
                  <span>Coût matière : {formatXOF(plat.coutMatiere)}</span>
                  <span className="font-semibold text-emerald-600">
                    Marge : +{formatXOF(margeBrute)}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-surface-border/60">
                  <button
                    onClick={() => setPlatSelectionne(plat)}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-surface-muted hover:bg-surface-border transition text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Fiche Tech.
                  </button>
                  <button
                    onClick={() => setModalModifierPlat(plat)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-surface-border/60 hover:bg-surface-border text-foreground transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleSupprimerPlat(plat.id, plat.nom)}
                    className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                    title="Supprimer ce plat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL MODIFIER PLAT */}
      {modalModifierPlat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-lg font-bold">Modifier Article : {modalModifierPlat.nom}</h3>
              <button
                onClick={() => setModalModifierPlat(null)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModifierPlat} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1">Nom du Plat / Boisson *</label>
                <input
                  type="text"
                  required
                  value={modalModifierPlat.nom}
                  onChange={(e) =>
                    setModalModifierPlat({ ...modalModifierPlat, nom: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Catégorie</label>
                <select
                  value={modalModifierPlat.categorie}
                  onChange={(e) =>
                    setModalModifierPlat({ ...modalModifierPlat, categorie: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                >
                  <option value="Entrées">Entrées</option>
                  <option value="Plats Signature">Plats Signature</option>
                  <option value="Grillades & Poissons">Grillades & Poissons</option>
                  <option value="Desserts Gourmands">Desserts Gourmands</option>
                  <option value="Cocktails Bar">Cocktails Bar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Prix Vente (FCFA) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={modalModifierPlat.prixVente}
                    onChange={(e) =>
                      setModalModifierPlat({ ...modalModifierPlat, prixVente: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Coût Matière (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    value={modalModifierPlat.coutMatiere}
                    onChange={(e) =>
                      setModalModifierPlat({ ...modalModifierPlat, coutMatiere: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Description / Ingrédients</label>
                <textarea
                  rows={2}
                  value={modalModifierPlat.description}
                  onChange={(e) =>
                    setModalModifierPlat({ ...modalModifierPlat, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalModifierPlat(null)}
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

      {/* MODAL NOUVEAU PLAT */}
      {modalNouveauPlat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-lg font-bold">Ajouter un Plat / Recette</h3>
              <button
                onClick={() => setModalNouveauPlat(false)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAjoutPlat} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1">Nom du Plat / Boisson *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Brochettes de Capitaine aux Épices"
                  value={nouveauNom}
                  onChange={(e) => setNouveauNom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Catégorie</label>
                <select
                  value={nouvelleCategorie}
                  onChange={(e) => setNouvelleCategorie(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                >
                  <option value="Entrées">Entrées</option>
                  <option value="Plats Signature">Plats Signature</option>
                  <option value="Grillades & Poissons">Grillades & Poissons</option>
                  <option value="Desserts Gourmands">Desserts Gourmands</option>
                  <option value="Cocktails Bar">Cocktails Bar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Prix Vente (FCFA) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={nouveauPrixVente}
                    onChange={(e) => setNouveauPrixVente(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Coût Matière estimé</label>
                  <input
                    type="number"
                    min="0"
                    value={nouveauCoutMatiere}
                    onChange={(e) => setNouveauCoutMatiere(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Garniture, cuisson, allergènes..."
                  value={nouvelleDesc}
                  onChange={(e) => setNouvelleDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalNouveauPlat(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-95"
                >
                  Ajouter à la carte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FICHE TECHNIQUE */}
      {platSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface text-foreground rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-surface-border">
              <div>
                <span className="text-xs uppercase font-bold text-foreground-muted">
                  {platSelectionne.categorie}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  {platSelectionne.nom}
                </h3>
              </div>
              <button
                onClick={() => setPlatSelectionne(null)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-foreground-muted">{platSelectionne.description}</p>

              <div>
                <h4 className="font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-primary" />
                  Nomenclature & Ingrédients (Déstockage automatique)
                </h4>
                <div className="bg-background rounded-xl border border-surface-border divide-y divide-surface-border">
                  {platSelectionne.ingredients.map((ing, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between">
                      <span className="text-foreground">{ing.nom} ({ing.quantite})</span>
                      <span className="font-mono font-bold text-foreground">{formatXOF(ing.coutUnitaire)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted/50 border border-surface-border flex justify-between items-center">
                <div>
                  <span className="text-foreground-muted block">Coût de revient :</span>
                  <span className="font-bold text-sm text-foreground">{formatXOF(platSelectionne.coutMatiere)}</span>
                </div>
                <div className="text-right">
                  <span className="text-foreground-muted block">Prix de vente TTC :</span>
                  <span className="font-bold text-sm text-foreground">{formatXOF(platSelectionne.prixVente)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-surface-border">
              <button
                onClick={() => setPlatSelectionne(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:opacity-90 transition"
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
