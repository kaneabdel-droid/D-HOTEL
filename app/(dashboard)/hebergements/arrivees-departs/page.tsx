"use client";

import { useState } from "react";
import {
  LogIn,
  LogOut,
  ShieldCheck,
  Search,
  Printer,
  CheckCircle2,
  Hotel,
  UserCheck,
  FileText,
} from "lucide-react";
import { formatXOF } from "@/lib/utils";

interface VoyageurMouvement {
  id: string;
  client: string;
  telephone: string;
  nationalite: string;
  pieceType: string;
  pieceNumero: string;
  chambre: string;
  dateArrivee: string;
  dateDepart: string;
  statut: "en_attente" | "enregistre";
  soldeRestant: number;
}

export default function ArriveesDepartsPage() {
  const [onglet, setOnglet] = useState<"arrivees" | "departs">("arrivees");
  const [modalPolice, setModalPolice] = useState<VoyageurMouvement | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  const [arrivees, setArrivees] = useState<VoyageurMouvement[]>([
    {
      id: "1",
      client: "M. Ibrahima Diop",
      telephone: "+221 77 450 12 34",
      nationalite: "Sénégalaise",
      pieceType: "CNI",
      pieceNumero: "1 254 1990 00124",
      chambre: "Chambre 101",
      dateArrivee: "2026-10-24",
      dateDepart: "2026-10-27",
      statut: "enregistre",
      soldeRestant: 0,
    },
    {
      id: "2",
      client: "Mme Sophie Martin",
      telephone: "+33 6 45 78 12 90",
      nationalite: "Française",
      pieceType: "Passeport",
      pieceNumero: "21AF45981",
      chambre: "Bungalow Plage 12",
      dateArrivee: "2026-10-24",
      dateDepart: "2026-10-29",
      statut: "en_attente",
      soldeRestant: 0,
    },
    {
      id: "3",
      client: "M. Amadou Tidiane Ba",
      telephone: "+221 70 800 11 22",
      nationalite: "Sénégalaise",
      pieceType: "CNI",
      pieceNumero: "1 198 1985 00987",
      chambre: "Suite Junior 201",
      dateArrivee: "2026-10-24",
      dateDepart: "2026-10-26",
      statut: "en_attente",
      soldeRestant: 45000,
    },
  ]);

  const [departs, setDeparts] = useState<VoyageurMouvement[]>([
    {
      id: "4",
      client: "Dr. K. Ndiaye",
      telephone: "+221 76 888 45 12",
      nationalite: "Sénégalaise",
      pieceType: "CNI",
      pieceNumero: "1 150 1978 00412",
      chambre: "Chambre 103",
      dateArrivee: "2026-10-23",
      dateDepart: "2026-10-24",
      statut: "en_attente",
      soldeRestant: 65000,
    },
    {
      id: "5",
      client: "M. Christian Dupont",
      telephone: "+33 7 88 99 00 11",
      nationalite: "Française",
      pieceType: "Passeport",
      pieceNumero: "19FG78451",
      chambre: "Chambre 105",
      dateArrivee: "2026-10-20",
      dateDepart: "2026-10-24",
      statut: "enregistre",
      soldeRestant: 0,
    },
  ]);

  function validerCheckIn(id: string) {
    setArrivees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, statut: "enregistre" } : a))
    );
    setModalPolice(null);
    setSuccesMsg("Check-in validé et Fiche de Police archivée avec succès !");
    setTimeout(() => setSuccesMsg(null), 3000);
  }

  function validerCheckOut(id: string) {
    setDeparts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, statut: "enregistre" } : d))
    );
    setSuccesMsg("Check-out effectué. Chambre libérée et passée à nettoyer !");
    setTimeout(() => setSuccesMsg(null), 3000);
  }

  const listeAffichee = onglet === "arrivees" ? arrivees : departs;

  return (
    <div className="space-y-6">
      {/* ── EN-TÊTE ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-[var(--surface-border)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#10B981]" />
            <span>Mouvements du Jour & Fiches de Police</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            Enregistrement des arrivées, fiches réglementaires de voyageur et clôtures de séjour
          </p>
        </div>

        {/* Sélecteur Arrivées / Départs */}
        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--surface-border)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setOnglet("arrivees")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              onglet === "arrivees"
                ? "bg-[#10B981] text-white shadow-xs"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Arrivées ({arrivees.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setOnglet("departs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              onglet === "departs"
                ? "bg-[#9E2A2B] text-white shadow-xs"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Départs ({departs.length})</span>
          </button>
        </div>
      </div>

      {succesMsg && (
        <div className="p-3 bg-[#10B981]/15 border border-[#10B981] rounded-xl text-center text-xs font-bold text-[#10B981] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{succesMsg}</span>
        </div>
      )}

      {/* ── TABLEAU DES CLIENTS ── */}
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] font-semibold">
              <th className="p-3">Client & Téléphone</th>
              <th className="p-3">Nationalité</th>
              <th className="p-3">Pièce d&apos;Identité</th>
              <th className="p-3">Hébergement</th>
              <th className="p-3">Solde Dû</th>
              <th className="p-3">Statut Mouvement</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-border)]">
            {listeAffichee.map((v) => (
              <tr key={v.id} className="hover:bg-[var(--surface-muted)]/50 transition-colors">
                <td className="p-3">
                  <span className="font-bold text-[var(--foreground)]">{v.client}</span>
                  <p className="text-[10px] text-[var(--foreground-muted)]">{v.telephone}</p>
                </td>
                <td className="p-3 font-medium text-[var(--foreground)]">
                  {v.nationalite}
                </td>
                <td className="p-3">
                  <span className="font-semibold text-[var(--foreground)]">
                    {v.pieceType} : {v.pieceNumero}
                  </span>
                </td>
                <td className="p-3 font-semibold text-[var(--foreground)]">
                  {v.chambre}
                </td>
                <td className="p-3 font-bold">
                  {v.soldeRestant > 0 ? (
                    <span className="text-[#EF4444]">{formatXOF(v.soldeRestant)}</span>
                  ) : (
                    <span className="text-[#10B981]">Réglé (0 FCFA)</span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      v.statut === "enregistre"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {v.statut === "enregistre" ? "Effectué" : "En attente"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {onglet === "arrivees" ? (
                    v.statut === "en_attente" ? (
                      <button
                        type="button"
                        onClick={() => setModalPolice(v)}
                        className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#0da06e] text-white font-bold text-[11px]"
                      >
                        Enregistrer Check-in
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setModalPolice(v)}
                        className="px-2.5 py-1 rounded-md border border-[var(--surface-border)] hover:bg-[var(--surface-muted)] text-[11px] font-medium text-[var(--foreground)] flex items-center gap-1 inline-flex"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Fiche Police</span>
                      </button>
                    )
                  ) : v.statut === "en_attente" ? (
                    <button
                      type="button"
                      onClick={() => validerCheckOut(v.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#9E2A2B] hover:bg-[#801e1f] text-white font-bold text-[11px]"
                    >
                      Clôturer Check-out
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#10B981] font-semibold">
                      Départ Effectué
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MODALE FICHE DE POLICE OFFICIELLE ── */}
      {modalPolice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
              <div>
                <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Ministère du Tourisme • République du Sénégal
                </span>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  Fiche Individuelle de Police Voyageur
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalPolice(null)}
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--surface-border)] space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Nom & Prénom</span>
                  <span className="font-bold text-[var(--foreground)]">{modalPolice.client}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Nationalité</span>
                  <span className="font-bold text-[var(--foreground)]">{modalPolice.nationalite}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--surface-border)]">
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Type & N° Pièce</span>
                  <span className="font-bold text-[var(--foreground)]">
                    {modalPolice.pieceType} : {modalPolice.pieceNumero}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Hébergement</span>
                  <span className="font-bold text-[var(--foreground)]">{modalPolice.chambre}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--surface-border)]">
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Date d&apos;Arrivée</span>
                  <span className="font-semibold text-[var(--foreground)]">{modalPolice.dateArrivee}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-muted)] block">Date de Départ Prévue</span>
                  <span className="font-semibold text-[var(--foreground)]">{modalPolice.dateDepart}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => validerCheckIn(modalPolice.id)}
                className="flex-1 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-xs"
              >
                Valider & Enregistrer l&apos;Arrivée
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-[var(--surface-border)] hover:bg-[var(--surface-muted)] text-xs text-[var(--foreground)] font-medium"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
