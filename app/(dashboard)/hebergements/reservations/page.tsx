"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Hotel,
  Search,
  Filter,
  PlusCircle,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  Smartphone,
  CreditCard,
  Ban,
  X,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";
import { loadHotelData, saveHotelData, clearHotelData } from "@/lib/hotel-storage";

interface Reservation {
  id: string;
  code: string;
  client: string;
  telephone: string;
  chambre: string;
  typeChambre: string;
  dateArrivee: string;
  dateDepart: string;
  nuits: number;
  personnes: string;
  montantTotal: number;
  acompteVerse: number;
  statut: "confirmee" | "attente_acompte" | "check_in" | "check_out" | "annulee";
  modePaiement: string;
}

const DEFAULT_RESERVATIONS: Reservation[] = [
  {
    id: "res-demo-1",
    code: "RES-EX-00421",
    client: "M. Ibrahima Diop",
    telephone: "+221 77 450 12 34",
    chambre: "Chambre 101",
    typeChambre: "Chambre Standard",
    dateArrivee: "2026-10-24",
    dateDepart: "2026-10-27",
    nuits: 3,
    personnes: "2 adultes",
    montantTotal: 135000,
    acompteVerse: 135000,
    statut: "check_in",
    modePaiement: "Wave Mobile Money",
  },
  {
    id: "res-demo-2",
    code: "RES-EX-00422",
    client: "Mme Awa Sarr",
    telephone: "+221 78 123 99 88",
    chambre: "Chambre 102",
    typeChambre: "Chambre Standard",
    dateArrivee: "2026-10-26",
    dateDepart: "2026-10-29",
    nuits: 3,
    personnes: "1 adulte",
    montantTotal: 135000,
    acompteVerse: 50000,
    statut: "confirmee",
    modePaiement: "Orange Money",
  },
  {
    id: "res-demo-3",
    code: "RES-EX-00423",
    client: "Dr. K. Ndiaye",
    telephone: "+221 76 888 45 12",
    chambre: "Chambre 103",
    typeChambre: "Chambre Deluxe",
    dateArrivee: "2026-10-24",
    dateDepart: "2026-10-25",
    nuits: 1,
    personnes: "1 adulte",
    montantTotal: 65000,
    acompteVerse: 0,
    statut: "check_in",
    modePaiement: "Facture Entreprise",
  },
  {
    id: "res-demo-4",
    code: "RES-EX-00424",
    client: "M. & Mme Moreau",
    telephone: "+33 6 12 34 56 78",
    chambre: "Suite Junior 201",
    typeChambre: "Suite Junior",
    dateArrivee: "2026-10-24",
    dateDepart: "2026-10-28",
    nuits: 4,
    personnes: "2 adultes",
    montantTotal: 380000,
    acompteVerse: 190000,
    statut: "check_in",
    modePaiement: "Carte Bancaire Visa",
  },
  {
    id: "res-demo-5",
    code: "RES-EX-00425",
    client: "Délégation PNUD (VIP)",
    telephone: "+221 33 800 00 00",
    chambre: "Suite Exécutive 202",
    typeChambre: "Suite Exécutive",
    dateArrivee: "2026-10-25",
    dateDepart: "2026-10-30",
    nuits: 5,
    personnes: "3 adultes",
    montantTotal: 675000,
    acompteVerse: 675000,
    statut: "confirmee",
    modePaiement: "Virement Bancaire",
  },
];

