"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  CreditCard,
  Banknote,
  Hotel,
  QrCode,
  CheckCircle2,
  Copy,
  Printer,
  ShieldCheck,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import QRCode from "qrcode";
import {
  CompteMarchandDirect,
  TransactionDirecte,
  getComptesMarchandsDirects,
  enregistrerTransactionDirecte,
} from "@/lib/paiement-direct-storage";
import { formatXOF } from "@/lib/utils";

interface ModalEncaissementDirectProps {
  montant: number;
  clientNom?: string;
  folioOuCommandeRef?: string;
  pointDeVente?: string;
  caissier?: string;
  chambreNumero?: string;
  onClose: () => void;
  onSuccess: (tx: TransactionDirecte) => void;
}

export function ModalEncaissementDirect({
  montant,
  clientNom = "Client Comptant",
  folioOuCommandeRef = "Vente Directe",
  pointDeVente = "Front-Desk & Réception",
  caissier = "Caissier en service",
  chambreNumero,
  onClose,
  onSuccess,
}: ModalEncaissementDirectProps) {
  const [comptes, setComptes] = useState<CompteMarchandDirect[]>([]);
  const [methodeActive, setMethodeActive] = useState<
    "wave" | "orange_money" | "tpe_carte" | "especes" | "chambre"
  >("wave");

  // QR Codes générés en DataURL
  const [waveQrUrl, setWaveQrUrl] = useState<string>("");
  const [omQrUrl, setOmQrUrl] = useState<string>("");

  // Formulaires spécifiques
  const [waveRefTransaction, setWaveRefTransaction] = useState("");
  const [omRefTransaction, setOmRefTransaction] = useState("");
  const [tpeSelectionneId, setTpeSelectionneId] = useState("");
  const [tpeStanAutorisation, setTpeStanAutorisation] = useState("");
  const [tpeReseauCarte, setTpeReseauCarte] = useState("Visa");
  const [tpeDerniersChiffres, setTpeDerniersChiffres] = useState("");

  const [especesMontantRecu, setEspecesMontantRecu] = useState(montant);
  const [chambreImputation, setChambreImputation] = useState(chambreNumero || "101");

  const [copieSucces, setCopieSucces] = useState<string | null>(null);
  const [transactionReussie, setTransactionReussie] = useState<TransactionDirecte | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const loadedComptes = getComptesMarchandsDirects();
    setComptes(loadedComptes);

    // Initialiser le TPE sélectionné
    const premierTpe = loadedComptes.find((c) => c.type === "tpe_banque" && c.actif);
    if (premierTpe) setTpeSelectionneId(premierTpe.id);

    // Générer QR code Wave dynamique avec le montant
    const compteWave = loadedComptes.find((c) => c.type === "wave" && c.actif);
    const waveNum = compteWave?.numeroOuCode || "+221771200000";
    const wavePayload = `https://pay.wave.com/m/${encodeURIComponent(
      waveNum.replace(/\s+/g, "")
    )}?amount=${montant}`;

    QRCode.toDataURL(wavePayload, { width: 220, margin: 1 })
      .then((url) => setWaveQrUrl(url))
      .catch((err) => console.warn("Erreur génération QR Wave:", err));

    // Générer QR code Orange Money
    const compteOm = loadedComptes.find((c) => c.type === "orange_money" && c.actif);
    const omCode = compteOm?.numeroOuCode || "584912";
    const omPayload = `OMPAY:${omCode}:${montant}`;

    QRCode.toDataURL(omPayload, { width: 220, margin: 1 })
      .then((url) => setOmQrUrl(url))
      .catch((err) => console.warn("Erreur génération QR OM:", err));
  }, [montant]);

  const compteWave = comptes.find((c) => c.type === "wave" && c.actif);
  const compteOm = comptes.find((c) => c.type === "orange_money" && c.actif);
  const tpeDisponibles = comptes.filter((c) => c.type === "tpe_banque" && c.actif);
  const compteTpeActuel = tpeDisponibles.find((t) => t.id === tpeSelectionneId) || tpeDisponibles[0];

  const economiesEstimees = Math.round(montant * 0.025); // 2.5% préservés

  const handleCopier = (texte: string, etiquette: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texte);
      setCopieSucces(`Copié : ${etiquette}`);
      setTimeout(() => setCopieSucces(null), 2500);
    }
  };

  const handleValiderPaiement = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);

    let methodeLibelle = "";
    let referenceExterne = "";
    let terminalNom = "";

    if (methodeActive === "wave") {
      if (!waveRefTransaction.trim()) {
        setErreur("Veuillez renseigner le N° de transaction Wave reçu (ex: W-XXXX)");
        return;
      }
      methodeLibelle = "Wave Marchand Direct (0% agrégateur)";
      referenceExterne = waveRefTransaction.trim().toUpperCase();
      terminalNom = compteWave?.nom || "Compte Wave Business Hôtel";
    } else if (methodeActive === "orange_money") {
      if (!omRefTransaction.trim()) {
        setErreur("Veuillez renseigner la référence du SMS Orange Money (ex: MP...)");
        return;
      }
      methodeLibelle = "Orange Money Direct Marchand (0% agrégateur)";
      referenceExterne = omRefTransaction.trim().toUpperCase();
      terminalNom = compteOm?.nom || "Compte OM Marchand Hôtel";
    } else if (methodeActive === "tpe_carte") {
      if (!tpeStanAutorisation.trim()) {
        setErreur("Veuillez saisir le N° d'autorisation (STAN) imprimé sur le ticket TPE.");
        return;
      }
      methodeLibelle = `TPE Carte ${tpeReseauCarte} (${compteTpeActuel?.banqueOuOperateur || "Banque"})`;
      referenceExterne = `STAN: ${tpeStanAutorisation.trim()} ${
        tpeDerniersChiffres ? `[**** ${tpeDerniersChiffres}]` : ""
      }`;
      terminalNom = compteTpeActuel?.nom || "Terminal TPE Bancaire";
    } else if (methodeActive === "especes") {
      if (especesMontantRecu < montant) {
        setErreur("Le montant reçu en espèces doit être supérieur ou égal au montant dû.");
        return;
      }
      methodeLibelle = "Espèces / Cash (Caisse Établissement)";
      referenceExterne = `ESP-${Date.now().toString().slice(-4)}`;
      terminalNom = "Tiroir-Caisse Physique";
    } else if (methodeActive === "chambre") {
      methodeLibelle = `Imputation Note de Chambre ${chambreImputation}`;
      referenceExterne = `FOLIO-CH-${chambreImputation}`;
      terminalNom = "Grand Folio Résident";
    }

    const tx = enregistrerTransactionDirecte({
      montant,
      devise: "XOF",
      methode: methodeActive,
      methodeLibelle,
      referenceExterne,
      terminalOuCompteNom: terminalNom,
      clientNom,
      folioOuCommandeRef,
      pointDeVente,
      caissier,
      notes: `Paiement direct certifié sur appareil établissement. Économie: ${formatXOF(
        economiesEstimees
      )}`,
    });

    setTransactionReussie(tx);
    onSuccess(tx);
  };

  const codeUssdOm = `#144#391*${compteOm?.numeroOuCode || "584912"}*${montant}#`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white bg-surface text-foreground rounded-3xl border border-surface-border shadow-2xl max-w-xl w-full max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* En-tête */}
        <div className="p-4 sm:p-5 border-b border-surface-border flex items-start justify-between shrink-0 bg-surface">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-foreground">
                  Encaissement Direct sur Appareils Hôtel
                </h3>
                <p className="text-[11px] text-foreground-muted font-medium">
                  {folioOuCommandeRef} • {clientNom}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la modale */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Montant & Badge Zéro Agrégateur */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Montant Total à Encaisser
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[#D4AF37] tracking-tight">
                {formatXOF(montant)}
              </p>
            </div>

            <div className="sm:text-right bg-white/10 p-2.5 rounded-xl border border-white/15">
              <div className="flex items-center sm:justify-end gap-1.5 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>0% Commission d&apos;Agrégateur</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Économie directe : <strong className="text-white">+{formatXOF(economiesEstimees)}</strong>
              </p>
            </div>
          </div>

          {copieSucces && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-center font-bold text-xs animate-in fade-in">
              {copieSucces}
            </div>
          )}

          {erreur && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2 font-medium text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erreur}</span>
            </div>
          )}

          {/* Si transaction réussie : Affichage du reçu */}
          {transactionReussie ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-black text-emerald-950">
                  Encaissement Direct Confirmé !
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Fonds crédités directement sur le compte de l&apos;hôtel sans frais intermédiaires.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Réf Interne :</span>
                  <span className="font-mono font-bold">{transactionReussie.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode :</span>
                  <span className="font-semibold">{transactionReussie.methodeLibelle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Réf Opérateur / STAN :</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {transactionReussie.referenceExterne}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Montant Net Encaissé :</span>
                  <span className="font-black text-sm text-slate-900">
                    {formatXOF(transactionReussie.montant)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">Frais d&apos;agrégateur évités :</span>
                  <span className="font-bold text-emerald-600">
                    +{formatXOF(transactionReussie.fraisAggregateurEconomises)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-black transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer le Reçu</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
                >
                  Terminer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleValiderPaiement} className="space-y-4">
              {/* Onglets de sélection du mode de règlement direct */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMethodeActive("wave")}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center gap-1 transition cursor-pointer ${
                    methodeActive === "wave"
                      ? "bg-white text-[#1E3A8A] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Wave QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethodeActive("orange_money")}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center gap-1 transition cursor-pointer ${
                    methodeActive === "orange_money"
                      ? "bg-white text-[#EA580C] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#EA580C]" />
                  <span>Orange M.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethodeActive("tpe_carte")}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center gap-1 transition cursor-pointer ${
                    methodeActive === "tpe_carte"
                      ? "bg-white text-[#0D9488] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#0D9488]" />
                  <span>TPE Carte</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethodeActive("especes")}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center gap-1 transition cursor-pointer ${
                    methodeActive === "especes"
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Espèces</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethodeActive("chambre")}
                  className={`py-2 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center gap-1 transition cursor-pointer ${
                    methodeActive === "chambre"
                      ? "bg-white text-[#B2533E] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  <Hotel className="w-4 h-4 text-[#B2533E]" />
                  <span>Folio Ch.</span>
                </button>
              </div>

              {/* ── 1. ONGLET WAVE DIRECT ── */}
              {methodeActive === "wave" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* QR Code Wave */}
                    <div className="p-2 bg-white rounded-2xl border-2 border-[#1E3A8A]/30 shadow-xs shrink-0 text-center">
                      {waveQrUrl ? (
                        <img
                          src={waveQrUrl}
                          alt="QR Code Wave Marchand"
                          className="w-36 h-36 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-slate-100 flex items-center justify-center rounded-lg">
                          Chargement QR...
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-[#1E3A8A] block mt-1">
                        Scanner avec Wave
                      </span>
                    </div>

                    {/* Instructions Wave */}
                    <div className="space-y-2 flex-1 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          Numéro Marchand Officiel de l&apos;Hôtel
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-black text-slate-900 font-mono">
                            {compteWave?.numeroOuCode || "+221 77 120 00 00"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopier(
                                compteWave?.numeroOuCode || "+221771200000",
                                "Numéro Marchand Wave"
                              )
                            }
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Copier le numéro"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Compte : {compteWave?.nom || "Wave Business Hôtel Teranga"}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                        <p className="font-semibold">Procédure directe sans intermédiaire :</p>
                        <p>1. Le client scanne le QR code ci-contre sur son téléphone.</p>
                        <p>2. Il valide le montant exact de {formatXOF(montant)}.</p>
                        <p>3. Vérifiez la notification reçue sur l&apos;appareil de l&apos;hôtel puis saisissez ci-dessous l&apos;ID Wave.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Identifiant de la Transaction Wave (reçu sur téléphone hôtel) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: W-7894218012 ou W-XXXXXX"
                      value={waveRefTransaction}
                      onChange={(e) => setWaveRefTransaction(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-mono font-bold text-sm text-slate-900 focus:border-[#1E3A8A] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ── 2. ONGLET ORANGE MONEY DIRECT ── */}
              {methodeActive === "orange_money" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* QR Code OM */}
                    <div className="p-2 bg-white rounded-2xl border-2 border-[#EA580C]/30 shadow-xs shrink-0 text-center">
                      {omQrUrl ? (
                        <img
                          src={omQrUrl}
                          alt="QR Code Orange Money"
                          className="w-36 h-36 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-slate-100 flex items-center justify-center rounded-lg">
                          Chargement QR...
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-[#EA580C] block mt-1">
                        Scanner Orange Money
                      </span>
                    </div>

                    {/* Code Marchand OM */}
                    <div className="space-y-2 flex-1 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          Code Marchand Direct de l&apos;Hôtel
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xl font-black text-[#EA580C] font-mono tracking-wider">
                            {compteOm?.numeroOuCode || "584912"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopier(compteOm?.numeroOuCode || "584912", "Code Marchand OM")
                            }
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Copier le code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Compte : {compteOm?.nom || "Orange Money Marchand Hôtel"}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-orange-950 space-y-1">
                        <span className="font-bold block">Syntaxe USSD directe (zéro frais) :</span>
                        <div className="flex items-center justify-between font-mono font-bold text-xs bg-white p-1.5 rounded-lg border border-orange-200">
                          <span>{codeUssdOm}</span>
                          <button
                            type="button"
                            onClick={() => handleCopier(codeUssdOm, "Syntaxe USSD")}
                            className="text-orange-600 hover:underline flex items-center gap-1 text-[10px]"
                          >
                            <Copy className="w-3 h-3" />
                            Copier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Référence SMS de Confirmation Orange Money *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: MP261112.1405.C88194"
                      value={omRefTransaction}
                      onChange={(e) => setOmRefTransaction(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-mono font-bold text-sm text-slate-900 focus:border-[#EA580C] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ── 3. ONGLET TPE CARTE BANCAIRE ── */}
              {methodeActive === "tpe_carte" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Sélectionner le Terminal TPE de l&apos;Hôtel *
                      </label>
                      <select
                        value={tpeSelectionneId}
                        onChange={(e) => setTpeSelectionneId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-semibold bg-white text-slate-900"
                      >
                        {tpeDisponibles.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nom} ({t.banqueOuOperateur})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Réseau Carte</label>
                      <select
                        value={tpeReseauCarte}
                        onChange={(e) => setTpeReseauCarte(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-semibold bg-white text-slate-900"
                      >
                        <option value="Visa">Visa (Internationale & Locale)</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="GIM-UEMOA">Carte GIM-UEMOA</option>
                        <option value="Amex">American Express</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-teal-800">
                      <CreditCard className="w-4 h-4 text-teal-600" />
                      Procédure sur le terminal TPE physique :
                    </p>
                    <p>1. Saisir le montant de <strong>{formatXOF(montant)}</strong> sur le TPE {compteTpeActuel?.numeroOuCode || "de l'hôtel"}.</p>
                    <p>2. Faire insérer ou bipper la carte du client avec son code PIN.</p>
                    <p>3. Récupérer le ticket bancaire imprimé et saisir le N° d&apos;autorisation ci-dessous.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Numéro d&apos;Autorisation / STAN (sur ticket TPE) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ex: AUTH-084921 ou STAN-1402"
                        value={tpeStanAutorisation}
                        onChange={(e) => setTpeStanAutorisation(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-mono font-bold text-sm text-slate-900 focus:border-[#0D9488] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        4 derniers chiffres carte (optionnel)
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="ex: 4242"
                        value={tpeDerniersChiffres}
                        onChange={(e) => setTpeDerniersChiffres(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-mono text-sm text-slate-900 focus:border-[#0D9488] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. ONGLET ESPÈCES ── */}
              {methodeActive === "especes" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Montant Reçu en Espèces *
                      </label>
                      <input
                        type="number"
                        min={montant}
                        step="500"
                        value={especesMontantRecu}
                        onChange={(e) => setEspecesMontantRecu(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-mono font-bold text-base text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                      <span className="text-[11px] text-slate-500 font-bold uppercase">
                        Monnaie à Rendre au Client
                      </span>
                      <p className="text-xl font-black text-emerald-600">
                        {formatXOF(Math.max(0, especesMontantRecu - montant))}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 5. ONGLET IMPUTATION CHAMBRE ── */}
              {methodeActive === "chambre" && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Numéro de Chambre du Résident *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 104, 201, VILLA-2"
                      value={chambreImputation}
                      onChange={(e) => setChambreImputation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-sm text-slate-900 focus:border-[#B2533E] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Le montant de {formatXOF(montant)} sera imputé sur le Folio officiel de la chambre et réglé au moment du check-out.
                  </p>
                </div>
              )}

              {/* Bouton de validation final */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Confirmer l&apos;Encaissement Direct ({formatXOF(montant)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
