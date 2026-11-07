import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle, ArrowRight, RefreshCw, Hotel } from 'lucide-react'
import { fetchMaketouCart, mapMaketouStatus } from '@/lib/payments/maketou'
import { fetchChariowSale, mapChariowStatus } from '@/lib/payments/chariow'
import { fulfillSubscriptionPayment } from '@/lib/payments/fulfill'

export const dynamic = 'force-dynamic'

export default async function AbonnementRetourPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  const admin = createAdminClient()

  let payment: any = null

  if (ref) {
    const { data } = await admin
      .from('abonnement_paiements')
      .select('*')
      .eq('id', ref)
      .maybeSingle()

    payment = data
  }

  // Vérification directe auprès de Maketou ou Chariow sans webhook
  if (payment && payment.statut === 'pending' && payment.provider_reference) {
    try {
      if (payment.provider === 'maketou') {
        const liveCart = await fetchMaketouCart(payment.provider_reference)
        if (liveCart) {
          const liveStatus = mapMaketouStatus(liveCart.status)
          if (liveStatus === 'completed') {
            await fulfillSubscriptionPayment({
              hotelId: payment.hotel_id,
              forfait: payment.niveau,
              montant: payment.montant,
              provider: 'maketou',
              reference: payment.provider_reference,
              paymentId: payment.id,
            })
            payment.statut = 'completed'
          } else if (liveStatus === 'failed') {
            await admin
              .from('abonnement_paiements')
              .update({ statut: 'failed', updated_at: new Date().toISOString() })
              .eq('id', payment.id)
            payment.statut = 'failed'
          }
        }
      } else if (payment.provider === 'chariow') {
        const liveSale = await fetchChariowSale(payment.provider_reference)
        if (liveSale) {
          const liveStatus = mapChariowStatus(liveSale.status)
          if (liveStatus === 'completed') {
            await fulfillSubscriptionPayment({
              hotelId: payment.hotel_id,
              forfait: payment.niveau,
              montant: payment.montant,
              provider: 'chariow',
              reference: payment.provider_reference,
              paymentId: payment.id,
            })
            payment.statut = 'completed'
          } else if (liveStatus === 'failed') {
            await admin
              .from('abonnement_paiements')
              .update({ statut: 'failed', updated_at: new Date().toISOString() })
              .eq('id', payment.id)
            payment.statut = 'failed'
          }
        }
      }
    } catch (err) {
      console.error('[d-hotel:retour] Erreur vérification live:', err)
    }
  }

  const statut = payment?.statut || 'pending'
  const isCaisse = payment?.provider === 'caisse'
  const isVirement = payment?.provider === 'virement'

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {statut === 'pending' && !isCaisse && !isVirement && (
        <meta httpEquiv="refresh" content="5" />
      )}

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        {statut === 'completed' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">
                Abonnement D-HOTEL Activé !
              </h1>
              <p className="text-xs text-slate-300">
                Votre transaction de{' '}
                <strong className="text-white font-mono">
                  {payment?.montant?.toLocaleString('fr-FR')} FCFA
                </strong>{' '}
                a été confirmée avec succès.
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Formule {payment?.niveau === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence'} opérationnelle
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/dashboard"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Accéder à mon tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}

        {statut === 'pending' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">
                {isCaisse
                  ? 'Demande de Règlement en Caisse Enregistrée'
                  : isVirement
                  ? 'Virement Bancaire en Attente de Réception'
                  : 'Vérification du Paiement en Cours...'}
              </h1>
              <p className="text-xs text-slate-300">
                {isCaisse
                  ? 'Votre demande est en attente. Votre administrateur peut la valider directement en un clic sur le SuperAdmin dès réception des espèces.'
                  : isVirement
                  ? 'Dès réception des fonds sur notre compte, l’administrateur validera immédiatement l’accès à votre formule.'
                  : 'Nous attendons la confirmation automatique de la passerelle. Cette page s’actualise automatiquement.'}
              </p>
              {payment?.id && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                  Réf. Dossier : <span className="text-white">#{payment.id.slice(0, 8)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
              <Link
                href={`/abonnement/retour?ref=${ref}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualiser le statut</span>
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </>
        )}

        {statut === 'failed' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Paiement non abouti</h1>
              <p className="text-xs text-slate-300">
                La transaction n&apos;a pas pu être validée par la passerelle de paiement.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
              <Link
                href="/abonnement"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Réessayer le paiement
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

