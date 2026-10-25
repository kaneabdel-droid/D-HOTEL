"use client";

import { useState } from "react";
import {
  Globe,
  Settings,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Building,
  Save,
  Percent,
  Layers,
  Sparkles,
  Sliders,
  HelpCircle,
  Clock,
  Plus,
  Trash2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { formatMontant } from "@/lib/currency";
import {
  MODELES_PAYS,
  type CodePays,
  type ModelePaysRh,
  type RegleCotisation,
  type TrancheFiscale,
  type CategorieConventionnelle,
} from "@/lib/rh";

export default function ParametresRhMultiPaysPage() {
  const [codePaysActif, setCodePaysActif] = useState<CodePays>("SN");
  const [notification, setNotification] = useState<string | null>(null);

  // État local éditable du modèle pays
  const [modeleActuel, setModeleActuel] = useState<ModelePaysRh>(() => JSON.parse(JSON.stringify(MODELES_PAYS.SN)));

  function changerModelePays(nouveauCode: CodePays) {
    setCodePaysActif(nouveauCode);
    const source = MODELES_PAYS[nouveauCode] || MODELES_PAYS.SN;
    setModeleActuel(JSON.parse(JSON.stringify(source)));
    setNotification(`Modèle réglementaire ${source.nom} chargé. Vous pouvez ajuster les paramètres ci-dessous.`);
    setTimeout(() => setNotification(null), 5000);
  }

  function handleEnregistrer(e: React.FormEvent) {
    e.preventDefault();
    setNotification(
      `Paramétrage légal, fiscal et comptable pour « ${modeleActuel.nom} » sauvegardé avec succès.`
    );
    setTimeout(() => setNotification(null), 5000);
  }

  function modifierCotisation(index: number, champ: keyof RegleCotisation, valeur: any) {
    const copie = [...modeleActuel.cotisations];
    copie[index] = { ...copie[index], [champ]: valeur };
    setModeleActuel({ ...modeleActuel, cotisations: copie });
  }

  function ajouterCotisation() {
    setModeleActuel({
      ...modeleActuel,
      cotisations: [
        ...modeleActuel.cotisations,
        {
          code: `COTIS_${Date.now().toString().slice(-4)}`,
          libelle: "Nouvelle Cotisation Sociale",
          tauxSalarie: 2.0,
          tauxPatronal: 4.0,
          compteComptable: "4310",
        },
      ],
    });
  }

  function supprimerCotisation(index: number) {
    const copie = [...modeleActuel.cotisations];
    copie.splice(index, 1);
    setModeleActuel({ ...modeleActuel, cotisations: copie });
  }

  function modifierTranche(index: number, champ: keyof TrancheFiscale, valeur: any) {
    const copie = [...modeleActuel.tranchesImpot];
    copie[index] = { ...copie[index], [champ]: valeur === "" ? null : Number(valeur) };
    setModeleActuel({ ...modeleActuel, tranchesImpot: copie });
  }

  function ajouterTranche() {
    const derniere = modeleActuel.tranchesImpot[modeleActuel.tranchesImpot.length - 1];
    const nouvMin = derniere && derniere.max ? derniere.max : 100000;
    setModeleActuel({
      ...modeleActuel,
      tranchesImpot: [
        ...modeleActuel.tranchesImpot,
        { min: nouvMin, max: nouvMin + 100000, taux: 20 },
      ],
    });
  }

  function supprimerTranche(index: number) {
    const copie = [...modeleActuel.tranchesImpot];
    copie.splice(index, 1);
    setModeleActuel({ ...modeleActuel, tranchesImpot: copie });
  }

  function modifierCategorie(index: number, champ: keyof CategorieConventionnelle, valeur: any) {
    const copie = [...modeleActuel.grilleConventionnelle];
    copie[index] = { ...copie[index], [champ]: valeur };
    setModeleActuel({ ...modeleActuel, grilleConventionnelle: copie });
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Paramétrage RH, Fiscal & Comptable
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Multi-Pays & Personnalisable
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configuration des législations du Sénégal, Mauritanie, Maroc, Nigéria, Gambie, Ghana ou sur-mesure hors Sénégal.
          </p>
        </div>

        <button
          onClick={handleEnregistrer}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Save className="h-4 w-4" />
          Enregistrer le Paramétrage
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. SÉLECTEUR DE MODÈLE PAYS */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Sélection du Pays & Cadre Réglementaire</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Plan comptable : <strong className="text-foreground">{modeleActuel.nomPlanComptable}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(MODELES_PAYS).map(([code, p]) => {
            const estActif = codePaysActif === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => changerModelePays(code as CodePays)}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  estActif
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border bg-background hover:bg-muted/50 text-foreground"
                }`}
              >
                <div>
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{code}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">
                      {p.symboleDevise}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium mt-1 truncate">{p.nom.split("(")[0]}</div>
                </div>
                <span className="text-[10px] text-muted-foreground mt-2 block">{p.referentielComptable}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulaire des Paramètres */}
      <form onSubmit={handleEnregistrer} className="space-y-6">
        {/* 2. RÉFÉRENTIEL COMPTABLE & COMPTES DU GRAND-LIVRE */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              Intégration Comptable & Plan de Comptes Hôtelier ({modeleActuel.nomPlanComptable})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-foreground">Référentiel Comptable</label>
              <select
                value={modeleActuel.referentielComptable}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, referentielComptable: e.target.value as any })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="SYSCOHADA">SYSCOHADA Révisé (UEMOA / CEMAC / Sénégal)</option>
                <option value="PCGM_MAROC">Plan Comptable Général Marocain (PCGM)</option>
                <option value="PCGM_MAURITANIE">Plan Comptable Général Mauritanien (PCGM)</option>
                <option value="IFRS_ANGLO">IFRS / Anglo-Saxon (Nigéria, Gambie, Ghana)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Devise & Symbole d'Édition</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={modeleActuel.devise}
                  onChange={(e) => setModeleActuel({ ...modeleActuel, devise: e.target.value as any })}
                  className="w-1/2 rounded-lg border border-border bg-background px-3 py-2 text-foreground uppercase font-mono"
                />
                <input
                  type="text"
                  value={modeleActuel.symboleDevise}
                  onChange={(e) => setModeleActuel({ ...modeleActuel, symboleDevise: e.target.value })}
                  placeholder="Symbole"
                  className="w-1/2 rounded-lg border border-border bg-background px-3 py-2 text-foreground font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Base Heures Mensuelles (Standard)</label>
              <input
                type="number"
                step="0.01"
                value={modeleActuel.heuresNormalesMois}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, heuresNormalesMois: Number(e.target.value) })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>
          </div>

          {/* Numérotation des comptes du grand livre pour les écritures de paie */}
          <div className="rounded-lg bg-muted/20 border border-border p-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Comptes Clés de l'Écriture de Paie
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-muted-foreground">Compte Charges Salariales (Brut)</label>
                <input
                  type="text"
                  value={modeleActuel.comptesCles.chargesSalaires}
                  onChange={(e) =>
                    setModeleActuel({
                      ...modeleActuel,
                      comptesCles: { ...modeleActuel.comptesCles, chargesSalaires: e.target.value },
                    })
                  }
                  className="w-full mt-1 rounded border border-border bg-background px-2.5 py-1.5 font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Compte Charges Sociales Patronales</label>
                <input
                  type="text"
                  value={modeleActuel.comptesCles.chargesSocialesPatronales}
                  onChange={(e) =>
                    setModeleActuel({
                      ...modeleActuel,
                      comptesCles: { ...modeleActuel.comptesCles, chargesSocialesPatronales: e.target.value },
                    })
                  }
                  className="w-full mt-1 rounded border border-border bg-background px-2.5 py-1.5 font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Compte Salaires Nets Dus</label>
                <input
                  type="text"
                  value={modeleActuel.comptesCles.dettesSalaries}
                  onChange={(e) =>
                    setModeleActuel({
                      ...modeleActuel,
                      comptesCles: { ...modeleActuel.comptesCles, dettesSalaries: e.target.value },
                    })
                  }
                  className="w-full mt-1 rounded border border-border bg-background px-2.5 py-1.5 font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Compte Dettes Organismes Sociaux</label>
                <input
                  type="text"
                  value={modeleActuel.comptesCles.organismesSociaux}
                  onChange={(e) =>
                    setModeleActuel({
                      ...modeleActuel,
                      comptesCles: { ...modeleActuel.comptesCles, organismesSociaux: e.target.value },
                    })
                  }
                  className="w-full mt-1 rounded border border-border bg-background px-2.5 py-1.5 font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Compte Dettes Fiscales (Retenues IR/PAYE)</label>
                <input
                  type="text"
                  value={modeleActuel.comptesCles.etatImpots}
                  onChange={(e) =>
                    setModeleActuel({
                      ...modeleActuel,
                      comptesCles: { ...modeleActuel.comptesCles, etatImpots: e.target.value },
                    })
                  }
                  className="w-full mt-1 rounded border border-border bg-background px-2.5 py-1.5 font-mono text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. HEURES SUPPLÉMENTAIRES, PRIMES & AVANTAGES EN NATURE */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              Majorations des Heures Supplémentaires, Primes & Avantages Hôteliers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-foreground">Majoration Heures de Jour (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={modeleActuel.majorationHsJour}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, majorationHsJour: Number(e.target.value) })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Ex: +25% ou +30%</span>
            </div>

            <div>
              <label className="font-semibold text-foreground">Majoration Heures de Nuit (%)</label>
              <input
                type="number"
                min="0"
                max="200"
                value={modeleActuel.majorationHsNuit}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, majorationHsNuit: Number(e.target.value) })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Nuit hôtelière (ex: +50%)</span>
            </div>

            <div>
              <label className="font-semibold text-foreground">Majoration Dimanches & Fériés (%)</label>
              <input
                type="number"
                min="0"
                max="200"
                value={modeleActuel.majorationHsDimanche}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, majorationHsDimanche: Number(e.target.value) })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Repos hebdo (ex: +100%)</span>
            </div>

            <div>
              <label className="font-semibold text-foreground">
                Transport Exonéré ({modeleActuel.symboleDevise}/mois)
              </label>
              <input
                type="number"
                min="0"
                value={modeleActuel.indemniteTransportExoneree}
                onChange={(e) =>
                  setModeleActuel({
                    ...modeleActuel,
                    indemniteTransportExoneree: Number(e.target.value),
                  })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Plafond non imposable</span>
            </div>
          </div>
        </div>

        {/* 4. GRILLE SALARIALE & SALAIRES DE BASE MINIMAUX DU SECTEUR HÔTELIER */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-sm text-foreground">
                Salaires de Base Catégoriels Minimaux (Convention Collective Hôtellerie {modeleActuel.nom.split("(")[0]})
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Intitulé Catégorie</th>
                  <th className="px-3 py-2">Salaire Min. Mensuel ({modeleActuel.symboleDevise})</th>
                  <th className="px-3 py-2">Taux Horaire Min.</th>
                  <th className="px-3 py-2">Exemples Postes dans l'Hôtel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {modeleActuel.grilleConventionnelle.map((g, idx) => (
                  <tr key={g.code} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono font-bold text-foreground">{g.code}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={g.intitule}
                        onChange={(e) => modifierCategorie(idx, "intitule", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={g.salaireBaseMinimal}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          modifierCategorie(idx, "salaireBaseMinimal", val);
                          modifierCategorie(idx, "tauxHoraireMinimal", Math.round(val / modeleActuel.heuresNormalesMois));
                        }}
                        className="w-28 rounded border border-border bg-background px-2 py-1 text-xs font-mono font-bold text-emerald-600"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {g.tauxHoraireMinimal} {modeleActuel.symboleDevise}/h
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      <input
                        type="text"
                        value={g.exemplesPostes}
                        onChange={(e) => modifierCategorie(idx, "exemplesPostes", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. COTISATIONS SOCIALES & ORGANISMES DU PAYS */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-sm text-foreground">
                Cotisations Sociales, Prévoyance & Sécurité Sociale ({modeleActuel.nom})
              </h3>
            </div>
            <button
              type="button"
              onClick={ajouterCotisation}
              className="inline-flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une cotisation
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Libellé Organisme / Caisse</th>
                  <th className="px-3 py-2 text-right">Taux Salarié (%)</th>
                  <th className="px-3 py-2 text-right">Taux Patronal (%)</th>
                  <th className="px-3 py-2 text-right">Plafond Assiette ({modeleActuel.symboleDevise})</th>
                  <th className="px-3 py-2">Compte</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {modeleActuel.cotisations.map((c, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono font-bold text-foreground">{c.code}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={c.libelle}
                        onChange={(e) => modifierCotisation(idx, "libelle", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={c.tauxSalarie}
                        onChange={(e) => modifierCotisation(idx, "tauxSalarie", Number(e.target.value))}
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-right font-mono text-rose-600"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={c.tauxPatronal}
                        onChange={(e) => modifierCotisation(idx, "tauxPatronal", Number(e.target.value))}
                        className="w-16 rounded border border-border bg-background px-2 py-1 text-xs text-right font-mono text-blue-600"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        value={c.plafondMensuel ?? ""}
                        placeholder="Illimité"
                        onChange={(e) =>
                          modifierCotisation(
                            idx,
                            "plafondMensuel",
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-24 rounded border border-border bg-background px-2 py-1 text-xs text-right font-mono text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{c.compteComptable}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => supprimerCotisation(idx)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. FISCALITÉ & BARÈME PROGRESSIF DE L'IMPÔT */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-sm text-foreground">
                Barème de Retenue Fiscale (IR / ITS / PAYE Schedule) & Déductions Familiales
              </h3>
            </div>
            <button
              type="button"
              onClick={ajouterTranche}
              className="inline-flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted/80 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une tranche fiscale
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-3">
            <div>
              <label className="font-semibold text-foreground">Système Réduction de Famille</label>
              <select
                value={modeleActuel.typeDeductionFamille}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, typeDeductionFamille: e.target.value as any })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="parts">Parts Fiscales (Sénégal, Côte d'Ivoire)</option>
                <option value="charge_fixe">Somme Fixe déduite par charge (Maroc: 600 DH/an)</option>
                <option value="cra_anglo">Consolidated Relief Allowance (Nigéria PITA)</option>
                <option value="aucun">Aucune déduction (Mauritanie, Gambie, Ghana)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground">Abattement Frais Professionnels (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={modeleActuel.abattementFraisProPct}
                onChange={(e) =>
                  setModeleActuel({ ...modeleActuel, abattementFraisProPct: Number(e.target.value) })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Plafond Annuel Abattement ({modeleActuel.symboleDevise})</label>
              <input
                type="number"
                value={modeleActuel.plafondAbattementAnnuel ?? ""}
                placeholder="Illimité"
                onChange={(e) =>
                  setModeleActuel({
                    ...modeleActuel,
                    plafondAbattementAnnuel: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-3 py-2">Tranche Min. Annuelle ({modeleActuel.symboleDevise})</th>
                  <th className="px-3 py-2">Tranche Max. Annuelle ({modeleActuel.symboleDevise})</th>
                  <th className="px-3 py-2 text-right">Taux d'Imposition (%)</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {modeleActuel.tranchesImpot.map((tr, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono">
                      <input
                        type="number"
                        value={tr.min}
                        onChange={(e) => modifierTranche(idx, "min", e.target.value)}
                        className="w-28 rounded border border-border bg-background px-2 py-1 text-xs font-mono text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2 font-mono">
                      <input
                        type="number"
                        value={tr.max ?? ""}
                        placeholder="Au-delà / Illimité"
                        onChange={(e) => modifierTranche(idx, "max", e.target.value)}
                        className="w-32 rounded border border-border bg-background px-2 py-1 text-xs font-mono text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="60"
                        value={tr.taux}
                        onChange={(e) => modifierTranche(idx, "taux", e.target.value)}
                        className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-right font-mono font-bold text-amber-600"
                      />
                      %
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => supprimerTranche(idx)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bouton de validation en bas */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition"
          >
            <Save className="h-4 w-4" />
            Enregistrer les Paramètres Réglementaires & Comptables
          </button>
        </div>
      </form>
    </div>
  );
}
