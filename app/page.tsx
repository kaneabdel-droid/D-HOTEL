import Link from "next/link";
import {
  BedDouble,
  UtensilsCrossed,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Building2,
  FileText,
  Waves,
  Package,
  Play,
  BookOpen,
} from "lucide-react";
import { getDictionary, getLocale } from "@/dictionaries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const metadata = {
  title: "D-HOTEL • Le Logiciel Hôtelier Tout-en-Un",
  description:
    "PMS hôtelier, Touch POS Restaurant & Bar avec report sur note de chambre, fiches de police dématérialisées, gouvernance ménage mobile et encaissements Wave / Orange Money.",
};

export default async function DHotelHomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const isRtl = locale === "ar";
  const t = dict.landing;

  const modules = [
    {
      icon: BedDouble,
      title: t.modules_items.gantt.title,
      desc: t.modules_items.gantt.desc,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      icon: UtensilsCrossed,
      title: t.modules_items.pos.title,
      desc: t.modules_items.pos.desc,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      icon: FileText,
      title: t.modules_items.police.title,
      desc: t.modules_items.police.desc,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: Sparkles,
      title: t.modules_items.housekeeping.title,
      desc: t.modules_items.housekeeping.desc,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      icon: Waves,
      title: t.modules_items.daypass.title,
      desc: t.modules_items.daypass.desc,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      icon: Building2,
      title: t.modules_items.mice.title,
      desc: t.modules_items.mice.desc,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: Package,
      title: t.modules_items.inventory.title,
      desc: t.modules_items.inventory.desc,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      icon: BarChart3,
      title: t.modules_items.night_audit.title,
      desc: t.modules_items.night_audit.desc,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  const plans = [
    {
      id: "auberge",
      name: t.plans.auberge.name,
      type: t.plans.auberge.type,
      mensuel: "15 000",
      annuelMois: "13 500",
      annuelTotal: "162 000",
      remise: "-10%",
      badge: t.plans.auberge.badge,
      popular: false,
      features: t.plans.auberge.features,
    },
    {
      id: "hotel",
      name: t.plans.hotel.name,
      type: t.plans.hotel.type,
      mensuel: "20 000",
      annuelMois: "18 000",
      annuelTotal: "216 000",
      remise: "-10%",
      badge: t.plans.hotel.badge,
      popular: true,
      features: t.plans.hotel.features,
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
                  {t.suite_name}
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
              <a href="#modules" className="hover:text-amber-400 transition-colors">
                {t.nav_modules}
              </a>
              <Link href="/decouvrir-dhotel" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-400" />
                {t.nav_demo}
              </Link>
              <Link href="/guide" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {t.nav_guide}
              </Link>
              <Link href="/tarifs" className="hover:text-amber-400 transition-colors">
                {t.nav_pricing}
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />

              <Link
                href="/login"
                className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition-colors"
              >
                {t.nav_login}
              </Link>
              <Link
                href="/signup"
                className="text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 shrink-0"
              >
                <span>{t.nav_signup}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
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
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t.hero_badge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            {t.hero_title_prefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              {t.hero_title_highlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
            {t.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <span>{t.hero_cta_trial}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
            <Link
              href="/decouvrir-dhotel"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.hero_cta_demo}</span>
            </Link>
            <Link
              href="/guide"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-sm border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{t.hero_cta_guide}</span>
            </Link>
          </div>

          {/* Quick KPI Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">84%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t.kpi_occupancy}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-white">0%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t.kpi_commission}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{t.kpi_police_val}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t.kpi_police_label}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">{t.kpi_payment_val}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t.kpi_payment_label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Présentation Section */}
      <section id="modules" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            {t.modules_tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.modules_title}
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            {t.modules_subtitle}
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
                {t.demo_tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.demo_title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {t.demo_desc}
              </p>
            </div>
            <Link
              href="/decouvrir-dhotel"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t.demo_cta}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tarifs & Forfaits Section */}
      <section id="tarifs" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            {t.pricing_tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.pricing_title}
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            {t.pricing_subtitle_prefix} <strong>{t.pricing_discount}</strong> {t.pricing_subtitle_suffix}
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
                    {p.remise} {t.pricing_yearly_badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">{p.type}</p>

                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                      {p.annuelMois}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{t.pricing_per_month_yearly}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{t.pricing_billed_prefix} {p.annuelTotal} {t.pricing_billed_suffix}</span>
                    <span className="text-slate-500">{t.pricing_or_monthly_prefix} {p.mensuel} {t.pricing_or_monthly_suffix}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {t.pricing_included_title}
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
                  {t.pricing_choose_prefix} {p.name}
                  <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                </Link>
                <div className="text-center text-[11px] text-slate-500">
                  {t.pricing_trial_badge}
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
            <span>{t.pricing_compare_link}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </section>

      {/* Création Établissement Express Section */}
      <section id="creation-etablissement" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                {t.onboarding_tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.onboarding_title}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                {t.onboarding_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  1
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{t.step1_title}</h4>
                <p className="text-slate-400 text-xs">
                  {t.step1_desc}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  2
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{t.step2_title}</h4>
                <p className="text-slate-400 text-xs">
                  {t.step2_desc}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  3
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{t.step3_title}</h4>
                <p className="text-slate-400 text-xs">
                  {t.step3_desc}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
              >
                <span>{t.onboarding_cta}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
              <Link
                href="/guide"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{t.onboarding_guide}</span>
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
              {t.guide_tag}
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {t.guide_title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              {t.guide_desc}
            </p>
          </div>
          <Link
            href="/guide"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 border border-slate-700 transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.guide_cta}</span>
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
              <span className="text-xs text-slate-500">• {t.suite_name}</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/decouvrir-dhotel" className="hover:text-white transition-colors">
                {t.nav_demo}
              </Link>
              <Link href="/guide" className="hover:text-white transition-colors">
                {t.nav_guide}
              </Link>
              <Link href="/tarifs" className="hover:text-white transition-colors">
                {t.nav_pricing}
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                {t.nav_login}
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                {t.nav_signup}
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {t.footer_copy}
          </div>
        </div>
      </footer>
    </div>
  );
}
