import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Hotel,
  BedDouble,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react'
import { isSuperAdminAuthenticated, getSuperAdminUser } from '@/lib/admin/auth'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = await isSuperAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  const user = await getSuperAdminUser()

  const navItems = [
    { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { href: '/admin/etablissements', label: 'Établissements Hôteliers', icon: Hotel },
    { href: '/admin/abonnements', label: 'Abonnements & Revenus', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Hotel className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold font-heading text-base text-white tracking-tight">D-HOTEL</p>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">SuperAdmin</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 text-xs">
          <p className="text-slate-400">Connecté en tant que :</p>
          <p className="text-slate-200 font-mono truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="https://siggie.dembasolution.com/admin"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Hub DEMBA Central
            </span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/admin/logout"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion SuperAdmin
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  )
}

