'use client'

import { GuideAntiScreenshotShield } from "@/components/GuideAntiScreenshotShield";
import { useState } from 'react'
import Link from 'next/link'
import {
  Hotel,
  BedDouble,
  Sparkles,
  UtensilsCrossed,
  Coins,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Search,
  ArrowLeft,
  Smartphone,
  SlidersHorizontal,
  FileText,
  QrCode,
  CreditCard,
  Percent
} from 'lucide-react'

export default function GuideHotelPage() {
  const [activeSection, setActiveSection] = useState('hebergement')

  const chapitres = [
    {
      id: 'prise-en-main',
      titre: '1. Prise en main & Configuration',
      desc: 'Création de vos catégories de chambres, tarifs saisonniers et fiches personnel.',
      icon: SlidersHorizontal
    },
    {
      id: 'hebergement',
      titre: '2. Planning & Réservations',
      desc: 'Réservations directes, gestion des arrivées/départs (Check-in/Check-out express).',
      icon: BedDouble
    },
    {
      id: 'gouvernance',
      titre: '3. Gouvernance & Ménage',
      desc: 'Suivi de l’état des chambres en temps réel (Propre, Sale, En cours, Inspecté).',
      icon: Sparkles
    },
    {
      id: 'restauration',
      titre: '4. Restaurant, Bar & Room Service',
      desc: 'Prise de commande, affectation automatique sur la note de chambre du client.',
      icon: UtensilsCrossed
    },
    {
      id: 'tresorerie',
      titre: '5. Caisse & Main Courante',
      desc: 'Audit de nuit, clôture journalière, encaissements Wave/OM/CB et factures proforma.',
      icon: Coins
    },
    {
      id: 'direction',
      titre: '6. Rapports & Taux d’Occupation',
      desc: 'RevPAR, taux de remplissage, statistiques de fréquentation et export comptable.',
      icon: FileText
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <GuideAntiScreenshotShield />
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Hotel className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-lg text-white font-heading">D-HOTEL</span>
            </Link>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Guide d'utilisation officiel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/decouvrir-dhotel"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Découvrir D-HOTEL
            </Link>
            <Link
              href="/tarifs"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
            >
              Voir les Tarifs
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-800">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4" /> Manuel Opérationnel & Bonnes Pratiques
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Guide d’utilisation du logiciel D-HOTEL PMS
          </h1>
          <p className="mt-3 text-base text-slate-400 leading-relaxed">
            Apprenez à gérer vos réservations, automatiser le service d’étage, facturer les repas et clôturer votre caisse journalière en toute sérénité.
          </p>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation latérale */}
          <aside className="lg:col-span-4 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-3">
              Sommaire interactif
            </h2>
            {chapitres.map((c) => {
              const Icon = c.icon
              const isActive = activeSection === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveSection(c.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3 border ${isActive
                      ? 'bg-amber-500/10 border-amber-500/30 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isActive ? 'text-amber-400' : 'text-slate-200'}`}>
                      {c.titre}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {c.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </aside>

          {/* Corps de l'explication */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            {activeSection === 'prise-en-main' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">1. Prise en main & Paramétrage initial</h2>
                    <p className="text-xs text-slate-400">Configurez votre établissement en moins de 15 minutes</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>
                    Avant d'accueillir vos premiers clients, accédez au menu <strong className="text-white">Paramètres</strong> pour configurer la structure de votre établissement :
                  </p>
                  <ul className="space-y-2.5 pl-4 list-disc text-slate-300">
                    <li><strong className="text-white">Types de chambres :</strong> Définissez vos catégories (Chambre Standard, Supérieure, Suite Junior, Suite Présidentielle, Bungalow).</li>
                    <li><strong className="text-white">Grilles tarifaires :</strong> Fixez le tarif de base par nuitée, les tarifs haute/basse saison, et les suppléments (lit supplémentaire, petit-déjeuner inclus).</li>
                    <li><strong className="text-white">Taxes de séjour :</strong> Renseignez le montant de la taxe touristique par personne/nuitée pour son calcul automatique sur la facture finale.</li>
                    <li><strong className="text-white">Moyens de paiement :</strong> Activez les passerelles Wave, Orange Money, Carte Bancaire et Chèques.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'hebergement' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">2. Gestion du Planning & des Réservations</h2>
                    <p className="text-xs text-slate-400">Visualisez l'occupation de vos chambres en temps réel</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>
                    Le module <strong className="text-white">Hébergements</strong> est le cœur opérationnel de votre réception :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-amber-400 mb-1">Check-in Express</h4>
                      <p className="text-xs text-slate-400">
                        Enregistrez le client en 30 secondes, scannez sa pièce d'identité ou renseignez son passeport, et générez automatiquement la fiche de police électronique.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-amber-400 mb-1">Planning Interactif</h4>
                      <p className="text-xs text-slate-400">
                        Glissez-déposez les réservations, prolongez les séjours ou effectuez un changement de chambre en un clic sans risque de double réservation.
                      </p>
                    </div>
                  </div>
                  <p>
                    Lors du <strong className="text-white">Check-out</strong>, toutes les consommations annexes (restaurant, bar, blanchisserie, excursions) sont automatiquement consolidées sur la facture globale.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'gouvernance' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">3. Gouvernance & Service d'Étage (Housekeeping)</h2>
                    <p className="text-xs text-slate-400">Coordination fluide entre réception et équipe de ménage</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    Le module <strong className="text-white">Gouvernance</strong> permet à la gouvernante générale et aux femmes de chambre de mettre à jour l'état de chaque chambre depuis un smartphone ou une tablette :
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Propre & Prête</span>
                      <span className="text-slate-400">Chambre nettoyée, inspectée et immédiatement attribuable.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-between">
                      <span className="font-bold text-amber-400">En cours de ménage</span>
                      <span className="text-slate-400">Personnel d'étage actif dans la chambre.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center justify-between">
                      <span className="font-bold text-red-400">À nettoyer (Recouche / Dépar)</span>
                      <span className="text-slate-400">Généré automatiquement dès qu'un client effectue son check-out.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'restauration' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">4. Restaurant, Bar & Room Service</h2>
                    <p className="text-xs text-slate-400">Facturation directe au restaurant ou imputation sur la chambre</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    Les serveurs saisissent les commandes de plats et boissons depuis l'interface tactile POS intégrée :
                  </p>
                  <ul className="space-y-2 list-disc pl-4 text-slate-300">
                    <li><strong className="text-white">Note de chambre :</strong> En sélectionnant le numéro de chambre, le montant est débité directement sur le compte du client hébergé.</li>
                    <li><strong className="text-white">Clients extérieurs :</strong> Encaissement direct en espèces, Wave, Orange Money ou carte bancaire avec impression du ticket d'addition.</li>
                    <li><strong className="text-white">Gestion des stocks économat :</strong> Déstockage automatique des ingrédients et boissons lors de la vente.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'tresorerie' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">5. Caisse & Main Courante Hôtelière</h2>
                    <p className="text-xs text-slate-400">Audit de nuit, contrôle des recettes et clôture quotidienne</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>
                    La <strong className="text-white">Main Courante</strong> récapitule l'ensemble des débits de la journée (chambres, restaurant, bar, spa) et les règlements reçus.
                  </p>

                  {/* Encaissement direct 0% commission */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> 0% Commission
                      </span>
                      <h4 className="font-bold text-white text-sm">Paiements Mobile Money & Carte en direct (Sans intermédiaire)</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      D-HOTEL intègre un terminal d'encaissement direct sur vos propres appareils sans recourir aux agrégateurs de paiement en ligne (qui prélèvent de 2% à 3.5% par transaction) :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-sky-400 mb-1">
                          <QrCode className="w-4 h-4" /> Wave QR Direct
                        </div>
                        <p className="text-slate-400">Présentation du QR code marchand de l'établissement. Le client scanne et valide sans surcoût.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-orange-400 mb-1">
                          <Smartphone className="w-4 h-4" /> Orange Money Direct
                        </div>
                        <p className="text-slate-400">Paiement via le code marchand officiel ou code USSD direct au comptoir.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                          <CreditCard className="w-4 h-4" /> TPE Carte Bancaire
                        </div>
                        <p className="text-slate-400">Saisie du montant sur le terminal bancaire de l'hôtel avec archivage de la référence de télécollecte.</p>
                      </div>
                    </div>
                  </div>

                  <p>
                    À la fin de chaque journée ou poste de travail, le réceptionniste procède à la clôture de caisse avec vérification des espèces physiques, des reçus Wave/OM et du terminal de paiement électronique.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'direction' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">6. Tableaux de Bord & Statistiques de Direction</h2>
                    <p className="text-xs text-slate-400">Pilotez votre rentabilité hôtelière en temps réel</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                  <p>
                    Accédez aux indicateurs de référence de l'hôtellerie internationale :
                  </p>
                  <ul className="space-y-2 list-disc pl-4 text-slate-300">
                    <li><strong className="text-white">Taux d'occupation :</strong> Pourcentage de chambres vendues par jour, semaine, mois et année.</li>
                    <li><strong className="text-white">ADR (Average Daily Rate) :</strong> Prix moyen journalier par chambre occupée.</li>
                    <li><strong className="text-white">RevPAR (Revenue Per Available Room) :</strong> Revenu moyen par chambre disponible.</li>
                    <li><strong className="text-white">Fiches de police & Ministère :</strong> Export automatique des registres légaux de police et déclarations de taxe touristique.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