export default function ReservationsPage() {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [modalCreation, setModalCreation] = useState(false);
  const [modalModifierReservation, setModalModifierReservation] = useState<Reservation | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);
  const [reservationDetails, setReservationDetails] = useState<Reservation | null>(null);

  // Formulaire nouvelle réservation
  const [nouveauClient, setNouveauClient] = useState("");
  const [nouveauTel, setNouveauTel] = useState("");
  const [nouvelleChambre, setNouvelleChambre] = useState("101");
  const [nouvelleArrivee, setNouvelleArrivee] = useState("2026-10-25");
  const [nouveauDepart, setNouveauDepart] = useState("2026-10-28");
  const [nouveauRegime, setNouveauRegime] = useState("BB");
  const [nouvelAcompte, setNouvelAcompte] = useState("50000");

  // Données persistantes
  const [reservations, setReservations] = useState<Reservation[]>(DEFAULT_RESERVATIONS);
  const [isExempleFiligrane, setIsExempleFiligrane] = useState(true);

  useEffect(() => {
    const loaded = loadHotelData<Reservation>("dhotel_reservations", DEFAULT_RESERVATIONS);
    setReservations(loaded.items);
    setIsExempleFiligrane(loaded.isExempleFiligrane);
  }, []);

  function handleCreerReservation(e: React.FormEvent) {
    e.preventDefault();
    if (!nouveauClient.trim()) return;

    const nouvelle: Reservation = {
      id: "res-" + Date.now(),
      code: `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      client: nouveauClient.trim(),
      telephone: nouveauTel.trim(),
      chambre: `Chambre ${nouvelleChambre}`,
      typeChambre: "Chambre Standard",
      dateArrivee: nouvelleArrivee,
      dateDepart: nouveauDepart,
      nuits: 3,
      personnes: "2 adultes",
      montantTotal: 135000,
      acompteVerse: Number(nouvelAcompte) || 0,
      statut: Number(nouvelAcompte) > 0 ? "confirmee" : "attente_acompte",
      modePaiement: "Lien Maketou (Wave / Orange)",
    };

    const updated = isExempleFiligrane ? [nouvelle] : [nouvelle, ...reservations];
    setReservations(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_reservations", updated);

    setModalCreation(false);
    setNouveauClient("");
    setNouveauTel("");
    setSuccesMsg(`Réservation ${nouvelle.code} créée avec succès pour ${nouvelle.client} !`);
    setTimeout(() => setSuccesMsg(null), 3500);
  }

  function handleModifierReservation(e: React.FormEvent) {
    e.preventDefault();
    if (!modalModifierReservation) return;

    const updated = reservations.map((r) =>
      r.id === modalModifierReservation.id ? modalModifierReservation : r
    );
    setReservations(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_reservations", updated);

    setModalModifierReservation(null);
    setSuccesMsg(`Réservation ${modalModifierReservation.code} mise à jour avec succès.`);
    setTimeout(() => setSuccesMsg(null), 3500);
  }

  function handleSupprimerReservation(id: string, code: string) {
    if (!window.confirm(`Confirmez-vous la suppression de la réservation ${code} ?`)) {
      return;
    }

    const updated = reservations.filter((r) => r.id !== id);
    setReservations(updated);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_reservations", updated);

    setSuccesMsg(`Réservation ${code} supprimée.`);
    setTimeout(() => setSuccesMsg(null), 3000);
  }

  function handleViderExemples() {
    if (window.confirm("Voulez-vous vider tous les exemples de réservations pour partir de zéro ?")) {
      setReservations([]);
      setIsExempleFiligrane(false);
      clearHotelData("dhotel_reservations");
      setSuccesMsg("Liste des réservations vidée. Vous pouvez créer votre première réservation réelle.");
      setTimeout(() => setSuccesMsg(null), 4000);
    }
  }

  function handleConvertirExemples() {
    const converted = reservations.map((r, idx) => ({
      ...r,
      id: "res-reel-" + (idx + 1) + "-" + Date.now(),
    }));
    setReservations(converted);
    setIsExempleFiligrane(false);
    saveHotelData("dhotel_reservations", converted);
    setSuccesMsg("Les réservations d'exemple ont été converties en données réelles modifiables.");
    setTimeout(() => setSuccesMsg(null), 4000);
  }

  const reservationsFiltrees = reservations.filter((r) => {
    const matchTexte =
      r.client.toLowerCase().includes(recherche.toLowerCase()) ||
      r.code.toLowerCase().includes(recherche.toLowerCase()) ||
      r.chambre.toLowerCase().includes(recherche.toLowerCase());
    const matchStatut =
      filtreStatut === "tous" || r.statut === filtreStatut;
    return matchTexte && matchStatut;
  });

  return (
    <div className="space-y-6">
      {/* ── EN-TÊTE RÉSERVATIONS ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-[var(--surface-border)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Hotel className="w-6 h-6 text-[#D4AF37]" />
            <span>Gestion des Réservations & Folios</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            Dossiers de séjours, vérification des acomptes Maketou et facturation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hebergements/rack"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--surface-border)] text-xs font-semibold shadow-xs"
          >
            <span>Voir le Rack Gantt</span>
          </Link>
          <button
            type="button"
            onClick={() => setModalCreation(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une Réservation</span>
          </button>
        </div>
      </div>

      {/* Bannière filigrane sans impact */}
      {isExempleFiligrane && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Réservations d&apos;exemple en filigrane :</strong> Votre établissement ne possède pas encore de réservations enregistrées. Ces {reservations.length} dossiers sont affichés à titre indicatif et sans impact. Vous pouvez les modifier, les supprimer ou ajouter vos propres réservations.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConvertirExemples}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition cursor-pointer"
            >
              Conserver et Modifier
            </button>
            <button
              onClick={handleViderExemples}
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-black/5 text-amber-900 dark:text-amber-200 text-xs font-semibold transition cursor-pointer"
            >
              Partir de zéro
            </button>
          </div>
        </div>
      )}

      {succesMsg && (
        <div className="p-3 bg-[#10B981]/15 border border-[#10B981] rounded-xl text-center text-xs font-bold text-[#10B981] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* ── BARRE DE RECHERCHE ET FILTRES ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--surface-border)] text-xs">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Rechercher par nom, code ou chambre..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] text-xs outline-hidden"
          />
          <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--foreground-muted)]" />
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="p-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] font-medium"
          >
            <option value="tous">Tous les statuts</option>
            <option value="confirmee">Confirmée (Acompte reçu)</option>
            <option value="attente_acompte">En attente d&apos;acompte</option>
            <option value="check_in">En séjour (In-House)</option>
            <option value="check_out">Départ effectué</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {/* ── TABLEAU DES RÉSERVATIONS ── */}
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] font-semibold">
              <th className="p-3">Code & Date</th>
              <th className="p-3">Client</th>
              <th className="p-3">Chambre</th>
              <th className="p-3">Séjour</th>
              <th className="p-3">Montant Total</th>
              <th className="p-3">Acompte Versé</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-border)]">
            {reservationsFiltrees.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-foreground-muted">
                  Aucune réservation enregistrée.
                </td>
              </tr>
            ) : null}

            {reservationsFiltrees.map((r) => {
              const soldeDu = r.montantTotal - r.acompteVerse;
              return (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    isExempleFiligrane
                      ? "opacity-75 bg-amber-500/5 hover:bg-amber-500/10"
                      : "hover:bg-[var(--surface-muted)]/50"
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--primary)]">{r.code}</span>
                      {isExempleFiligrane && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          Exemple
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--foreground-muted)]">
                      {r.modePaiement}
                    </p>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[var(--foreground)]">{r.client}</span>
                    <p className="text-[10px] text-[var(--foreground-muted)]">{r.telephone}</p>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-[var(--foreground)]">{r.chambre}</span>
                    <p className="text-[10px] text-[var(--foreground-muted)]">{r.typeChambre}</p>
                  </td>
                  <td className="p-3">
                    <span className="text-[var(--foreground)]">
                      {r.dateArrivee} ➔ {r.dateDepart}
                    </span>
                    <p className="text-[10px] text-[var(--foreground-muted)]">
                      {r.nuits} nuits • {r.personnes}
                    </p>
                  </td>
                  <td className="p-3 font-bold text-[var(--foreground)]">
                    {formatXOF(r.montantTotal)}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-[#10B981]">
                      {formatXOF(r.acompteVerse)}
                    </span>
                    {soldeDu > 0 && (
                      <p className="text-[10px] text-[#EF4444] font-medium">
                        Reste : {formatXOF(soldeDu)}
                      </p>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.statut === "check_in"
                          ? "bg-blue-100 text-blue-800"
                          : r.statut === "confirmee"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.statut === "attente_acompte"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {r.statut === "check_in"
                        ? "En Séjour"
                        : r.statut === "confirmee"
                        ? "Confirmée"
                        : r.statut === "attente_acompte"
                        ? "Attente Acompte"
                        : r.statut}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReservationDetails(r)}
                        className="p-1.5 rounded-md hover:bg-[var(--surface-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
                        title="Voir Folio et Facture"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalModifierReservation(r)}
                        className="px-2 py-1 rounded-md text-xs font-semibold bg-surface-border/60 hover:bg-surface-border text-foreground transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSupprimerReservation(r.id, r.code)}
                        className="p-1 rounded-md text-danger/70 hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                        title="Supprimer cette réservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── MODALE NOUVELLE RÉSERVATION ── */}
      {modalCreation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-surface text-foreground border border-surface-border rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between bg-surface shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-base sm:text-lg font-bold">Nouvelle Réservation Client</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCreation(false)}
                className="p-1 rounded-lg hover:bg-surface-muted text-foreground-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreerReservation} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1">Nom et Prénom du Client *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: M. Abdoulaye Ndiaye"
                  value={nouveauClient}
                  onChange={(e) => setNouveauClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 000 00 00"
                  value={nouveauTel}
                  onChange={(e) => setNouveauTel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Chambre</label>
                  <input
                    type="text"
                    value={nouvelleChambre}
                    onChange={(e) => setNouvelleChambre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Acompte (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    value={nouvelAcompte}
                    onChange={(e) => setNouvelAcompte(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Date Arrivée</label>
                  <input
                    type="date"
                    value={nouvelleArrivee}
                    onChange={(e) => setNouvelleArrivee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Date Départ</label>
                  <input
                    type="date"
                    value={nouveauDepart}
                    onChange={(e) => setNouveauDepart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalCreation(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-95"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE MODIFICATION RÉSERVATION ── */}
      {modalModifierReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-surface text-foreground border border-surface-border rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between bg-surface shrink-0">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                <h3 className="text-base sm:text-lg font-bold">
                  Modifier Réservation {modalModifierReservation.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalModifierReservation(null)}
                className="p-1 rounded-lg hover:bg-surface-muted text-foreground-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModifierReservation} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium mb-1">Client Titulaire *</label>
                <input
                  type="text"
                  required
                  value={modalModifierReservation.client}
                  onChange={(e) =>
                    setModalModifierReservation({ ...modalModifierReservation, client: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={modalModifierReservation.telephone}
                    onChange={(e) =>
                      setModalModifierReservation({ ...modalModifierReservation, telephone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Chambre</label>
                  <input
                    type="text"
                    value={modalModifierReservation.chambre}
                    onChange={(e) =>
                      setModalModifierReservation({ ...modalModifierReservation, chambre: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Date Arrivée</label>
                  <input
                    type="date"
                    value={modalModifierReservation.dateArrivee}
                    onChange={(e) =>
                      setModalModifierReservation({ ...modalModifierReservation, dateArrivee: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Date Départ</label>
                  <input
                    type="date"
                    value={modalModifierReservation.dateDepart}
                    onChange={(e) =>
                      setModalModifierReservation({ ...modalModifierReservation, dateDepart: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Montant Total (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    value={modalModifierReservation.montantTotal}
                    onChange={(e) =>
                      setModalModifierReservation({
                        ...modalModifierReservation,
                        montantTotal: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Acompte Versé (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    value={modalModifierReservation.acompteVerse}
                    onChange={(e) =>
                      setModalModifierReservation({
                        ...modalModifierReservation,
                        acompteVerse: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Statut du séjour</label>
                <select
                  value={modalModifierReservation.statut}
                  onChange={(e: any) =>
                    setModalModifierReservation({ ...modalModifierReservation, statut: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background"
                >
                  <option value="confirmee">Confirmée</option>
                  <option value="attente_acompte">Attente Acompte</option>
                  <option value="check_in">En séjour (Check-in)</option>
                  <option value="check_out">Départ effectué (Check-out)</option>
                  <option value="annulee">Annulée</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalModifierReservation(null)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-95"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE FOLIO DÉTAILS ── */}
      {reservationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-surface text-foreground border border-surface-border rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-surface-border">
              <h3 className="text-base sm:text-lg font-bold">
                Folio Dossier {reservationDetails.code}
              </h3>
              <button
                type="button"
                onClick={() => setReservationDetails(null)}
                className="p-1 rounded-md text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Client Titulaire :</span>
                  <span className="font-bold text-foreground">{reservationDetails.client}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Contact Téléphone :</span>
                  <span className="font-medium text-foreground">{reservationDetails.telephone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Chambre assignée :</span>
                  <span className="font-bold text-[var(--accent)]">{reservationDetails.chambre} ({reservationDetails.typeChambre})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Période de séjour :</span>
                  <span className="font-medium text-foreground">{reservationDetails.dateArrivee} au {reservationDetails.dateDepart} ({reservationDetails.nuits} nuits)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-muted/40 border border-surface-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Montant Total :</span>
                  <span className="font-bold text-foreground text-sm">{reservationDetails.montantTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Acompte / Réglé :</span>
                  <span className="font-bold text-emerald-600">{reservationDetails.acompteVerse.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted">Mode de Règlement :</span>
                  <span className="font-medium text-foreground">{reservationDetails.modePaiement}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-surface-border">
                  <span className="font-bold text-foreground">Reste à payer :</span>
                  <span className="font-extrabold text-amber-500 text-sm">
                    {(reservationDetails.montantTotal - reservationDetails.acompteVerse).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-surface-border text-xs font-bold text-foreground hover:bg-surface-muted transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Imprimer le Folio</span>
              </button>
              <button
                type="button"
                onClick={() => setReservationDetails(null)}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-95 transition cursor-pointer"
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
