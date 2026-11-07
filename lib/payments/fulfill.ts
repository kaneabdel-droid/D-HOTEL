import { createAdminClient } from '@/utils/supabase/admin'

export type PaymentProvider = 'maketou' | 'chariow' | 'virement' | 'caisse'

export interface FulfillPaymentParams {
  hotelId: string
  forfait: string
  montant: number
  provider: PaymentProvider
  reference?: string
  paymentId?: string
}

/**
 * Cœur idempotent de l'activation d'abonnement D-HOTEL :
 * Met à jour le statut du paiement en 'completed' et active immédiatement l'établissement hôtelier.
 */
export async function fulfillSubscriptionPayment(params: FulfillPaymentParams) {
  const admin = createAdminClient()
  const { hotelId, forfait, montant, provider, reference, paymentId } = params

  try {
    // 1. Mise à jour de la table abonnement_paiements si applicable
    if (paymentId) {
      await admin
        .from('abonnement_paiements')
        .update({
          statut: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
    } else if (reference) {
      await admin
        .from('abonnement_paiements')
        .update({
          statut: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('provider_reference', reference)
    }

    // 2. Mise à jour de paiements_maketou si présent
    if (reference && provider === 'maketou') {
      try {
        await admin
          .from('paiements_maketou')
          .update({
            statut: 'completed',
            date_paiement_confirme: new Date().toISOString(),
          })
          .eq('cart_id', reference)
      } catch {
        // Table optionnelle
      }
    }

    // 3. Mise à jour de l'établissement hôtelier (activation immédiate, déverrouillage)
    const { error: hotelErr } = await admin
      .from('hotels')
      .update({
        subscription_tier: forfait,
        statut: 'actif',
        compte_verrouille: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', hotelId)

    if (hotelErr) {
      console.warn('[d-hotel:fulfill] Note mise à jour table hotels:', hotelErr.message)
    }

    console.log(`[d-hotel:fulfill] Abonnement '${forfait}' activé pour l'hôtel ${hotelId} via ${provider}`)
    return { ok: true }
  } catch (err: any) {
    console.error('[d-hotel:fulfill] Erreur activation abonnement:', err)
    return { ok: false, error: err.message || 'Erreur lors de l’activation' }
  }
}

