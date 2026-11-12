"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  CreditCard,
  Banknote,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  SlidersHorizontal,
  PlusCircle,
  FileText,
  Building,
  RefreshCw,
  Coins,
  ArrowUpRight,
  TrendingUp,
  X,
  Eye,
} from "lucide-react";
import {
  TransactionDirecte,
  getTransactionsDirectes,
  getTotalEconomiesAggregateurs,
  CompteMarchandDirect,
  getComptesMarchandsDirects,
} from "@/lib/paiement-direct-storage";
import { ModalEncaissementDirect } from "@/components/ModalEncaissementDirect";
import { formatXOF } from "@/lib/utils";

export default function EncaissementsDirectsPage() {
  const [transactions, setTransactions] = useState<TransactionDirecte[]>([]);
  const [comptes, setComptes] = useState<CompteMarchandDirect[]>([]);
  const [recherche, setRecherche] = useState("");
  const [filtreMethode, setFiltreMethode] = useState("toutes");
  const [modalEncaissementOuvert, setModalEncaissementOuvert] = useState(false);
  const [transactionAffichee, setTransactionAffichee] = useState<TransactionDirecte | null>(null);
  const [modalTelecollecteOuvert, setModalTelecollecteOuvert] = useState(false);

  useEffect(() => {
    setTransactions(getTransactionsDirectes());
    setComptes(getComptesMarchandsDirects());
  }, []);

  const stats = getTotalEconomiesAggregateurs();

  const totalWave = transactions
    .filter((t) => t.methode === "wave" && t.statut === "valide")
    .reduce((acc, t) => acc + t.montant, 0);

  const totalOm = transactions
    .filter((t) => t.methode === "orange_money" && t.statut === "valide")
    .reduce((acc, t) => acc + t.montant, 0);

  const totalTpe = transactions
    .filter((t) => t.methode === "tpe_carte" && t.statut === "valide")
    .reduce((acc, t) => acc + t.montant, 0);

  const totalCash = transactions
    .filter((t) => t.methode === "especes" && t.statut === "valide")
    .reduce((acc, t) => acc + t.montant, 0);

  const transactionsFiltrees = transactions.filter((t) => {
    const matchMethode = filtreMethode === "toutes" || t.methode === filtreMethode;
    const q = recherche.toLowerCase();
    const matchRecherche =
      !q ||
      t.clientNom.toLowerCase().includes(q) ||
      t.folioOuCommandeRef.toLowerCase().includes(q) ||
      t.referenceExterne.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    return matchMethode && matchRecherche;
  });

  const handlePaiementReussi = (nouvelleTx: TransactionDirecte) => {
    setTransactions(getTransactionsDirectes());
  };

  return (
    <div className="space-y-6">
      {/* ── EN-TÊTE DE PAGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Encaissements Directs sur Appareils Hôtel
              </h1>
              <p className="text-xs text-foreground-muted">
                Zéro agrégateur intermédiaire • 0% de commission prélevée • 100% crédité sur les comptes et TPE de l&apos;hôtel
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalTelecollecteOuvert(true)}
            className="px-3.5 py-2 rounded-xl border border-surface-border text-foreground text-xs font-bold hover:bg-surface-muted transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Télécollecte & Clôture TPE</span>
          </button>

          <button
            type="button"
            onClick={() => setModalEncaissementOuvert(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvel Encaissement Direct</span>
          </button>
        </div>
      </div>

      {/* ── BANNIÈRE ÉCONOMIES & ZÉRO COMMISSION ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border border-emerald-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Économies Réalisées Sans Agrégateur</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {formatXOF(stats.totalEconomise)} préservés sur vos recettes
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            En encaissant directement sur les smartphones de l&apos;hôtel (Wave QR, Orange Money Marchand) et sur vos TPE bancaires physiques (CBAO, SGBS, Ecobank), vous ne payez aucun frais de passerelle tiers (2.5% à 3.5% d&apos;économies directes).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Volume Net Traité
            </span>
            <span className="text-lg font-black text-[#D4AF37]">
              {formatXOF(stats.totalVolumeDirect)}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {stats.nombreTransactions} encaissements certifiés
            </span>
          </div>

          <Link
            href="/parametres"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white flex flex-col items-center justify-center gap-1 text-center text-[10px] font-bold transition"
            title="Gérer les appareils et comptes marchands"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Paramètres Appareils</span>
          </Link>
        </div>
      </div>

      {/* ── KPI DES 4 CANAUX DIRECTS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Wave Direct */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground-muted">Wave Direct Marchand</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{formatXOF(totalWave)}</p>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
            0% commission agrégateur
          </span>
        </div>

        {/* Orange Money Direct */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground-muted">Orange Money Marchand</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{formatXOF(totalOm)}</p>
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block">
            Code Marchand direct
          </span>
        </div>

        {/* TPE Carte Bancaire */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground-muted">TPE Cartes Bancaires</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{formatXOF(totalTpe)}</p>
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full inline-block">
            CBAO / SGBS / Ecobank
          </span>
        </div>

        {/* Espèces Tiroir */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground-muted">Espèces & Cash</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{formatXOF(totalCash)}</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            Tiroirs Caisses physiques
          </span>
        </div>
      </div>

      {/* ── TABLEAU DU JOURNAL DES ENCAISSEMENTS DIRECTS ── */}
      <div className="p-5 rounded-3xl bg-surface border border-surface-border space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
          <div>
            <h3 className="font-bold text-base text-foreground">
              Journal des Règlements Directs Reçus
            </h3>
            <p className="text-xs text-foreground-muted">
              Traçabilité avec identifiants opérateurs (Wave, OM, STAN TPE) et économies constatées
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-foreground-muted" />
              <input
                type="text"
                placeholder="Rechercher réf, client, STAN..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-surface-border bg-white text-xs text-foreground w-48 sm:w-56 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filtre par méthode */}
            <select
              value={filtreMethode}
              onChange={(e) => setFiltreMethode(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-surface-border bg-white text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="toutes">Toutes les méthodes</option>
              <option value="wave">Wave Direct</option>
              <option value="orange_money">Orange Money Direct</option>
              <option value="tpe_carte">TPE Bancaire Carte</option>
              <option value="especes">Espèces</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted/60 text-foreground-muted uppercase tracking-wider text-[10px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-3">Date & Heure</th>
                <th className="py-3 px-3">Réf / Contexte</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Canal & Appareil</th>
                <th className="py-3 px-3">Réf Opérateur / STAN</th>
                <th className="py-3 px-3 text-right">Montant Encaissé</th>
                <th className="py-3 px-3 text-right text-emerald-600">Économie (0% agrégateur)</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {transactionsFiltrees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-foreground-muted">
                    Aucune transaction trouvée pour ces filtres.
                  </td>
                </tr>
              ) : (
                transactionsFiltrees.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-3 px-3 font-medium whitespace-nowrap">
                      <span>{tx.date}</span>
                      <span className="text-[10px] text-foreground-muted block">{tx.heure}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-foreground block">{tx.folioOuCommandeRef}</span>
                      <span className="text-[10px] font-mono text-foreground-muted">{tx.id}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{tx.clientNom}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {tx.methode === "wave" && <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
                        {tx.methode === "orange_money" && (
                          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                        )}
                        {tx.methode === "tpe_carte" && (
                          <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        {tx.methode === "especes" && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                        <span className="font-semibold text-foreground">{tx.terminalOuCompteNom}</span>
                      </div>
                      <span className="text-[10px] text-foreground-muted block">{tx.pointDeVente}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tx.referenceExterne}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-sm text-foreground whitespace-nowrap">
                      {formatXOF(tx.montant)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                      +{formatXOF(tx.fraisAggregateurEconomises)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setTransactionAffichee(tx)}
                        className="p-1.5 rounded-lg bg-surface-muted hover:bg-surface-border text-foreground transition cursor-pointer"
                        title="Voir le reçu certifié"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODALE NOUVEL ENCAISSEMENT DIRECT LIBRE ── */}
      {modalEncaissementOuvert && (
        <ModalEncaissementDirect
          montant={50000}
          clientNom="Client Réception Comptant"
          folioOuCommandeRef="Encaissement Direct Guichet"
          pointDeVente="Front-Desk / Réception"
          caissier="Caissier en service"
          onClose={() => setModalEncaissementOuvert(false)}
          onSuccess={(tx) => {
            handlePaiementReussi(tx);
          }}
        />
      )}

      {/* ── MODALE DÉTAIL / REÇU TRANSACTION DIRECTE ── */}
      {transactionAffichee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white bg-surface text-foreground rounded-3xl border border-surface-border shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base">Reçu d&apos;Encaissement Direct</h3>
              </div>
              <button
                type="button"
                onClick={() => setTransactionAffichee(null)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Réf Interne :</span>
                  <span className="font-mono font-bold">{transactionAffichee.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Heure :</span>
                  <span className="font-semibold">{transactionAffichee.date} à {transactionAffichee.heure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client / Réf :</span>
                  <span className="font-semibold">{transactionAffichee.clientNom} ({transactionAffichee.folioOuCommandeRef})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Point de Vente :</span>
                  <span className="font-semibold">{transactionAffichee.pointDeVente}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950">Mode de Règlement :</span>
                  <span className="font-extrabold text-emerald-700">{transactionAffichee.methodeLibelle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Réf Opérateur / STAN :</span>
                  <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {transactionAffichee.referenceExterne}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                  <span className="font-bold text-base text-slate-900">Total Encaissé Net :</span>
                  <span className="font-black text-xl text-emerald-600">
                    {formatXOF(transactionAffichee.montant)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>Commission d&apos;agrégateur évitée :</span>
                  <span className="font-bold text-emerald-600">+{formatXOF(transactionAffichee.fraisAggregateurEconomises)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-surface-border text-xs font-bold hover:bg-surface-muted transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer le Reçu</span>
              </button>
              <button
                type="button"
                onClick={() => setTransactionAffichee(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALE BORDEREAU DE TÉLÉCOLLECTE & CLÔTURE JOURNALIÈRE TPE ── */}
      {modalTelecollecteOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white bg-surface text-foreground rounded-3xl border border-surface-border shadow-2xl max-w-xl w-full p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-slate-800" />
                <div>
                  <h3 className="font-black text-base">Bordereau de Clôture & Télécollecte TPE</h3>
                  <p className="text-[11px] text-foreground-muted">Rapprochement financier fin de journée</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalTelecollecteOuvert(false)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date du Pointage :</span>
                  <span className="font-bold">{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Établissement :</span>
                  <span className="font-bold">Hôtel Teranga Palace 5★</span>
                </div>
              </div>

              <div className="border border-surface-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted/60 font-bold border-b border-surface-border">
                    <tr>
                      <th className="p-2.5">Canal Direct</th>
                      <th className="p-2.5 text-center">Nbre Trans.</th>
                      <th className="p-2.5 text-right">Montant Encaissé</th>
                      <th className="p-2.5 text-right text-emerald-600">Économies (2.5%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    <tr>
                      <td className="p-2.5 font-bold">Wave Business Direct</td>
                      <td className="p-2.5 text-center font-mono">
                        {transactions.filter((t) => t.methode === "wave").length}
                      </td>
                      <td className="p-2.5 text-right font-black">{formatXOF(totalWave)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">
                        +{formatXOF(Math.round(totalWave * 0.025))}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Orange Money Marchand</td>
                      <td className="p-2.5 text-center font-mono">
                        {transactions.filter((t) => t.methode === "orange_money").length}
                      </td>
                      <td className="p-2.5 text-right font-black">{formatXOF(totalOm)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">
                        +{formatXOF(Math.round(totalOm * 0.025))}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Terminaux TPE Cartes Bancaires</td>
                      <td className="p-2.5 text-center font-mono">
                        {transactions.filter((t) => t.methode === "tpe_carte").length}
                      </td>
                      <td className="p-2.5 text-right font-black">{formatXOF(totalTpe)}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">
                        +{formatXOF(Math.round(totalTpe * 0.025))}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Espèces Physiques</td>
                      <td className="p-2.5 text-center font-mono">
                        {transactions.filter((t) => t.methode === "especes").length}
                      </td>
                      <td className="p-2.5 text-right font-black">{formatXOF(totalCash)}</td>
                      <td className="p-2.5 text-right font-bold text-slate-400">0 FCFA</td>
                    </tr>
                    <tr className="bg-slate-50 font-black">
                      <td className="p-2.5">TOTAL GÉNÉRAL CLÔTURE</td>
                      <td className="p-2.5 text-center font-mono">{transactions.length}</td>
                      <td className="p-2.5 text-right text-sm text-emerald-600">
                        {formatXOF(totalWave + totalOm + totalTpe + totalCash)}
                      </td>
                      <td className="p-2.5 text-right text-sm text-emerald-600">
                        +{formatXOF(stats.totalEconomise)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-black transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer le Bordereau Officiel</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTelecollecteOuvert(false)}
                className="px-4 py-2.5 rounded-xl border border-surface-border text-xs font-semibold text-foreground hover:bg-surface-muted transition"
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
