import { getEtablissementsSuperAdmin } from '../actions'
import { ClientEtablissementsPage } from './ClientEtablissementsPage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Établissements Hôteliers Déployés • SuperAdmin D-HOTEL',
  description: 'Liste et gestion des établissements hôteliers, résidences et auberges membres.',
}

export default async function AdminEtablissementsPage() {
  const hotels = await getEtablissementsSuperAdmin()
  return <ClientEtablissementsPage initialHotels={hotels} />
}
