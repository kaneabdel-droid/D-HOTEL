import Link from "next/link";
import {
  Hotel,
  BedDouble,
  UtensilsCrossed,
  Sparkles,
  CalendarCheck,
  CreditCard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  FileText,
  Clock,
  Waves,
  Package,
  Layers,
  Phone,
  Mail,
  Zap,
  Play,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "D-HOTEL • Le Logiciel Hôtelier Tout-en-Un d'Afrique de l'Ouest",
  description:
    "PMS hôtelier, Touch POS Restaurant & Bar avec report sur note de chambre, fiches de police dématérialisées, gouvernance ménage mobile et encaissements Wave / Orange Money.",
};

export default function DHotelHomePage() {
  const modules = [
    {
      icon: BedDouble,
      title: "Rack Interactif (Gantt PMS)",
      desc: "Planning visuel drag & drop des chambres, bungalows et suites. Visualisation immédiate des disponibilités, des réservations en cours et des arrivées / départs du jour.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      icon: UtensilsCrossed,
      title: "Touch POS Restaurant, Bar & Pool",
      desc: "Point de vente tactile rapide pour serveurs et barmans. Transfert direct et sécurisé de l'addition sur la note de chambre du client (Folio) en un clic.",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      icon: FileText,
      title: "Fiches de Police en 1 Clic",
      desc: "Conformité stricte avec les exigences du Ministère de l'Intérieur et des services de sécurité. Export PDF instantané du registre journalier des voyageurs sans ressaisie manuscrite.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: Sparkles,
      title: "Gouvernance & Housekeeping Mobile",
      desc: "Application smartphone dédiée aux gouvernantes et femmes de chambre : actualisation en temps réel de l'état des chambres (Propre, Sale, Recouche, Inspection terminée).",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      icon: Waves,
      title: "Billetterie Day-Pass & Piscine",
      desc: "Gestion des entrées et pass journée pour la clientèle extérieure venant profiter de la piscine, de la plage ou des formules déjeuner + baignade avec encaissement Wave / OM.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      icon: Building2,
      title: "Salles de Séminaires & Événements (MICE)",
      desc: "Réservation et facturation des salles de conférence, banquets, réunions d'affaires et mariages avec planification des pauses-café et régies audiovisuelles.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: Package,
      title: "Économat & Stocks Boissons / F&B",
      desc: "Suivi rigoureux des caves à vin, spiritueux, packs d'eau et denrées culinaires avec fiches techniques recettes, déstockage automatique et alertes réapprovisionnement.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      icon: BarChart3,
      title: "Audit de Nuit & Clôture SYSCOHADA",
      desc: "Génération automatique de la main courante journalière, contrôle des caisses (Espèces, Wave, Orange Money, CB) et export comptable normalisé SYSCOHADA.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  const plans = [
    {
      id: "auberge",
      name: "Auberge & Campement",
      type: "Auberges, campements villageois, écolodges & gîtes ruraux",
      mensuel: "15 000",
      annuelMois: "13 500",
      annuelTotal: "162 000",
      remise: "-10%",
      badge: "Formule Écolodge & Campement",
      popular: false,
      features: [
        "PMS complet (Planning des hébergements interactif)",
        "Check-in & Check-out express avec assignation des clés",
        "Fiches de police conformes Ministère de l'Intérieur",
        "Facturation des séjours & Folio client individuel ou groupe",
        "Encaissement Wave, Orange Money, Espèces & Carte",
        "Gouvernance & Statut ménage (Propre / Sale / Recouche)",
        "Résilience hors-ligne (PWA) pour zones reculées",
        "Support réactif WhatsApp & Téléphone 7j/7",
      ],
    },
    {
      id: "hotel",
      name: "Hôtel & Résidence",
      type: "Hôtels d'affaires, résidences hôtelières meublées & resorts",
      mensuel: "20 000",
      annuelMois: "18 000",
      annuelTotal: "216 000",
      remise: "-10%",
      badge: "Recommandé • Solution Complète",
      popular: true,
      features: [
        "Tout ce qui est inclus dans Auberge & Campement",
        "Caisse Tactile Restaurant, Bar & Pool (Touch POS)",
        "Transfert automatique des repas & boissons sur la note de chambre",
        "Gouvernance mobile complète (Housekeeping smartphone)",
        "Module MICE : Salles de séminaires, réunions & mariages",
        "Billetterie piscine & Day-Pass pour clientèle extérieure",
        "Économat & gestion des stocks matières premières et fiches recettes",
        "Audit de nuit automatisé & Main courante journalière",
        "Export et intégration comptable SYSCOHADA certifiée",
        "Assistance personnalisée 24/7 au paramétrage",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
                H
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                  D-HOTEL
                </span>
                <span className="block text-[9px] text-amber-400 font-semibold tracking-widest uppercase">
                  DEMBA Hospitality Suite
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
              <a href="#modules" className="hover:text-amber-400 transition-colors">
                Modules Métier
              </a>
              <Link href="/decouvrir-dhotel" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-400" />
                Démo Interactive
              </Link>
              <Link href="/guide" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Guide d&apos;utilisation
              </Link>
              <Link href="/tarifs" className="hover:text-amber-400 transition-colors">
                Tarifs & Abonnements
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-900 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>PMS Moderne & Touch POS • 0% Commission sur vos réservations</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            La gestion hôtelière d&apos;excellence,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              pensée pour l&apos;Afrique
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
            Planning interactif des chambres, Touch POS Restaurant & Bar avec report instantané sur la note de chambre, fiches de police conformes en 1 clic et encaissements Wave & Orange Money.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <span>Essayer 7 jours gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/decouvrir-dhotel"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span>Tester la démo interactive</span>
            </Link>
            <Link
              href="/guide"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-sm border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Consulter le guide</span>
            </Link>
          </div>

          {/* Quick KPI Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">84%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Taux d&apos;occupation moyen</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-white">0%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Commission intermédiaire</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">1 Clic</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Génération Fiche de Police</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">Wave & OM</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Paiement Mobile Money direct</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Présentation Section */}
      <section id="modules" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            Modules intégrés & sans silos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tout ce dont votre établissement a besoin au quotidien
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            De la réception aux étages, de la cuisine à la piscine, toutes vos opérations communiquent en temps réel sur une plateforme unique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-slate-900/60 border ${m.border} hover:bg-slate-900 transition-all group`}
              >
                <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center ${m.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Demo Banner */}
      <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                Simulateur en ligne
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Testez D-HOTEL directement dans votre navigateur
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Découvrez la vue interactive du rack de chambres, la simulation de séjour client, le transfert de consommations restaurant et l&apos;émission du folio de départ.
              </p>
            </div>
            <Link
              href="/decouvrir-dhotel"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Ouvrir la Démo Interactive</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tarifs & Forfaits Section */}
      <section id="tarifs" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            Tarification transparente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Des forfaits pensés pour votre rentabilité
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Bénéficiez de <strong>-10% de remise</strong> en choisissant le paiement annuel. Sans engagement de durée en formule mensuelle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl p-8 sm:p-10 border flex flex-col justify-between relative transition-all ${
                p.popular
                  ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/50"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {p.remise} si annuel
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">{p.type}</p>

                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                      {p.annuelMois}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">FCFA / mois (annuel)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Soit {p.annuelTotal} FCFA facturés par an</span>
                    <span className="text-slate-500">ou {p.mensuel} F/mois sans engagement</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Inclus dans l&apos;abonnement :
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Link
                  href={`/signup?plan=${p.id}&cycle=yearly`}
                  className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    p.popular
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  Choisir {p.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-center text-[11px] text-slate-500">
                  Essai gratuit 7 jours • Activation immédiate
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/tarifs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline"
          >
            <span>Voir la comparaison détaillée de toutes les fonctionnalités</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Création Établissement Express Section */}
      <section id="creation-etablissement" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                Déploiement Express en 2 Minutes
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Créez votre établissement sur D-HOTEL
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Rejoignez le réseau des réceptifs hôteliers modernes du Sénégal et de la sous-région. Profitez de 7 jours d&apos;essai gratuit avec accompagnement de nos ingénieurs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  1
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Renseignez votre structure</h4>
                <p className="text-slate-400 text-xs">
                  Nom de l&apos;hôtel ou auberge, localisation, nombre de chambres et contact officiel.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  2
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Choisissez votre formule</h4>
                <p className="text-slate-400 text-xs">
                  Auberge & Campement (15k/mois) ou Hôtel & Résidence (20k/mois), mensuel ou annuel (-10%).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  3
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Accès PMS immédiat</h4>
                <p className="text-slate-400 text-xs">
                  Votre rack interactif, caisse restaurant et fiches de police sont immédiatement activés.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
              >
                <span>Créer mon établissement maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guide"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Voir le guide de démarrage</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Callout Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Documentation & Guides
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Guide complet de prise en main pour vos équipes
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Fiches pratiques pour réceptionnistes, gouvernantes, barmans et comptables : check-in express, création de fiches de police, gestion de caisse et audit de nuit.
            </p>
          </div>
          <Link
            href="/guide"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 border border-slate-700 transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Lire le guide d&apos;utilisation</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-sm">
                H
              </div>
              <span className="font-bold text-white text-base">D-HOTEL</span>
              <span className="text-xs text-slate-500">• DEMBA Hospitality Suite</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/decouvrir-dhotel" className="hover:text-white transition-colors">
                Démo Interactive
              </Link>
              <Link href="/guide" className="hover:text-white transition-colors">
                Guide d&apos;utilisation
              </Link>
              <Link href="/tarifs" className="hover:text-white transition-colors">
                Tarifs & Abonnements
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Connexion
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                Créer un compte
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} D-HOTEL • DEMBA Hospitality Management System. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
