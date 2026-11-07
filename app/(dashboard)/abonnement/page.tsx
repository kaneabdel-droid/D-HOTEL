import { Hotel, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { getDictionary } from '@/dictionaries'
import PlanSelectorHotel from './PlanSelectorHotel'

export const dynamic = 'force-dynamic'

export default async function AbonnementHotelDashboardPage() {
  const dict = await getDictionary()
  const t = dict?.abonnement || {}
  let isDemo = true
  let planActuel = 'hotel'

  try {
    const cookieStore = await cookies()
    const isDemoCookie = cookieStore.get('dhotel_demo_session')?.value === '1'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && !isDemoCookie) {
      // Vérifier le forfait en base si l'utilisateur est authentifié
      const { data: hotelData } = await supabase
        .from('hotels')
        .select('subscription_tier, nom')
        .eq('id', user.id)
        .maybeSingle()

      if (hotelData) {
        planActuel = hotelData.subscription_tier || 'hotel'
        isDemo =
          hotelData.nom?.toLowerCase().includes('teranga') ||
          hotelData.nom?.toLowerCase().includes('demo') ||
          hotelData.nom?.toLowerCase().includes('démonstration') ||
          false
      } else {
        isDemo = false
      }
    } else {
      isDemo = true
    }
  } catch {
    isDemo = true
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Hotel className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.title || 'Gestion de l\'Abonnement D-HOTEL'}
            </h1>
          </div>
          <p className="text-sm text-foreground-muted">
            {t.subtitle || 'Souscrivez votre licence en ligne via Mobile Money (Wave, Orange Money) ou Carte Bancaire, ou réglez directement par virement ou en caisse.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/221770000000?text=Bonjour,%20je%20souhaite%20renouveler%20mon%20abonnement%20D-HOTEL."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.assistance_btn || 'Assistance Facturation WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* Bannière Démo intégrale si en mode démo */}
      {isDemo && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
              {t.demo_banner_title || 'Espace de Démonstration Hôtelière • Licence Hôtel & Résidence Débloquée'}
            </p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {t.demo_banner_desc || 'Tous les modules hôteliers sont intégralement débloqués pour vos tests : Planning PMS & Rack chambres, Point de Vente Restaurant / Bar tactile, Transfert folios chambre, Housekeeping mobile, Salles MICE & Événements, Économat, Trésorerie et Comptabilité SYSCOHADA.'}
            </p>
          </div>
        </div>
      )}

      {/* Sélecteur et Passerelle de Paiement */}
      <PlanSelectorHotel planActuel={planActuel} />

      {/* Rassurance & Moyens de Paiement */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.security_badge || 'Passerelle Sécurisée Maketou avec secours Chariow'}</span>
        </div>
        <p className="text-xs text-foreground-muted leading-relaxed">
          {t.security_text || 'Les paiements en ligne par Mobile Money (Wave Sénégal, Orange Money) et Carte Bancaire (Visa, Mastercard) sont instantanément validés sans délai d\'attente. En cas de règlement en caisse ou par virement bancaire, l\'activation est effectuée directement par l\'administrateur depuis le SuperAdmin dès réception des fonds.'}
        </p>
      </div>
    </div>
  )
}
