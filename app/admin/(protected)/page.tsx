import { SuperAdminDashboardClient } from '@/components/admin/SuperAdminDashboardClient'
import { getEtablissementsSuperAdmin } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'SuperAdmin Dashboard • D-HOTEL',
  description: 'Gestion centrale des établissements et passerelles Maketou et Chariow.',
}

export default async function AdminHotelDashboardPage() {
  const etablissements = await getEtablissementsSuperAdmin()
  return <SuperAdminDashboardClient initialEtablissements={etablissements} />
}
