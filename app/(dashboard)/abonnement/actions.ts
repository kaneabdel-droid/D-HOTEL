'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { initiateMaketouPayment } from '@/lib/payments/maketou'
import { initiateChariowPayment } from '@/lib/payments/chariow'
import { siteUrl } from '@/lib/payments/config'

export type MoyenPaiement = 'mobile_money' | 'carte' | 'virement' | 'caisse'

export interface InitiateSubscriptionResult {
  ok: boolean
  checkoutUrl?: string
  virement?: boolean
  caisse?: boolean
  paymentId?: string
  message?: string
  error?: string
}

const TARIFS_HOTEL: Record<string, { mensuel: number; annuel: number; nom: string }> = {
  auberge: {
    nom: 'Auberge & Campement',
    mensuel: 15000,
    annuel: 162000,
  },
  hotel: {
    nom: 'Hôtel & Résidence',
    mensuel: 20000,
    annuel: 216000,
  },
}

export async function initierPaiementAbonnementHotel(
  planId: string,
  frequence: 'mensuel' | 'annuel',
  moyenPaiement: MoyenPaiement,
  phoneLocal?: string
): Promise<InitiateSubscriptionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Session expirée. Veuillez vous reconnecter.' }
  }

  const admin = createAdminClient()

  // 1. Récupération du profil et de l'établissement
  const { data: profile } = await admin
    .from('utilisateurs')
    .select('hotel_id, gie_id')
    .eq('id', user.id)
    .maybeSingle()

  const hotelId = profile?.hotel_id || profile?.gie_id

  let hotelNom = 'Établissement Hôtelier'
  let hotelTel = phoneLocal || user.phone || '+221 77 000 00 00'

  if (hotelId) {
    const { data: hotelData } = await admin
      .from('hotels')
      .select('nom, telephone')
      .eq('id', hotelId)
      .maybeSingle()

    if (hotelData) {
      hotelNom = hotelData.nom || hotelNom
      hotelTel = hotelData.telephone || hotelTel
    }
  }

  const tarif = TARIFS_HOTEL[planId] || TARIFS_HOTEL.hotel
  const montant = frequence === 'annuel' ? tarif.annuel : tarif.mensuel
  const description = `Abonnement D-HOTEL ${tarif.nom} (${frequence === 'annuel' ? 'Annuel' : 'Mensuel'})`

  // 2. Détermination du provider initial
  const provider =
    moyenPaiement === 'caisse'
      ? 'caisse'
      : moyenPaiement === 'virement'
      ? 'virement'
      : 'maketou'

  // 3. Enregistrement de la tentative dans abonnement_paiements
  const { data: payment, error: insertErr } = await admin
    .from('abonnement_paiements')
    .insert({
      hotel_id: hotelId || null,
      hotel_nom: hotelNom,
      hotel_telephone: hotelTel,
      niveau: planId,
      montant,
      devise: 'XOF',
      provider,
      moyen_paiement: moyenPaiement,
      statut: 'pending',
      notes: `${frequence.toUpperCase()} • ${tarif.nom}`,
    })
    .select('id')
    .single()

  if (insertErr || !payment) {
    console.error('[d-hotel:abonnement] Erreur insertion paiement:', insertErr)
    return { ok: false, error: 'Impossible d’initialiser la transaction.' }
  }

  const paymentId = payment.id

  // CAS 1 : Règlement en Caisse (espèces au bureau / validé par SuperAdmin)
  if (moyenPaiement === 'caisse') {
    return {
      ok: true,
      caisse: true,
      paymentId,
      message: `Votre demande de règlement en caisse (${montant.toLocaleString('fr-FR')} FCFA) a été enregistrée avec la référence #${paymentId.slice(0, 8)}. Elle sera validée directement par l'administrateur.`,
    }
  }

  // CAS 2 : Virement bancaire
  if (moyenPaiement === 'virement') {
    return {
      ok: true,
      virement: true,
      paymentId,
      message: `Virement bancaire de ${montant.toLocaleString('fr-FR')} FCFA en attente. Utilisez la référence #${paymentId.slice(0, 8)} lors de votre virement vers notre compte BOA / UBA.`,
    }
  }

  // CAS 3 : Mobile Money & Carte -> Maketou en priorité avec Chariow en secours
  const returnUrl = `${siteUrl}/abonnement/retour?ref=${paymentId}`

  // A. Tentative avec Maketou
  try {
    const maketouProductId =
      process.env.MAKETOU_PRODUCT_ID ||
      (planId === 'auberge' ? 'PRD-MKT-AUB-15K' : 'PRD-MKT-HOT-20K')

    const maketouRes = await initiateMaketouPayment({
      productId: maketouProductId,
      reference: paymentId,
      phoneLocal: phoneLocal || hotelTel || '770000000',
      countryCode: 'SN',
      customerEmail: user.email || 'direction@hotel.sn',
      customerName: hotelNom,
      returnUrl,
      montantAttendu: montant,
    })

    if (maketouRes.ok) {
      await admin
        .from('abonnement_paiements')
        .update({
          provider: 'maketou',
          provider_reference: maketouRes.providerTransactionId,
          checkout_url: maketouRes.checkoutUrl,
        })
        .eq('id', paymentId)

      return { ok: true, checkoutUrl: maketouRes.checkoutUrl, paymentId }
    } else {
      console.warn('[d-hotel:payment] Maketou indisponible:', maketouRes.error, '-> Bascule sur Chariow...')
    }
  } catch (err: any) {
    console.warn('[d-hotel:payment] Exception Maketou:', err?.message, '-> Bascule sur Chariow...')
  }

  // B. Relais de secours : Chariow
  try {
    const chariowProductId =
      process.env.CHARIOW_PRODUCT_ID ||
      (montant >= 200000 ? 'prd_bb7is4in' : 'prd_43icfwzb')

    const chariowRes = await initiateChariowPayment({
      productId: chariowProductId,
      montantAttendu: montant,
      reference: paymentId,
      phoneLocal: phoneLocal || hotelTel || '770000000',
      countryCode: 'SN',
      customerEmail: user.email || 'direction@hotel.sn',
      customerName: hotelNom,
      returnUrl,
    })

    if (chariowRes.ok) {
      await admin
        .from('abonnement_paiements')
        .update({
          provider: 'chariow',
          provider_reference: chariowRes.providerTransactionId,
          checkout_url: chariowRes.checkoutUrl,
        })
        .eq('id', paymentId)

      return { ok: true, checkoutUrl: chariowRes.checkoutUrl, paymentId }
    } else {
      console.warn('[d-hotel:payment] Chariow a aussi échoué:', chariowRes.error)
    }
  } catch (err: any) {
    console.warn('[d-hotel:payment] Exception Chariow:', err?.message)
  }

  return {
    ok: false,
    error: 'La passerelle de paiement en ligne est momentanément indisponible. Vous pouvez choisir "Paiement en Caisse" ou "Virement Bancaire" pour activer votre formule sans délai.',
  }
}
