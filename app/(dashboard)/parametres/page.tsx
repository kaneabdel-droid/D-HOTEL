"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  Hotel,
  ShieldCheck,
  CreditCard,
  Users,
  CheckCircle2,
  Save,
  Smartphone,
  Percent,
  Coins,
  Globe,
  Lock,
  PlusCircle,
  Eye,
  KeyRound,
  Trash2,
  Sparkles,
  QrCode,
  Building,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  CompteMarchandDirect,
  getComptesMarchandsDirects,
  saveComptesMarchandsDirects,
} from "@/lib/paiement-direct-storage";

export default function ParametresHotelPage() {
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Formulaire paramètres
  const [nomHotel, setNomHotel] = useState("Hôtel Teranga Palace 5★");
  const [ninea, setNinea] = useState("009845213 2V9");
  const [rccm, setRccm] = useState("SN.DKR.2024.B.1245");
  const [telephone, setTelephone] = useState("+221 33 800 00 00");
  const [email, setEmail] = useState("direction@terangapalace.sn");
  const [adresse, setAdresse] = useState("Route des Almadies, BP 12000 Dakar");
  const [tauxTva, setTauxTva] = useState(18);
  const [taxeSejour, setTaxeSejour] = useState(1000);
  const [devise, setDevise] = useState("XOF");

  // Encaissements directs sur appareils hôtel (Zéro agrégateur)
  const [comptesDirects, setComptesDirects] = useState<CompteMarchandDirect[]>([]);
  const [modalAjoutCompte, setModalAjoutCompte] = useState(false);
  const [nouveauType, setNouveauType] = useState<'wave' | 'orange_money' | 'tpe_banque' | 'free_money'>('wave');
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauNumero, setNouveauNumero] = useState('');
  const [nouvelleBanque, setNouvelleBanque] = useState('Wave Business Sénégal');
  const [nouveauPointVente, setNouveauPointVente] = useState('Front-Desk & Réception');
  const [nouvellesInstructions, setNouvellesInstructions] = useState('');

  useEffect(() => {
    setComptesDirects(getComptesMarchandsDirects());
  }, []);

  const handleAjouterCompte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauNom || !nouveauNumero) return;
    const nouvelElement: CompteMarchandDirect = {
      id: `cpt-${Date.now()}`,
      type: nouveauType,
      nom: nouveauNom,
      numeroOuCode: nouveauNumero,
      banqueOuOperateur: nouvelleBanque,
      pointDeVente: nouveauPointVente,
      actif: true,
      instructions: nouvellesInstructions || undefined,
    };
    const listeMaj = [...comptesDirects, nouvelElement];
    setComptesDirects(listeMaj);
    saveComptesMarchandsDirects(listeMaj);
    setModalAjoutCompte(false);
    setNouveauNom('');
    setNouveauNumero('');
    setNouvellesInstructions('');
    setSuccesMsg(`Terminal / Compte « ${nouvelElement.nom} » configuré avec succès.`);
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const handleToggleCompte = (id: string) => {
    const maj = comptesDirects.map((c) => (c.id === id ? { ...c, actif: !c.actif } : c));
    setComptesDirects(maj);
    saveComptesMarchandsDirects(maj);
  };

  const handleSupprimerCompte = (id: string) => {
    if (!confirm('Voulez-vous vraiment retirer ce terminal / compte direct ?')) return;
    const maj = comptesDirects.filter((c) => c.id !== id);
    setComptesDirects(maj);
    saveComptesMarchandsDirects(maj);
    setSuccesMsg('Terminal retiré de la configuration.');
    setTimeout(() => setSuccesMsg(null), 3000);
  };

  // Utilisateurs & Rôles
  const [utilisateurs, setUtilisateurs] = useState([
    { nom: "Mamadou Sow", role: "Directeur Général", login: "m.sow", tel: "+221 77 120 00 01", statut: "Actif" },
    { nom: "Fatou Bintou Ndiaye", role: "Chef de Réception", login: "fatou_reception", tel: "+221 77 450 11 22", statut: "Actif" },
    { nom: "Aïssatou Sy", role: "Gouvernante Générale", login: "aissatou_menage", tel: "+221 77 900 77 88", statut: "Actif" },
    { nom: "Cheikh Tidiane Diouf", role: "Chef Cuisinier", login: "cheikh_cuisine", tel: "+221 76 800 55 66", statut: "Actif" },
    { nom: "Babacar Fall", role: "Technicien Maintenance", login: "babacar_tech", tel: "+221 70 333 99 00", statut: "Actif" },
  ]);

  const handleEnregistrer = (e: React.FormEvent) => {
    e.preventDefault();
    saveComptesMarchandsDirects(comptesDirects);
    setSuccesMsg("Paramètres de l'établissement et terminaux de paiement direct enregistrés.");
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Paramètres Généraux de l'Établissement
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Informations fiscales, intégration Maketou (Mobile Money & Cartes) et gestion des accès
          </p>
        </div>

        <button
          onClick={handleEnregistrer}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          Enregistrer les Modifications
        </button>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{succesMsg}</span>
        </div>
      )}

      <form onSubmit={handleEnregistrer} className="space-y-6">
        {/* SECTION 1 : COORDONNÉES ET IDENTITÉ LÉGALE */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
            <Hotel className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-bold text-base text-foreground">
              Identité de l'Hôtel & Mentions Légales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Nom commercial de l'établissement *
              </label>
              <input
                type="text"
                required
                value={nomHotel}
                onChange={(e) => setNomHotel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Numéro d'Identification Fiscale (NINEA) *
              </label>
              <input
                type="text"
                required
                value={ninea}
                onChange={(e) => setNinea(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Registre du Commerce (RCCM)
              </label>
              <input
                type="text"
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Adresse géographique & Ville *
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Téléphone standard Réception *
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                E-mail officiel de contact
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2 : PARAMÈTRES FISCAUX ET DEVISE */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
            <Coins className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-bold text-base text-foreground">
              Paramètres Fiscaux & Monétaires
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Devise de référence par défaut
              </label>
              <select
                value={devise}
                onChange={(e) => setDevise(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-bold"
              >
                <option value="XOF">FCFA (XOF) — Sans décimales</option>
                <option value="EUR">Euro (€ EUR)</option>
                <option value="USD">Dollar ($ USD)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Taux de TVA normal (%)
              </label>
              <input
                type="number"
                value={tauxTva}
                onChange={(e) => setTauxTva(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Taxe de séjour touristique (FCFA par nuit/personne)
              </label>
              <input
                type="number"
                value={taxeSejour}
                onChange={(e) => setTaxeSejour(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3 : TERMINAUX & ENCAISSEMENTS DIRECTS SUR APPAREILS HÔTEL (ZÉRO AGRÉGATEUR) */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span>Terminaux & Comptes d&apos;Encaissement Direct (Zéro Agrégateur)</span>
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    0% Commission • 100% Direct
                  </span>
                </h3>
                <p className="text-xs text-foreground-muted">
                  Évitez les frais de 2% à 3.5% des passerelles en encaissant directement sur les téléphones et TPE de l&apos;établissement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/tresorerie/encaissements-directs"
                className="px-3 py-1.5 rounded-lg border border-surface-border text-xs font-semibold text-foreground hover:bg-surface-muted transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Voir le Journal</span>
              </Link>
              <button
                type="button"
                onClick={() => setModalAjoutCompte(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ajouter un Terminal / Compte</span>
              </button>
            </div>
          </div>

          {/* Bannière explicative d'avantage financier */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
              <p className="font-bold">
                Comment fonctionne l&apos;encaissement direct sans intermédiaire ?
              </p>
              <p className="text-[11px] opacity-90">
                1. <strong>Mobile Money (Wave / Orange Money) :</strong> Le client scanne le QR code marchand officiel de l&apos;hôtel ou compose le code USSD sur place. Le paiement arrive directement sur la carte SIM/compte marchand de l&apos;hôtel.<br />
                2. <strong>Cartes Bancaires (Visa / Mastercard / GIM) :</strong> Le client insère sa carte dans le terminal TPE physique de votre banque (CBAO, SGBS, Ecobank). Vous saisissez le N° d&apos;autorisation/STAN dans D-Hôtel.
              </p>
            </div>
          </div>

          {/* Liste des terminaux configurés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {comptesDirects.map((compte) => (
              <div
                key={compte.id}
                className={`p-4 rounded-xl border transition-all ${compte.actif
                    ? "bg-background border-surface-border shadow-xs"
                    : "bg-surface-muted/30 border-surface-border/60 opacity-60"
                  }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${compte.type === "wave"
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                          : compte.type === "orange_money"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : compte.type === "tpe_banque"
                              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                              : "bg-emerald-500/15 text-emerald-600"
                        }`}
                    >
                      {compte.type === "tpe_banque" ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">
                        {compte.nom}
                      </h4>
                      <p className="text-[11px] text-foreground-muted">
                        {compte.banqueOuOperateur} • {compte.pointDeVente}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleCompte(compte.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition ${compte.actif
                          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                          : "bg-neutral-500/15 text-neutral-600 border border-neutral-500/30"
                        }`}
                    >
                      {compte.actif ? "Actif" : "Inactif"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSupprimerCompte(compte.id)}
                      className="p-1 rounded-md text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                      title="Supprimer ce terminal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-surface-muted/40 p-2 rounded-lg text-xs font-mono space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-foreground-muted font-sans font-medium">
                      {compte.type === "tpe_banque" ? "Identifiant TPE / N° Terminal :" : "N° Marchand / Code Direct :"}
                    </span>
                    <span className="font-black text-foreground">{compte.numeroOuCode}</span>
                  </div>
                  {compte.instructions && (
                    <p className="text-[10px] text-foreground-muted font-sans line-clamp-1">
                      {compte.instructions}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 : UTILISATEURS & ACCÈS TERRAIN */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-bold text-base text-foreground">
                Comptes Utilisateurs & Rôles Terrain (RBAC)
              </h3>
            </div>
            <Link
              href="/personnel"
              className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Ajouter un Collaborateur
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted/60 uppercase font-bold text-foreground-muted border-b border-surface-border">
                <tr>
                  <th className="px-3 py-2">Nom Complet</th>
                  <th className="px-3 py-2">Rôle & Périmètre</th>
                  <th className="px-3 py-2">Identifiant de Connexion</th>
                  <th className="px-3 py-2">Téléphone Mobile</th>
                  <th className="px-3 py-2 text-center">Accès WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {utilisateurs.map((u, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30">
                    <td className="px-3 py-2.5 font-bold text-foreground">
                      {u.nom}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-[var(--accent)]">
                      {u.role}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-foreground-muted">
                      {u.login}
                    </td>
                    <td className="px-3 py-2.5 text-foreground-muted">
                      {u.tel}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                        Lien Magique Actif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>

      {/* ── MODALE AJOUT TERMINAL / COMPTE DIRECT ── */}
      {modalAjoutCompte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-surface text-foreground border border-surface-border rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between shrink-0 bg-surface">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-foreground">
                  Nouveau Terminal / Compte Direct
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAjoutCompte(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-muted transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAjouterCompte} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Type de Terminal / Compte *
                </label>
                <select
                  value={nouveauType}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    setNouveauType(val);
                    if (val === 'wave') {
                      setNouvelleBanque('Wave Business Sénégal');
                      setNouveauNom('Wave Marchand');
                    } else if (val === 'orange_money') {
                      setNouvelleBanque('Orange Money Sénégal');
                      setNouveauNom('Orange Money Marchand');
                    } else if (val === 'tpe_banque') {
                      setNouvelleBanque('CBAO Attijariwafa Bank');
                      setNouveauNom('TPE Bancaire Réception');
                    } else {
                      setNouvelleBanque('Free Money Sénégal');
                      setNouveauNom('Free Money Marchand');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-bold"
                >
                  <option value="wave">Wave Mobile Money (Direct)</option>
                  <option value="orange_money">Orange Money (Code Marchand Direct)</option>
                  <option value="tpe_banque">TPE Bancaire Physique (Visa / Mastercard / GIM)</option>
                  <option value="free_money">Free Money Marchand</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Nom du Terminal / Appareil *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TPE Restaurant SGBS #02"
                  value={nouveauNom}
                  onChange={(e) => setNouveauNom(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  {nouveauType === 'tpe_banque' ? 'N° Série / ID Terminal TPE *' : 'N° Téléphone ou Code Marchand *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={nouveauType === 'tpe_banque' ? 'Ex: TPE-CBAO-9912' : 'Ex: +221 77 000 00 00 ou 584912'}
                  value={nouveauNumero}
                  onChange={(e) => setNouveauNumero(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">
                    Banque ou Opérateur
                  </label>
                  <input
                    type="text"
                    value={nouvelleBanque}
                    onChange={(e) => setNouvelleBanque(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">
                    Point de Vente Rattaché
                  </label>
                  <select
                    value={nouveauPointVente}
                    onChange={(e) => setNouveauPointVente(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border"
                  >
                    <option value="Front-Desk & Réception">Front-Desk & Réception</option>
                    <option value="Restaurant Principal">Restaurant Principal</option>
                    <option value="Bar & Paillote">Bar & Paillote</option>
                    <option value="Room Service">Room Service</option>
                    <option value="Tous Services">Tous Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground-muted block mb-1">
                  Instructions pour le personnel / client (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Taper le montant sur le TPE puis insérer la carte"
                  value={nouvellesInstructions}
                  onChange={(e) => setNouvellesInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalAjoutCompte(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-surface-border hover:bg-surface-muted transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                >
                  Enregistrer le Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
