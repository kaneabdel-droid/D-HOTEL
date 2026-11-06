import { CreditCard } from 'lucide-react'
import { getPaiementsAbonnementsSuperAdmin } from '@/app/admin/(protected)/actions'
import { AbonnementsSuperAdminClient } from './AbonnementsSuperAdminClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Gestion des Abonnements • SuperAdmin D-HOTEL',
}

export default async function AdminHotelAbonnementsPage() {
  const initialPaiements = await getPaiementsAbonnementsSuperAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-amber-400" />
          Abonnements & Licences Hôtelières
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Suivi des règlements Maketou, Chariow, virements et encaissements en caisse avec validation directe SuperAdmin en 1 clic.
        </p>
      </div>

      <AbonnementsSuperAdminClient initialPaiements={initialPaiements} />
    </div>
  )
}
