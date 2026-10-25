"use client";

import { useState } from "react";
import {
  Wine,
  Sparkles,
  Search,
  PlusCircle,
  CheckCircle2,
  Hotel,
  Layers,
  Coins,
  ArrowRight,
  Shirt,
  PackageCheck,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface ConsoMinibar {
  id: string;
  chambre: string;
  client: string;
  article: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
  dateHeure: string;
  agentMenage: string;
  statutFolio: "impute" | "en_attente";
}

interface ArticleLingerie {
  id: string;
  article: string;
  stockPropre: number;
  stockChambres: number;
  enBlanchisserie: number;
  seuilAlerte: number;
}

export default function MinibarLingeriePage() {
  const [onglet, setOnglet] = useState<"minibar" | "lingerie">("minibar");
  const [recherche, setRecherche] = useState("");
  const [modalSaisieMinibar, setModalSaisieMinibar] = useState(false);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire saisie
  const [chambreSaisie, setChambreSaisie] = useState("101");
  const [articleSaisi, setArticleSaisi] = useState("Gazelle 33cl");
  const [quantiteSaisie, setQuantiteSaisie] = useState(2);

  const tarifsArticles: Record<string, number> = {
    "Gazelle 33cl (Bière locale)": 2500,
    "Flag Spéciale 33cl": 2500,
    "Coca-Cola / Sprite 33cl": 2000,
    "Eau Minérale Kirène 1.5L": 1500,
    "Jus de Bissap Artisanal": 2000,
    "Pringles Original": 3000,
    "Chocolat Noir & Noix de Cajou": 3500,
    "Demi-bouteille Champagne Brut": 28000,
  };

  const [consommations, setConsommations] = useState<ConsoMinibar[]>([
    {
      id: "1",
      chambre: "Chambre 101",
      client: "M. Ibrahima Diop",
      article: "Gazelle 33cl (Bière locale)",
      quantite: 2,
      prixUnitaire: 2500,
      montantTotal: 5000,
      dateHeure: "24/10/2026 11:20",
      agentMenage: "Fatou Ndiaye",
      statutFolio: "impute",
    },
    {
      id: "2",
      chambre: "Bungalow Plage 12",
      client: "Mme Sophie Martin",
      article: "Demi-bouteille Champagne Brut",
      quantite: 1,
      prixUnitaire: 28000,
      montantTotal: 28000,
      dateHeure: "24/10/2026 10:45",
      agentMenage: "Aïssatou Sy",
      statutFolio: "impute",
    },
    {
      id: "3",
      chambre: "Suite Junior 201",
      client: "M. Amadou Tidiane Ba",
      article: "Jus de Bissap Artisanal",
      quantite: 2,
      prixUnitaire: 2000,
      montantTotal: 4000,
      dateHeure: "24/10/2026 09:30",
      agentMenage: "Fatou Ndiaye",
      statutFolio: "impute",
    },
    {
      id: "4",
      chambre: "Chambre 103",
      client: "Dr. K. Ndiaye",
      article: "Eau Minérale Kirène 1.5L",
      quantite: 1,
      prixUnitaire: 1500,
      montantTotal: 1500,
      dateHeure: "23/10/2026 16:15",
      agentMenage: "Mariama Diallo",
      statutFolio: "impute",
    },
  ]);

  const [stockLingerie, setStockLingerie] = useState<ArticleLingerie[]>([
    {
      id: "1",
      article: "Draps King Size (Coton d'Égypte)",
      stockPropre: 48,
      stockChambres: 46,
      enBlanchisserie: 32,
      seuilAlerte: 30,
    },
    {
      id: "2",
      article: "Taies d'Oreiller",
      stockPropre: 110,
      stockChambres: 92,
      enBlanchisserie: 64,
      seuilAlerte: 50,
    },
    {
      id: "3",
      article: "Draps de Bain Éponge 600g",
      stockPropre: 65,
      stockChambres: 92,
      enBlanchisserie: 55,
      seuilAlerte: 40,
    },
    {
      id: "4",
      article: "Serviettes Mains",
      stockPropre: 70,
      stockChambres: 92,
      enBlanchisserie: 42,
      seuilAlerte: 35,
    },
    {
      id: "5",
      article: "Peignoirs Palace Brodés",
      stockPropre: 18,
      stockChambres: 28,
      enBlanchisserie: 14,
      seuilAlerte: 20,
    },
    {
      id: "6",
      article: "Serviettes de Plage / Piscine",
      stockPropre: 35,
      stockChambres: 50,
      enBlanchisserie: 45,
      seuilAlerte: 30,
    },
  ]);

  const handleAjoutConso = (e: React.FormEvent) => {
    e.preventDefault();
    const prix = tarifsArticles[articleSaisi] || 2500;
    const nouvelle: ConsoMinibar = {
      id: String(Date.now()),
      chambre: `Chambre ${chambreSaisie}`,
      client: "Client en séjour",
      article: articleSaisi,
      quantite: quantiteSaisie,
      prixUnitaire: prix,
      montantTotal: prix * quantiteSaisie,
      dateHeure: "Aujourd'hui à l'instant",
      agentMenage: "Gouvernance",
      statutFolio: "impute",
    };

    setConsommations([nouvelle, ...consommations]);
    setModalSaisieMinibar(false);
    setSuccesMsg(
      `${quantiteSaisie}x ${articleSaisi} imputé(s) instantanément sur le Folio de la Chambre ${chambreSaisie} (${formatXOF(
        nouvelle.montantTotal
      )}).`
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wine className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Minibar & Lingerie
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Imputation automatique des boissons en chambre & rotation des stocks de linge
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalSaisieMinibar(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Saisie Conso Minibar
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Onglets */}
      <div className="flex border-b border-surface-border gap-6">
        <button
          onClick={() => setOnglet("minibar")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            onglet === "minibar"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Wine className="w-4 h-4" />
          Consommations Minibar Imputées ({consommations.length})
        </button>
        <button
          onClick={() => setOnglet("lingerie")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            onglet === "lingerie"
              ? "border-[var(--primary)] text-[var(--primary)]"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Shirt className="w-4 h-4" />
          Lingerie & Blanchisserie ({stockLingerie.length} articles)
        </button>
      </div>

      {/* ONGLET 1 : MINIBAR */}
      {onglet === "minibar" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <div>
                <span className="font-bold text-foreground block">
                  Synchronisation automatique avec le Folio Hébergement
                </span>
                <span className="text-foreground-muted">
                  Dès qu'une femme de chambre pointe une consommation, la ligne est ajoutée sur la facture du client sans ressaisie réception.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
                  <tr>
                    <th className="px-4 py-3">Chambre</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Article Consommé</th>
                    <th className="px-4 py-3 text-center">Quantité</th>
                    <th className="px-4 py-3 text-right">P.U.</th>
                    <th className="px-4 py-3 text-right">Total Facturé</th>
                    <th className="px-4 py-3">Agent & Heure</th>
                    <th className="px-4 py-3 text-center">Folio Séjour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {consommations.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-muted/30">
                      <td className="px-4 py-3 font-bold text-foreground">
                        {c.chambre}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">
                        {c.client}
                      </td>
                      <td className="px-4 py-3 text-foreground-muted">
                        {c.article}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {c.quantite}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground-muted">
                        {formatXOF(c.prixUnitaire)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[var(--primary)]">
                        {formatXOF(c.montantTotal)}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground-muted">
                        <span className="font-medium text-foreground block">
                          {c.agentMenage}
                        </span>
                        <span>{c.dateHeure}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Imputé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 2 : LINGERIE */}
      {onglet === "lingerie" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockLingerie.map((item) => {
              const estAlerte = item.stockPropre <= item.seuilAlerte;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-surface border border-surface-border hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{item.article}</h4>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        Total en circulation :{" "}
                        {item.stockPropre + item.stockChambres + item.enBlanchisserie}{" "}
                        unités
                      </p>
                    </div>
                    {estAlerte && (
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Stock bas
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border text-center">
                    <div className="p-2 rounded bg-surface-muted/60">
                      <span className="text-[10px] uppercase font-semibold text-foreground-muted block">
                        Stock Propre
                      </span>
                      <span
                        className={`text-base font-bold ${
                          estAlerte ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {item.stockPropre}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-surface-muted/60">
                      <span className="text-[10px] uppercase font-semibold text-foreground-muted block">
                        En Chambres
                      </span>
                      <span className="text-base font-bold text-foreground">
                        {item.stockChambres}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-surface-muted/60">
                      <span className="text-[10px] uppercase font-semibold text-foreground-muted block">
                        Blanchisserie
                      </span>
                      <span className="text-base font-bold text-amber-600">
                        {item.enBlanchisserie}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs text-foreground-muted">
                    <span>Seuil de sécurité : {item.seuilAlerte}</span>
                    <button className="text-[var(--primary)] font-semibold hover:underline">
                      Mouvement ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL SAISIE MINIBAR */}
      {modalSaisieMinibar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">Pointer une boisson minibar</h3>
            <form onSubmit={handleAjoutConso} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">
                  Chambre concernée
                </label>
                <select
                  value={chambreSaisie}
                  onChange={(e) => setChambreSaisie(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                >
                  <option value="101">Chambre 101 (M. Ibrahima Diop)</option>
                  <option value="102">Chambre 102 (Mme Awa Sarr)</option>
                  <option value="201">Suite Junior 201 (M. Amadou Tidiane Ba)</option>
                  <option value="B12">Bungalow Plage 12 (Mme Sophie Martin)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">
                  Article consommé
                </label>
                <select
                  value={articleSaisi}
                  onChange={(e) => setArticleSaisi(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                >
                  {Object.entries(tarifsArticles).map(([nom, prix]) => (
                    <option key={nom} value={nom}>
                      {nom} — {formatXOF(prix)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">
                  Quantité consommée
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantiteSaisie}
                  onChange={(e) => setQuantiteSaisie(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/60 text-xs flex justify-between items-center">
                <span className="text-foreground-muted">Total à imputer sur le folio :</span>
                <span className="font-bold text-sm text-[var(--primary)]">
                  {formatXOF((tarifsArticles[articleSaisi] || 2500) * quantiteSaisie)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalSaisieMinibar(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Valider & Imputer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
