import { SuperAdminDashboardClient } from '@/components/admin/SuperAdminDashboardClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'SuperAdmin Dashboard • D-HOTEL',
  description: 'Gestion centrale des établissements et passerelles Maketou et Chariow.',
}

export default function AdminHotelDashboardPage() {
  return <SuperAdminDashboardClient />
}
