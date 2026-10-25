"use client";

import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Flame,
  ChefHat,
  Filter,
  Check,
  RefreshCw,
  BellRing,
} from "lucide-react";

interface LigneCommandeKDS {
  id: string;
  nom: string;
  quantite: number;
  cuisson?: string;
  accompagnement?: string;
  remarques?: string;
  statut: "en_attente" | "pret";
}

interface TicketKDS {
  id: string;
  numeroTicket: string;
  table: string;
  serveur: string;
  typeService: "Sur Place" | "Terrasse" | "Room-Service" | "Paillote Piscine";
  chambreLiee?: string;
  minutesEcoulees: number;
  heureValidation: string;
  statut: "en_attente" | "en_preparation" | "pret_a_servir";
  articles: LigneCommandeKDS[];
}

export default function KitchenDisplayPage() {
  const [sonActif, setSonActif] = useState(true);
  const [filtreType, setFiltreType] = useState("tous");
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [tickets, setTickets] = useState<TicketKDS[]>([
    {
      id: "1",
      numeroTicket: "KDS-084",
      table: "Table 12",
      serveur: "Amadou (Serveur 2)",
      typeService: "Terrasse",
      minutesEcoulees: 6,
      heureValidation: "12:44",
      statut: "en_preparation",
      articles: [
        {
          id: "a1",
          nom: "Filet de Lotte Grillé au Poivre de Penja",
          quantite: 2,
          accompagnement: "Frites d'igname croustillantes",
          cuisson: "À point",
          statut: "en_attente",
        },
        {
          id: "a2",
          nom: "Carpaccio d'Espadon aux Agrumes",
          quantite: 1,
          remarques: "Sans coriandre",
          statut: "pret",
        },
      ],
    },
    {
      id: "2",
      numeroTicket: "KDS-085",
      table: "Table 04",
      serveur: "Fatoumata (Serveuse 1)",
      typeService: "Sur Place",
      minutesEcoulees: 14,
      heureValidation: "12:36",
      statut: "en_preparation",
      articles: [
        {
          id: "b1",
          nom: "Thieboudienne Royal Penda Mbaye",
          quantite: 3,
          accompagnement: "Riz rouge de la vallée + Légumes mijotés",
          remarques: "Piment vert à part",
          statut: "en_attente",
        },
        {
          id: "b2",
          nom: "Pastels de Poisson Farce Maison (x6)",
          quantite: 2,
          statut: "pret",
        },
      ],
    },
    {
      id: "3",
      numeroTicket: "KDS-086",
      table: "Suite 201 (Room-Service)",
      serveur: "Mamadou (Room Service)",
      typeService: "Room-Service",
      chambreLiee: "Suite Junior 201",
      minutesEcoulees: 22,
      heureValidation: "12:28",
      statut: "en_attente",
      articles: [
        {
          id: "c1",
          nom: "Burger Teranga au Bœuf Zébu & Cheddar",
          quantite: 2,
          cuisson: "Saignant",
          accompagnement: "Aloco banane plantain",
          statut: "en_attente",
        },
        {
          id: "c2",
          nom: "Salade Océane aux Crevettes de Casamance",
          quantite: 1,
          remarques: "Sauce vinaigrette mangue",
          statut: "en_attente",
        },
      ],
    },
    {
      id: "4",
      numeroTicket: "KDS-087",
      table: "Transat 08",
      serveur: "Ousmane (Barman)",
      typeService: "Paillote Piscine",
      minutesEcoulees: 3,
      heureValidation: "12:47",
      statut: "en_attente",
      articles: [
        {
          id: "d1",
          nom: "Club Sandwich Poulet Rôti & Avocat",
          quantite: 1,
          accompagnement: "Frites maison",
          statut: "en_attente",
        },
      ],
    },
  ]);

  // Incrémentation des minutes d'attente
  useEffect(() => {
    const timer = setInterval(() => {
      setTickets((prev) =>
        prev.map((t) => ({ ...t, minutesEcoulees: t.minutesEcoulees + 1 }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const passerEnPreparation = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, statut: "en_preparation" } : t))
    );
  };

  const passerPretAServir = (ticketId: string) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setSuccesMsg(
      `Ticket ${ticket?.numeroTicket} (${ticket?.table}) prêt à servir ! Bip sonore envoyé au serveur.`
    );
    setTimeout(() => setSuccesMsg(null), 4000);
  };

  const toogleLigneArticle = (ticketId: string, articleId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          articles: t.articles.map((art) =>
            art.id === articleId
              ? { ...art, statut: art.statut === "en_attente" ? "pret" : "en_attente" }
              : art
          ),
        };
      })
    );
  };

  const ticketsFiltres = tickets.filter(
    (t) => filtreType === "tous" || t.typeService === filtreType
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-[var(--accent)]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Écran Cuisine KDS (Kitchen Display System)
            </h1>
          </div>
          <p className="text-sm text-foreground-muted mt-1">
            Affichage tactile haute visibilité pour chefs & barmans avec minuterie d'urgence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSonActif(!sonActif)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition ${
              sonActif
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-surface border-surface-border text-foreground-muted"
            }`}
          >
            {sonActif ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {sonActif ? "Alerte Sonore Active" : "Son Coupé"}
          </button>

          <select
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground"
          >
            <option value="tous">Tous les postes de service</option>
            <option value="Sur Place">Salle Restaurant</option>
            <option value="Terrasse">Terrasse Panoramique</option>
            <option value="Room-Service">Room-Service 24/7</option>
            <option value="Paillote Piscine">Paillote Piscine</option>
          </select>
        </div>
      </div>

      {succesMsg && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <BellRing className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* Grille des tickets KDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ticketsFiltres.map((ticket) => {
          const estTresUrgent = ticket.minutesEcoulees >= 20;
          const estMoyen = ticket.minutesEcoulees >= 10 && ticket.minutesEcoulees < 20;
          const tousArticlesPrets = ticket.articles.every((a) => a.statut === "pret");

          return (
            <div
              key={ticket.id}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-md transition-all ${
                estTresUrgent
                  ? "border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/40"
                  : estMoyen
                  ? "border-amber-500/80 bg-amber-500/5"
                  : "border-surface-border bg-surface"
              }`}
            >
              {/* En-tête du ticket */}
              <div>
                <div
                  className={`p-3 text-white flex items-center justify-between ${
                    estTresUrgent
                      ? "bg-rose-600 animate-pulse"
                      : estMoyen
                      ? "bg-amber-600"
                      : "bg-surface-muted border-b border-surface-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black tracking-wide ${
                        estTresUrgent || estMoyen ? "text-white" : "text-foreground"
                      }`}
                    >
                      {ticket.numeroTicket}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        estTresUrgent || estMoyen
                          ? "bg-white/20 text-white"
                          : "bg-surface text-foreground"
                      }`}
                    >
                      {ticket.typeService}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                      estTresUrgent
                        ? "bg-white text-rose-700"
                        : estMoyen
                        ? "bg-white text-amber-700"
                        : "bg-surface-border text-foreground"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ticket.minutesEcoulees} min</span>
                  </div>
                </div>

                {/* Info Table / Serveur */}
                <div className="p-3 bg-surface-muted/40 border-b border-surface-border/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-base text-foreground block">
                      {ticket.table}
                    </span>
                    <span className="text-foreground-muted">
                      Pris par {ticket.serveur}
                    </span>
                  </div>
                  <span className="font-mono text-foreground-muted text-[11px]">
                    Envoyé à {ticket.heureValidation}
                  </span>
                </div>

                {/* Liste des plats commandés */}
                <div className="p-3 space-y-2.5">
                  {ticket.articles.map((art) => {
                    const estPret = art.statut === "pret";
                    return (
                      <div
                        key={art.id}
                        onClick={() => toogleLigneArticle(ticket.id, art.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition select-none ${
                          estPret
                            ? "bg-emerald-500/10 border-emerald-500/40 opacity-60"
                            : "bg-surface border-surface-border hover:border-[var(--primary)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] font-black text-xs flex items-center justify-center flex-shrink-0">
                              {art.quantite}x
                            </span>
                            <div>
                              <span
                                className={`text-sm font-bold block ${
                                  estPret
                                    ? "line-through text-foreground-muted"
                                    : "text-foreground"
                                }`}
                              >
                                {art.nom}
                              </span>
                              {art.cuisson && (
                                <span className="inline-block text-[11px] font-bold text-rose-600 dark:text-rose-400 mr-2">
                                  🔥 Cuisson : {art.cuisson}
                                </span>
                              )}
                              {art.accompagnement && (
                                <span className="text-[11px] text-foreground-muted block">
                                  + {art.accompagnement}
                                </span>
                              )}
                              {art.remarques && (
                                <span className="text-[11px] font-semibold text-amber-600 block mt-0.5">
                                  ⚠️ {art.remarques}
                                </span>
                              )}
                            </div>
                          </div>

                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                              estPret
                                ? "bg-emerald-600 text-white"
                                : "border border-surface-border text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barre d'action bas du ticket */}
              <div className="p-3 border-t border-surface-border bg-surface-muted/30">
                {ticket.statut === "en_attente" && (
                  <button
                    onClick={() => passerEnPreparation(ticket.id)}
                    className="w-full py-2.5 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition shadow-sm"
                  >
                    Démarrer la Préparation
                  </button>
                )}

                {ticket.statut === "en_preparation" && (
                  <button
                    onClick={() => passerPretAServir(ticket.id)}
                    className={`w-full py-2.5 text-xs font-black rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 ${
                      tousArticlesPrets
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Plats Prêts ➔ Notifier Serveur
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {ticketsFiltres.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border space-y-2">
          <ChefHat className="w-12 h-12 text-[var(--accent)] mx-auto opacity-40" />
          <h3 className="font-bold text-foreground">Aucune commande en attente</h3>
          <p className="text-xs text-foreground-muted">
            Toutes les commandes en cuisine ont été dressées et servies.
          </p>
        </div>
      )}
    </div>
  );
}
