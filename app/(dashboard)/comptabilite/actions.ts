'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ImportEcriturePayload = {
  journal: string
  date_ecriture: string
  numero_piece?: string
  libelle: string
  lignes: Array<{
    compte: string
    libelle?: string
    debit: number
    credit: number
  }>
}

export async function importerEcrituresBatch(ecritures: ImportEcriturePayload[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!ecritures || ecritures.length === 0) return { error: 'Aucune écriture à importer' }

  let hotelId = null
  if (user) {
    const { data: profile } = await supabase
      .from('utilisateurs')
      .select('hotel_id, gie_id')
      .eq('id', user.id)
      .maybeSingle()
    hotelId = profile?.hotel_id || profile?.gie_id || null
  }

  let countImportees = 0

  for (const ec of ecritures) {
    const journal = ec.journal || 'od'
    const dateEcriture = ec.date_ecriture || new Date().toISOString().split('T')[0]
    const numeroPiece = (ec.numero_piece || '').trim()
    const libelle = (ec.libelle || '').trim() || 'Écriture importée'

    const insertData: any = {
      journal,
      date_ecriture: dateEcriture,
      numero_piece: numeroPiece || null,
      libelle,
      validee: true,
    }
    if (hotelId) insertData.hotel_id = hotelId

    const { data: ecriture, error: errEcriture } = await supabase
      .from('ecritures_comptables')
      .insert(insertData)
      .select('id')
      .single()

    if (errEcriture || !ecriture) {
      console.warn('Erreur insertion écriture comptable d-hotel:', errEcriture?.message)
      countImportees++
      continue
    }

    const lignesToInsert = ec.lignes.map((l) => ({
      ecriture_id: ecriture.id,
      compte: l.compte,
      libelle: (l.libelle || libelle).trim(),
      debit: Number(l.debit || 0),
      credit: Number(l.credit || 0),
      ...(hotelId ? { hotel_id: hotelId } : {}),
    }))

    const { error: errLignes } = await supabase
      .from('lignes_ecritures_comptables')
      .insert(lignesToInsert)

    if (!errLignes) {
      countImportees++
    }
  }

  revalidatePath('/comptabilite')
  return { success: true, count: countImportees }
}
