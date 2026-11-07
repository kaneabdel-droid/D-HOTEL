"use client";

import Link from "next/link";
import {
  Hotel,
  TrendingUp,
  Users,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CalendarCheck,
  LogOut,
  LogIn,
  AlertTriangle,
  Clock,
  UtensilsCrossed,
  Compass,
  Building,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export default function DashboardPage() {
  const { t, isRTL } = useTranslation();

  // Données de démonstration réalistes pour un complexe hôtelier haut de gamme
  const kpis = {
    tauxOccupation: 84,
    tauxOccupationDelta: "+6%",
    adr: 68500,
    adrDelta: "+4.2%",
    revpar: 57540,
    revparDelta: "+8.1%",
    caJour: 4120000,
    caJourDelta: "+12.5%",
    arriveesDuJour: 12,
    arriveesEnregistrees: 8,
    departsDuJour: 7,
    departsEffectues: 5,
    clientsPresents: 60,
  };

  const chambresStatuts = {
    total: 46,
    occupees: 34,
    propresLibres: 6,
    enNettoyage: 4,
    maintenance: 2,
  };

  const arrivantsProchains = [
    {
      id: "1",
      client: "M. Ibrahima Diallo",
      chambre: "Suite Junior 201",
      nuits: 3,
      personnes: `2 ${t("dashboard.adults")}`,
      acompte: "Payé (Wave)",
      heure: "14h30",
    },
    {
      id: "2",
      client: "Mme Sophie Martin",
      chambre: "Bungalow Plage 12",
      nuits: 5,
      personnes: `1 ${t("dashboard.adults")}`,
      acompte: "Payé (Carte)",
      heure: "15h00",
    },
    {
      id: "3",
      client: "Délégation Sonatel (8 pers)",
      chambre: "Chambres 104 à 107",
      nuits: 2,
      personnes: `8 ${t("dashboard.adults")}`,
      acompte: "Bon de commande",
      heure: "16h15",
    },
  ];

  const alertesOperationnelles = [
    {
      id: "1",
      titre: "Maintenance urgente : Climatisation Suite 204",
      description: "Fuite d'eau signalée par la gouvernante. Technicien dépêché.",
      type: "urgence",
      heure: "Il y a 15 min",
    },
    {
      id: "2",
      titre: "Séminaire MICE : Salle Baobab à 14h00",
      description: "Mise en place en U pour 25 personnes + pause-café prête.",
      type: "evenement",
      heure: "Aujourd'hui 14h00",
    },
    {
      id: "3",
      titre: "Excursion Réserve de Bandia : 15h30",
      description: "Départ minibus 1 (Guide : Ousmane). 8 inscrits confirmés.",
      type: "loisir",
      heure: "Aujourd'hui 15h30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── BANNIÈRE D'ACCUEIL & ACTIONS RAPIDES ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-[var(--surface-border)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {t("dashboard.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/hebergements/reservations"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("dashboard.new_reservation")}</span>
          </Link>
          <Link
            href="/hebergements/rack"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--surface-border)] text-xs font-semibold shadow-xs transition-colors"
          >
            <Hotel className="w-4 h-4 text-[#D4AF37]" />
            <span>{t("dashboard.gantt_rack")}</span>
          </Link>
          <Link
            href="/restauration/pos"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--surface-border)] text-xs font-semibold shadow-xs transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#3B82F6]" />
            <span>{t("dashboard.restaurant_pos")}</span>
          </Link>
        </div>
      </div>

      {/* ── LES 4 RATIOS CLÉS HÔTELIERS (KPIS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taux d'Occupation */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)] text-xs font-medium">
            <span>{t("dashboard.kpi_occupancy")}</span>
            <Hotel className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              {kpis.tauxOccupation} %
            </span>
            <span className="flex items-center text-xs font-bold text-[#10B981]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.tauxOccupationDelta}
            </span>
          </div>
          <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#3B82F6] h-full rounded-full transition-all"
              style={{ width: `${kpis.tauxOccupation}%` }}
            />
          </div>
        </div>

        {/* Tarif Moyen Journalier (ADR) */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)] text-xs font-medium">
            <span>{t("dashboard.kpi_adr")}</span>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              {formatXOF(kpis.adr)}
            </span>
            <span className="flex items-center text-xs font-bold text-[#10B981]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.adrDelta}
            </span>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)] mt-2">
            {t("dashboard.adr_desc")}
          </p>
        </div>

        {/* RevPAR */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)] text-xs font-medium">
            <span>{t("dashboard.kpi_revpar")}</span>
            <Sparkles className="w-4 h-4 text-[#9E2A2B]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              {formatXOF(kpis.revpar)}
            </span>
            <span className="flex items-center text-xs font-bold text-[#10B981]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.revparDelta}
            </span>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)] mt-2">
            {t("dashboard.revpar_desc")}
          </p>
        </div>

        {/* Chiffre d'Affaires du Jour */}
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--foreground-muted)] text-xs font-medium">
            <span>{t("dashboard.kpi_revenue_today")}</span>
            <Coins className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-[var(--foreground)]">
              {formatXOF(kpis.caJour)}
            </span>
            <span className="flex items-center text-xs font-bold text-[#10B981]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {kpis.caJourDelta}
            </span>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)] mt-2">
            {t("dashboard.ca_today_desc")}
          </p>
        </div>
      </div>

      {/* ── PARC DE CHAMBRES & FLUX RÉCEPTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statut du Parc de Chambres */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--foreground)]">
                {t("dashboard.room_status_overview")}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--foreground-muted)] font-semibold">
                {chambresStatuts.total} {t("dashboard.rooms")}
              </span>
            </div>

            {/* Jauge multicouleur */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--surface-muted)] mb-4">
              <div
                className="bg-[#3B82F6]"
                style={{ width: `${(chambresStatuts.occupees / chambresStatuts.total) * 100}%` }}
                title={t("dashboard.occupied")}
              />
              <div
                className="bg-[#10B981]"
                style={{ width: `${(chambresStatuts.propresLibres / chambresStatuts.total) * 100}%` }}
                title={t("dashboard.free_clean")}
              />
              <div
                className="bg-[#F59E0B]"
                style={{ width: `${(chambresStatuts.enNettoyage / chambresStatuts.total) * 100}%` }}
                title={t("dashboard.cleaning")}
              />
              <div
                className="bg-[#EF4444]"
                style={{ width: `${(chambresStatuts.maintenance / chambresStatuts.total) * 100}%` }}
                title={t("dashboard.maintenance")}
              />
            </div>

            {/* Liste détaillée des statuts */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--foreground)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span>{t("dashboard.occupied")}</span>
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {chambresStatuts.occupees}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--foreground)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span>{t("dashboard.free_clean")}</span>
                </span>
                <span className="font-bold text-[#10B981]">
                  {chambresStatuts.propresLibres}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--foreground)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span>{t("dashboard.cleaning")}</span>
                </span>
                <span className="font-bold text-[#F59E0B]">
                  {chambresStatuts.enNettoyage}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--foreground)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span>{t("dashboard.maintenance")}</span>
                </span>
                <span className="font-bold text-[#EF4444]">
                  {chambresStatuts.maintenance}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/gouvernance"
            className="mt-5 w-full py-2 px-3 text-center text-xs font-semibold rounded-lg border border-[var(--surface-border)] hover:bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors"
          >
            {t("dashboard.housekeeping_btn")}
          </Link>
        </div>

        {/* Mouvements Réception (Arrivées & Départs du Jour) */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--foreground)]">
              {t("dashboard.upcoming_arrivals")}
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                <LogIn className="w-3.5 h-3.5" />
                <span>{kpis.arriveesEnregistrees}/{kpis.arriveesDuJour} {t("dashboard.arrivals")}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#9E2A2B] font-semibold">
                <LogOut className="w-3.5 h-3.5" />
                <span>{kpis.departsEffectues}/{kpis.departsDuJour} {t("dashboard.departures")}</span>
              </span>
            </div>
          </div>

          {/* Tableau des prochains arrivants */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--surface-border)] text-[var(--foreground-muted)]">
                  <th className="pb-2 font-medium">{t("dashboard.client")}</th>
                  <th className="pb-2 font-medium">{t("dashboard.lodging")}</th>
                  <th className="pb-2 font-medium">{t("dashboard.duration_pax")}</th>
                  <th className="pb-2 font-medium">{t("dashboard.deposit_status")}</th>
                  <th className={`pb-2 font-medium ${isRTL ? "text-left" : "text-right"}`}>{t("dashboard.time")}</th>
                  <th className={`pb-2 font-medium ${isRTL ? "text-left" : "text-right"}`}>{t("dashboard.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {arrivantsProchains.map((arr) => (
                  <tr key={arr.id} className="hover:bg-[var(--surface-muted)]/50 transition-colors">
                    <td className="py-2.5 font-semibold text-[var(--foreground)]">
                      {arr.client}
                    </td>
                    <td className="py-2.5 text-[var(--foreground-muted)]">
                      {arr.chambre}
                    </td>
                    <td className="py-2.5 text-[var(--foreground-muted)]">
                      {arr.nuits} {t("dashboard.stay_nights")} • {arr.personnes}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/10 text-[#10B981]">
                        {arr.acompte}
                      </span>
                    </td>
                    <td className={`py-2.5 font-medium text-[var(--foreground)] ${isRTL ? "text-left" : "text-right"}`}>
                      {arr.heure}
                    </td>
                    <td className={`py-2.5 ${isRTL ? "text-left" : "text-right"}`}>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-md bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium text-[11px] transition-colors"
                      >
                        {t("dashboard.checkin")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── ALERTES OPÉRATIONNELLES & AGENDA DES ESPACES / LOISIRS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertes & Incidents en direct */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>{t("dashboard.operational_alerts")}</span>
            </h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white">
              3
            </span>
          </div>

          <div className="space-y-3">
            {alertesOperationnelles.map((alerte) => (
              <div
                key={alerte.id}
                className="p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--surface-border)] space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--foreground)]">
                    {alerte.titre}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-muted)]">
                    {alerte.heure}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  {alerte.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Aperçu rapide des autres départements (F&B, MICE, Loisirs) */}
        <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs lg:col-span-2">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-4">
            {t("dashboard.dept_activity")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Restauration / Bar */}
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--surface-border)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)] mb-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#3B82F6]" />
                  <span>{t("dashboard.restauration_bar")}</span>
                </div>
                <p className="text-lg font-black text-[var(--foreground)]">
                  18 {t("dashboard.active_tables")}
                </p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                  {t("dashboard.pos_ca")} : 1 240 000 FCFA
                </p>
              </div>
              <Link
                href="/restauration/pos"
                className="mt-3 text-[11px] font-semibold text-[#3B82F6] hover:underline"
              >
                {t("dashboard.open_pos")}
              </Link>
            </div>

            {/* MICE & Piscine */}
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--surface-border)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)] mb-2">
                  <Building className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t("dashboard.mice_pool")}</span>
                </div>
                <p className="text-lg font-black text-[var(--foreground)]">
                  34 {t("dashboard.day_pass_sold")}
                </p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                  1 {t("dashboard.ongoing_seminar")}
                </p>
              </div>
              <Link
                href="/evenements/salles"
                className="mt-3 text-[11px] font-semibold text-[#D4AF37] hover:underline"
              >
                {t("dashboard.manage_rooms")}
              </Link>
            </div>

            {/* Excursions & Loisirs */}
            <div className="p-4 rounded-xl bg-[var(--surface-muted)] border border-[var(--surface-border)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)] mb-2">
                  <Compass className="w-4 h-4 text-[#10B981]" />
                  <span>{t("dashboard.leisure_excursions")}</span>
                </div>
                <p className="text-lg font-black text-[var(--foreground)]">
                  2 {t("dashboard.daily_outings")}
                </p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                  14 {t("dashboard.participants")}
                </p>
              </div>
              <Link
                href="/loisirs/excursions"
                className="mt-3 text-[11px] font-semibold text-[#10B981] hover:underline"
              >
                {t("dashboard.excursions_schedule")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
