"use client";

import { useState } from "react";
import {
  Coins,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  Printer,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface CaisseSession {
  id: string;
  nomCaisse: "Caisse Réception Front-Desk" | "Caisse Restaurant Principal" | "Caisse Bar & Paillote" | "Caisse Excursions & Loisirs";
  caissier: string;
  heureOuverture: string;
  fondDeCaisseOuverture: number;
  totalEncaissementsTheorique: number;
  statut: "ouverte" | "cloturee";
  comptageReelPhysique?: number;
  ecart?: number;
}

export default function CaissesTresoreriePage() {
  const [caisses, setCaisses] = useState<CaisseSession[]>([
    {
      id: "1",
      nomCaisse: "Caisse Réception Front-Desk",
      caissier: "Fatou Bintou Ndiaye",
      heureOuverture: "Aujourd'hui 07h00",
      fondDeCaisseOuverture: 150000,
      totalEncaissementsTheorique: 845000,
      statut: "ouverte",
    },
    {
      id: "2",
      nomCaisse: "Caisse Restaurant Principal",
      caissier: "Amadou Sow",
      heureOuverture: "Aujourd'hui 11h30",
      fondDeCaisseOuverture: 100000,
      totalEncaissementsTheorique: 412500,
      statut: "ouverte",
    },
    {
      id: "3",
      nomCaisse: "Caisse Bar & Paillote",
      caissier: "Ousmane Diallo",
      heureOuverture: "Aujourd'hui 10h00",
      fondDeCaisseOuverture: 80000,
      totalEncaissementsTheorique: 215000,
      statut: "ouverte",
    },
    {
      id: "4",
      nomCaisse: "Caisse Excursions & Loisirs",
      caissier: "Ibrahima Touré",
      heureOuverture: "Hier 08h00",
      fondDeCaisseOuverture: 50000,
      totalEncaissementsTheorique: 345000,
      statut: "cloturee",
      comptageReelPhysique: 395000, // 50000 + 345000
      ecart: 0,
    },
  ]);

  const [modalClotureAveugle, setModalClotureAveugle] = useState<CaisseSession | null>(null);
  const [rapportCloture, setRapportCloture] = useState<any | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Coupures de billets et pièces pour comptage aveugle
  const [coupures, setCoupures] = useState<Record<string, number>>({
    b10000: 0,
    b5000: 0,
    b2000: 0,
    b1000: 0,
    b500: 0,
    p500: 0,
    p250: 0,
    p200: 0,
    p100: 0,
    p50: 0,
  });

  const totalPhysiqueCalcule =
    (coupures.b10000 || 0) * 10000 +
    (coupures.b5000 || 0) * 5000 +
    (coupures.b2000 || 0) * 2000 +
    (coupures.b1000 || 0) * 1000 +
    (coupures.b500 || 0) * 500 +
    (coupures.p500 || 0) * 500 +
    (coupures.p250 || 0) * 250 +
    (coupures.p200 || 0) * 200 +
    (coupures.p100 || 0) * 100 +
    (coupures.p50 || 0) * 50;

  const handleValiderClotureAveugle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalClotureAveugle) return;

    const theoriqueAttendu =
      modalClotureAveugle.fondDeCaisseOuverture +
      modalClotureAveugle.totalEncaissementsTheorique;
    const difference = totalPhysiqueCalcule - theoriqueAttendu;

    const miseAJour: CaisseSession = {
      ...modalClotureAveugle,
      statut: "cloturee",
      comptageReelPhysique: totalPhysiqueCalcule,
      ecart: difference,
    };

    setCaisses((prev) =>
      prev.map((c) => (c.id === modalClotureAveugle.id ? miseAJour : c))
    );

    setRapportCloture({
      ...miseAJour,
      theoriqueAttendu,
      difference,
      dateCloture: "24/10/2026 à 15:45",
    });

    setModalClotureAveugle(null);
    setSuccesMsg(
      `Clôture effectuée pour ${miseAJour.nomCaisse}. Écart constaté : ${
        difference === 0
          ? "Parfait (0 FCFA)"
          : difference > 0
          ? `+${formatXOF(difference)} (Surplus)`
          : `${formatXOF(difference)} (Manquant)`
      }`
    );
    setTimeout(() => setSuccesMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Gestion Multi-Caisses & Clôture Aveugle
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Procédure de double contrôle anti-fraude avec comptage physique coupure par coupure
          </p>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Cartouche d'explication de la clôture aveugle */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-foreground">
            Principe du Comptage Aveugle (Standard Hôtelier de Sécurité)
          </p>
          <p className="text-foreground-muted">
            Le caissier ne voit pas le montant théorique calculé par le système lors de sa clôture. Il dénombre physiquement chaque coupure de billet et pièce. L'écart (manquant ou excédent) n'apparaît qu'après validation irréversible et contresignature de la direction.
          </p>
        </div>
      </div>

      {/* Grille des 4 sessions de caisse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caisses.map((caisse) => {
          const estOuverte = caisse.statut === "ouverte";

          return (
            <div
              key={caisse.id}
              className="p-5 rounded-2xl bg-surface border border-surface-border hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg ${
                        estOuverte
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-surface-muted text-foreground-muted"
                      }`}
                    >
                      {estOuverte ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </span>
                    <h3 className="font-bold text-base text-foreground">
                      {caisse.nomCaisse}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      estOuverte
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-surface-muted text-foreground-muted"
                    }`}
                  >
                    {caisse.statut}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-foreground-muted pt-2 border-t border-surface-border">
                  <div>
                    <span className="block text-foreground-muted">Opérateur de caisse :</span>
                    <strong className="text-foreground">{caisse.caissier}</strong>
                  </div>
                  <div>
                    <span className="block text-foreground-muted">Ouverture :</span>
                    <strong className="text-foreground">{caisse.heureOuverture}</strong>
                  </div>
                  <div>
                    <span className="block text-foreground-muted">Fond de caisse :</span>
                    <strong className="text-foreground">{formatXOF(caisse.fondDeCaisseOuverture)}</strong>
                  </div>
                  <div>
                    <span className="block text-foreground-muted">Encaissements du shift :</span>
                    <strong className="text-emerald-600">{formatXOF(caisse.totalEncaissementsTheorique)}</strong>
                  </div>
                </div>

                {!estOuverte && caisse.ecart !== undefined && (
                  <div className="p-3 rounded-xl bg-surface-muted/60 border border-surface-border text-xs flex items-center justify-between">
                    <div>
                      <span className="text-foreground-muted block">Comptage physique réel :</span>
                      <strong className="text-foreground text-sm">
                        {formatXOF(caisse.comptageReelPhysique || 0)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-foreground-muted block">Écart de caisse :</span>
                      <span
                        className={`font-black text-sm ${
                          caisse.ecart === 0
                            ? "text-emerald-600"
                            : caisse.ecart > 0
                            ? "text-blue-600"
                            : "text-rose-600"
                        }`}
                      >
                        {caisse.ecart === 0
                          ? "✓ Écart Nul"
                          : caisse.ecart > 0
                          ? `+${formatXOF(caisse.ecart)}`
                          : formatXOF(caisse.ecart)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-end">
                {estOuverte ? (
                  <button
                    onClick={() => {
                      setCoupures({
                        b10000: 0,
                        b5000: 0,
                        b2000: 0,
                        b1000: 0,
                        b500: 0,
                        p500: 0,
                        p250: 0,
                        p200: 0,
                        p100: 0,
                        p50: 0,
                      });
                      setModalClotureAveugle(caisse);
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95 transition flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Procéder à la Clôture Aveugle
                  </button>
                ) : (
                  <button
                    onClick={() => setRapportCloture({
                      ...caisse,
                      theoriqueAttendu: caisse.fondDeCaisseOuverture + caisse.totalEncaissementsTheorique,
                      difference: caisse.ecart || 0,
                      dateCloture: "Clôturé",
                    })}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-surface-muted text-foreground hover:bg-surface-border transition flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Voir le Billet de Clôture
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CLÔTURE AVEUGLE : SAISIE DES COUPURES */}
      {modalClotureAveugle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full p-6 space-y-4 my-8 animate-scale-up">
            <div className="border-b border-surface-border pb-3">
              <span className="text-xs text-foreground-muted uppercase font-bold tracking-wider">
                Contrôle de Caisse
              </span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                Clôture Aveugle : {modalClotureAveugle.nomCaisse}
              </h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                Caissier : <strong>{modalClotureAveugle.caissier}</strong> • Comptabilisez chaque billet et pièce dans le tiroir-caisse.
              </p>
            </div>

            <form onSubmit={handleValiderClotureAveugle} className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-foreground-muted uppercase mb-2">
                  Billets de Banque (FCFA)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: "b10000", libelle: "10 000 FCFA", val: 10000 },
                    { key: "b5000", libelle: "5 000 FCFA", val: 5000 },
                    { key: "b2000", libelle: "2 000 FCFA", val: 2000 },
                    { key: "b1000", libelle: "1 000 FCFA", val: 1000 },
                    { key: "b500", libelle: "500 FCFA", val: 500 },
                  ].map((b) => (
                    <div key={b.key} className="flex items-center justify-between p-2 rounded-lg bg-surface-muted/50 border border-surface-border">
                      <span className="font-semibold text-foreground">{b.libelle}</span>
                      <input
                        type="number"
                        min="0"
                        value={coupures[b.key] || ""}
                        placeholder="0"
                        onChange={(e) =>
                          setCoupures({ ...coupures, [b.key]: Number(e.target.value) })
                        }
                        className="w-16 px-2 py-1 text-center font-bold text-xs rounded bg-surface border border-surface-border"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground-muted uppercase mb-2">
                  Pièces de Monnaie (FCFA)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: "p500", libelle: "Pièce 500 F", val: 500 },
                    { key: "p250", libelle: "Pièce 250 F", val: 250 },
                    { key: "p200", libelle: "Pièce 200 F", val: 200 },
                    { key: "p100", libelle: "Pièce 100 F", val: 100 },
                    { key: "p50", libelle: "Pièce 50 F", val: 50 },
                  ].map((p) => (
                    <div key={p.key} className="flex items-center justify-between p-2 rounded-lg bg-surface-muted/50 border border-surface-border">
                      <span className="font-semibold text-foreground">{p.libelle}</span>
                      <input
                        type="number"
                        min="0"
                        value={coupures[p.key] || ""}
                        placeholder="0"
                        onChange={(e) =>
                          setCoupures({ ...coupures, [p.key]: Number(e.target.value) })
                        }
                        className="w-16 px-2 py-1 text-center font-bold text-xs rounded bg-surface border border-surface-border"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Compté en direct (sans montrer le théorique) */}
              <div className="p-4 rounded-xl bg-surface-muted/80 border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-foreground-muted block font-medium">
                    Total physique compté par le caissier :
                  </span>
                  <span className="text-lg font-black text-foreground">
                    {formatXOF(totalPhysiqueCalcule)}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-foreground-muted">
                  [Théorique masqué 🔒]
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalClotureAveugle(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:bg-surface-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95"
                >
                  Valider la Clôture & Comparer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RAPPORT OFFICIEL DE CLÔTURE */}
      {rapportCloture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="border-b border-surface-border pb-3 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground-muted">
                HÔTEL TERANGA PALACE 5★
              </span>
              <h3 className="text-lg font-black text-foreground mt-1">
                TICKET DE CLÔTURE DE CAISSE
              </h3>
              <p className="text-xs text-foreground-muted">
                {rapportCloture.nomCaisse} • {rapportCloture.dateCloture}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-foreground-muted">Opérateur de caisse :</span>
                <span className="font-bold text-foreground">{rapportCloture.caissier}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-foreground-muted">Fond de caisse initial :</span>
                <span className="font-bold text-foreground">{formatXOF(rapportCloture.fondDeCaisseOuverture)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-foreground-muted">Encaissements théoriques :</span>
                <span className="font-bold text-foreground">{formatXOF(rapportCloture.totalEncaissementsTheorique)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/50">
                <span className="text-foreground-muted">Solde théorique attendu :</span>
                <span className="font-bold text-foreground">{formatXOF(rapportCloture.theoriqueAttendu)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-border/50 bg-surface-muted/50 px-2 rounded">
                <span className="font-bold text-foreground">Comptage physique réel :</span>
                <span className="font-black text-sm text-foreground">{formatXOF(rapportCloture.comptageReelPhysique)}</span>
              </div>

              <div className="flex justify-between py-2 items-center">
                <span className="font-bold text-sm text-foreground">Écart de caisse :</span>
                <span
                  className={`text-base font-black ${
                    rapportCloture.difference === 0
                      ? "text-emerald-600"
                      : rapportCloture.difference > 0
                      ? "text-blue-600"
                      : "text-rose-600"
                  }`}
                >
                  {rapportCloture.difference === 0
                    ? "0 FCFA (Conforme)"
                    : rapportCloture.difference > 0
                    ? `+${formatXOF(rapportCloture.difference)} (Excédent)`
                    : `${formatXOF(rapportCloture.difference)} (Manquant)`}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-surface-border grid grid-cols-2 gap-4 text-center text-[10px] text-foreground-muted">
              <div>
                <p>Signature Caissier :</p>
                <div className="h-10 mt-1 border border-dashed border-surface-border rounded flex items-center justify-center font-mono">
                  [Signé]
                </div>
              </div>
              <div>
                <p>Visa Contrôleur Trésorerie :</p>
                <div className="h-10 mt-1 border border-dashed border-surface-border rounded flex items-center justify-center font-mono text-emerald-600">
                  [Validé]
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRapportCloture(null)}
                className="w-full py-2 text-xs font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
              >
                Fermer le Rapport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
