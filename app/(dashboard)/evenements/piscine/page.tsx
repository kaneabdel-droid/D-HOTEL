"use client";

import { useState } from "react";
import {
  Waves,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Users,
  QrCode,
  Coins,
  Ticket,
  Clock,
  Sparkles,
  Smartphone,
  CreditCard,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface BilletDayPass {
  id: string;
  codePass: string;
  nomVisiteur: string;
  telephone: string;
  typePass: "Pass Adulte" | "Pass Enfant (-12 ans)" | "Day-Pass + Buffet Déjeuner";
  prix: number;
  heureEntree: string;
  moyenPaiement: "Wave Mobile Money" | "Orange Money" | "Espèces" | "Carte Bancaire";
  servietteEmpruntee: boolean;
  cautionRestituee: boolean;
}

export default function PiscineDayPassPage() {
  const [recherche, setRecherche] = useState("");
  const [modalEmission, setModalEmission] = useState(false);
  const [passSelectionne, setPassSelectionne] = useState<BilletDayPass | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire émission
  const [nomClient, setNomClient] = useState("");
  const [telClient, setTelClient] = useState("");
  const [typePass, setTypePass] = useState<BilletDayPass["typePass"]>("Pass Adulte");
  const [modePaiement, setModePaiement] = useState<BilletDayPass["moyenPaiement"]>("Wave Mobile Money");
  const [avecServiette, setAvecServiette] = useState(true);

  const tarifs = {
    "Pass Adulte": 15000,
    "Pass Enfant (-12 ans)": 8000,
    "Day-Pass + Buffet Déjeuner": 28000,
  };

  const jaugeTransats = {
    total: 60,
    occupes: 42,
    disponibles: 18,
  };

  const [billets, setBillets] = useState<BilletDayPass[]>([
    {
      id: "1",
      codePass: "DP-2026-0312",
      nomVisiteur: "M. Cheikh Anta Diop",
      telephone: "+221 77 120 45 67",
      typePass: "Day-Pass + Buffet Déjeuner",
      prix: 28000,
      heureEntree: "10:15",
      moyenPaiement: "Wave Mobile Money",
      servietteEmpruntee: true,
      cautionRestituee: false,
    },
    {
      id: "2",
      codePass: "DP-2026-0313",
      nomVisiteur: "Famille Traoré (2 enfants)",
      telephone: "+221 78 400 88 99",
      typePass: "Pass Enfant (-12 ans)",
      prix: 16000,
      heureEntree: "10:40",
      moyenPaiement: "Orange Money",
      servietteEmpruntee: true,
      cautionRestituee: false,
    },
    {
      id: "3",
      codePass: "DP-2026-0314",
      nomVisiteur: "Mme Clara Dupont",
      telephone: "+33 6 12 34 56 78",
      typePass: "Pass Adulte",
      prix: 15000,
      heureEntree: "11:20",
      moyenPaiement: "Carte Bancaire",
      servietteEmpruntee: true,
      cautionRestituee: false,
    },
  ]);

  const handleEmisePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomClient) return;

    const nouveau: BilletDayPass = {
      id: String(Date.now()),
      codePass: `DP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      nomVisiteur: nomClient,
      telephone: telClient || "+221 77 000 00 00",
      typePass: typePass,
      prix: tarifs[typePass],
      heureEntree: "À l'instant",
      moyenPaiement: modePaiement,
      servietteEmpruntee: avecServiette,
      cautionRestituee: false,
    };

    setBillets([nouveau, ...billets]);
    setModalEmission(false);
    setNomClient("");
    setTelClient("");
    setPassSelectionne(nouveau);
    setSuccesMsg(
      `Day-Pass émis pour ${nouveau.nomVisiteur}. Reçu de paiement et QR Code prêts.`
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const restituerServiette = (id: string) => {
    setBillets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, cautionRestituee: true } : b))
    );
    setSuccesMsg("Serviette restituée. Caution débloquée.");
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  const billetsFiltres = billets.filter(
    (b) =>
      b.nomVisiteur.toLowerCase().includes(recherche.toLowerCase()) ||
      b.codePass.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Billetterie Piscine & Day-Pass
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Gestion des visiteurs extérieurs, forfaits journée, buffet & prêt de serviettes de bain
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalEmission(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Émettre un Day-Pass
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouche Jauge d'occupation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Jauge Transats Piscine</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">
                {jaugeTransats.occupes} / {jaugeTransats.total}
              </span>
              <span className="text-xs font-semibold text-amber-600">
                (70% occupé)
              </span>
            </div>
          </div>
          <Waves className="w-8 h-8 text-blue-500/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Transats Disponibles</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {jaugeTransats.disponibles} places
            </p>
          </div>
          <Users className="w-8 h-8 text-emerald-500/30" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-foreground-muted font-medium">Recettes Day-Pass du Jour</span>
            <p className="text-2xl font-bold text-[var(--accent)] mt-1">
              {formatXOF(billets.reduce((acc, b) => acc + b.prix, 0))}
            </p>
          </div>
          <Coins className="w-8 h-8 text-[var(--accent)]/30" />
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
        <input
          type="text"
          placeholder="Rechercher par nom de visiteur ou code du pass..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-surface border border-surface-border focus:outline-none"
        />
      </div>

      {/* Tableau des billets */}
      <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/60 text-xs font-semibold uppercase text-foreground-muted border-b border-surface-border">
              <tr>
                <th className="px-4 py-3">Code Pass</th>
                <th className="px-4 py-3">Visiteur</th>
                <th className="px-4 py-3">Formule</th>
                <th className="px-4 py-3 text-right">Tarif</th>
                <th className="px-4 py-3">Règlement</th>
                <th className="px-4 py-3">Heure Entrée</th>
                <th className="px-4 py-3 text-center">Serviette de Bain</th>
                <th className="px-4 py-3 text-center">Pass QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {billetsFiltres.map((b) => (
                <tr key={b.id} className="hover:bg-surface-muted/30 transition">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-[var(--accent)]">
                    {b.codePass}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-foreground block">
                      {b.nomVisiteur}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {b.telephone}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {b.typePass}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    {formatXOF(b.prix)}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    {b.moyenPaiement}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted">
                    {b.heureEntree}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {b.cautionRestituee ? (
                      <span className="text-xs font-bold text-emerald-600">
                        ✓ Restituée
                      </span>
                    ) : (
                      <button
                        onClick={() => restituerServiette(b.id)}
                        className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 hover:opacity-90"
                      >
                        En prêt (Restituer)
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setPassSelectionne(b)}
                      className="p-1.5 rounded-lg bg-surface-muted hover:bg-surface-border text-foreground transition inline-flex items-center"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ÉMISSION PASS */}
      {modalEmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold">Émettre un Day-Pass Piscine</h3>
            <form onSubmit={handleEmisePass} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Nom du visiteur / Famille *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: M. Abdoulaye Seck"
                  value={nomClient}
                  onChange={(e) => setNomClient(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Téléphone (pour envoi reçu WhatsApp)
                </label>
                <input
                  type="text"
                  placeholder="+221 77 000 00 00"
                  value={telClient}
                  onChange={(e) => setTelClient(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Formule d'accès
                </label>
                <select
                  value={typePass}
                  onChange={(e) => setTypePass(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                >
                  <option value="Pass Adulte">Pass Adulte — 15 000 FCFA</option>
                  <option value="Pass Enfant (-12 ans)">Pass Enfant (-12 ans) — 8 000 FCFA</option>
                  <option value="Day-Pass + Buffet Déjeuner">Day-Pass + Buffet Déjeuner — 28 000 FCFA</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Moyen d'encaissement direct
                </label>
                <select
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                >
                  <option value="Wave Mobile Money">Wave Mobile Money</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Carte Bancaire">Carte Bancaire</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="serviette"
                  checked={avecServiette}
                  onChange={(e) => setAvecServiette(e.target.checked)}
                  className="rounded text-[var(--primary)]"
                />
                <label htmlFor="serviette" className="text-foreground font-medium">
                  Remise d'une serviette de bain (Caution incluse)
                </label>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/60 flex items-center justify-between text-xs">
                <span className="text-foreground-muted">Montant à encaisser :</span>
                <span className="font-bold text-base text-[var(--primary)]">
                  {formatXOF(tarifs[typePass])}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalEmission(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Encaisser & Émettre le Billet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL QR CODE DU PASS */}
      {passSelectionne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-scale-up">
            <span className="text-xs uppercase font-bold text-foreground-muted tracking-widest block">
              Hôtel Teranga Palace 5★
            </span>
            <h3 className="text-lg font-black text-foreground">
              DAY-PASS PISCINE
            </h3>
            <p className="text-xs font-mono text-[var(--accent)]">
              {passSelectionne.codePass}
            </p>

            {/* Simu QR Code visuel propre */}
            <div className="w-44 h-44 mx-auto border-2 border-surface-border rounded-2xl p-4 flex flex-col items-center justify-center bg-white shadow-inner">
              <QrCode className="w-32 h-32 text-gray-900" />
            </div>

            <div className="text-xs text-foreground-muted space-y-1">
              <p className="font-bold text-foreground text-sm">
                {passSelectionne.nomVisiteur}
              </p>
              <p>{passSelectionne.typePass}</p>
              <p className="text-emerald-600 font-bold">
                ✓ Réglé via {passSelectionne.moyenPaiement} ({formatXOF(passSelectionne.prix)})
              </p>
            </div>

            <button
              onClick={() => setPassSelectionne(null)}
              className="w-full py-2 text-sm font-bold rounded-lg bg-surface-muted text-foreground hover:bg-surface-border"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
