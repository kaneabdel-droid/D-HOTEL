import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Hotel,
  Sparkles,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function AbonnementHotelDashboardPage() {
  const plans = [
    {
      id: "auberge",
      nom: "Auberge & Campement",
      prixMensuel: "15 000",
      prixAnnuel: "162 000",
      mensuelEquivalent: "13 500",
      remise: "-10%",
      desc: "Idéal pour les auberges de charme, campements villageois, écolodges et résidences touristiques.",
      fonctionnalites: [
        "PMS complet (Planning d'occupation des chambres & cases)",
        "Check-in & Check-out express avec assignation des clés",
        "Fiches de police conformes Ministère de l'Intérieur",
        "Folio de séjour & Facturation proforma / définitive",
        "Encaissement Wave, Orange Money, Espèces & Carte",
        "Statut ménage et gouvernance basique",
        "Mode PWA résilient utilisable hors-ligne",
        "Support WhatsApp réactif 7j/7",
      ],
      populaire: false,
    },
    {
      id: "hotel",
      nom: "Hôtel & Résidence",
      prixMensuel: "20 000",
      prixAnnuel: "216 000",
      mensuelEquivalent: "18 000",
      remise: "-10%",
      desc: "Solution intégrée tout-en-un pour hôtels d'affaires, résidences meublées et complexes balnéaires.",
      fonctionnalites: [
        "Tout ce qui est inclus dans Auberge & Campement",
        "Caisse Tactile Restaurant, Bar & Pool (Touch POS)",
        "Transfert direct des consommations F&B sur la note de chambre",
        "Gouvernance mobile complète (Housekeeping smartphone)",
        "Salles de séminaires, mariages & événements MICE",
        "Billetterie piscine & Day-Pass visiteurs externes",
        "Économat & gestion des stocks matières premières et boissons",
        "Audit de nuit & Main courante journalière automatisée",
        "Export comptable SYSCOHADA certifié",
        "Assistance prioritaire 24/7 au paramétrage",
      ],
      populaire: true,
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Hotel className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Gestion de l&apos;Abonnement D-HOTEL
            </h1>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            Consultez votre formule active, renouvelez votre licence ou passez à l&apos;offre supérieure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/221770000000?text=Bonjour,%20je%20souhaite%20renouveler%20mon%20abonnement%20D-HOTEL."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Assistance Facturation WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Bannière Statut Actuel */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/10 via-[var(--surface)] to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Abonnement Actif
            </span>
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Formule Hôtel & Résidence • Période d&apos;essai active
          </h2>
          <p className="text-xs text-[var(--foreground-muted)]">
            Toutes les fonctionnalités (PMS, Touch POS, Fiches de police, Housekeeping, Économat) sont opérationnelles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/221770000000?text=Bonjour,%20je%20souhaite%20payer%20ma%20souscription%20D-HOTEL%20par%20Wave."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all"
          >
            Régler via Wave / Orange Money
          </a>
        </div>
      </div>

      {/* Grille des 2 formules */}
      <div>
        <h3 className="text-base font-bold text-[var(--foreground)] mb-4">
          Forfaits D-HOTEL disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-6 sm:p-8 border flex flex-col justify-between transition-all ${
                p.populaire
                  ? "bg-[var(--surface)] border-amber-500 shadow-xl ring-1 ring-amber-500/30"
                  : "bg-[var(--surface)] border-[var(--surface-border)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-[var(--foreground)]">{p.nom}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    {p.remise} si annuel
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mb-6">{p.desc}</p>

                <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--surface-border)] mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-amber-500">
                      {p.mensuelEquivalent}
                    </span>
                    <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                      FCFA / mois
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--foreground-muted)] mt-1">
                    Facturé <strong>{p.prixAnnuel} FCFA / an</strong> ou {p.prixMensuel} FCFA/mois sans engagement.
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] block">
                    Inclus dans ce forfait :
                  </span>
                  <ul className="space-y-2 text-xs text-[var(--foreground)]">
                    {p.fonctionnalites.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--surface-border)]">
                <a
                  href={`https://wa.me/221770000000?text=Bonjour,%20je%20souhaite%20souscrire%20au%20forfait%20D-HOTEL%20${encodeURIComponent(
                    p.nom
                  )}.`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    p.populaire
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-[var(--surface-muted)] hover:bg-slate-800 hover:text-white text-[var(--foreground)] border border-[var(--surface-border)]"
                  }`}
                >
                  <span>Choisir la formule {p.nom}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moyens de Paiement Autorisés */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)] mb-3">
          Règlements acceptés en toute sécurité
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--foreground-muted)]">
          <span className="px-3 py-1.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] font-semibold text-[var(--foreground)]">
            Wave Sénégal
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] font-semibold text-[var(--foreground)]">
            Orange Money
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] font-semibold text-[var(--foreground)]">
            Virement Bancaire (UBA, BOA, CBAO, Ecobank)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] font-semibold text-[var(--foreground)]">
            Cartes Bancaires Visa & Mastercard
          </span>
        </div>
      </div>
    </div>
  );
}
