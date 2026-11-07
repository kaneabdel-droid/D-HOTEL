"use client";

import { useState } from "react";
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
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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

  // Maketou
  const [maketouStoreId, setMaketouStoreId] = useState("STORE_TERANGA_PALACE_SN");
  const [maketouApiKey, setMaketouApiKey] = useState("mkt_live_98a72b4c1029e84d7281f6");
  const [waveActif, setWaveActif] = useState(true);
  const [omActif, setOmActif] = useState(true);
  const [cbActif, setCbActif] = useState(true);

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
    setSuccesMsg("Paramètres de l'hôtel et configuration Maketou enregistrés.");
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

        {/* SECTION 3 : PASSERELLE DE PAIEMENT MAKETOU */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
            <Smartphone className="w-5 h-5 text-[var(--accent)]" />
            <div>
              <h3 className="font-bold text-base text-foreground">
                Passerelle de Paiement Maketou (Mobile Money & Cartes)
              </h3>
              <p className="text-xs text-foreground-muted">
                Encaissement direct des acomptes de réservation par Wave, Orange Money et CB sans manipulation de cartes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Identifiant Boutique Maketou (Store ID)
              </label>
              <input
                type="text"
                value={maketouStoreId}
                onChange={(e) => setMaketouStoreId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">
                Clé d'API Secrète (Live API Key)
              </label>
              <input
                type="password"
                value={maketouApiKey}
                onChange={(e) => setMaketouApiKey(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-surface-border font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={waveActif}
                onChange={(e) => setWaveActif(e.target.checked)}
                className="rounded text-[var(--primary)]"
              />
              <span className="font-bold text-foreground">Wave Mobile Money (Actif)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={omActif}
                onChange={(e) => setOmActif(e.target.checked)}
                className="rounded text-[var(--primary)]"
              />
              <span className="font-bold text-foreground">Orange Money Sénégal (Actif)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cbActif}
                onChange={(e) => setCbActif(e.target.checked)}
                className="rounded text-[var(--primary)]"
              />
              <span className="font-bold text-foreground">Cartes Bancaires Visa / Mastercard (Actif)</span>
            </label>
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
    </div>
  );
}
