/**
 * Utilitaire de gestion des rôles et habilitations pour D-HÔTEL
 * Niveaux gérés :
 * - directeur / admin : tous les droits (création, modification, annulation, suppression)
 * - manager_reception / chef_reception : modification, check-in/out, annulation de réservation
 * - receptionniste : création, modification courante, encaissement (pas d'annulation ni suppression)
 * - chef_comptable : modification et annulation de factures/avoirs
 * - caissier : encaissement, modification courante de folio (pas d'annulation de facture ni suppression)
 * - gouvernante : statut ménage/maintenance des chambres
 */

export type HotelUserRole =
  | 'directeur'
  | 'admin'
  | 'manager_reception'
  | 'receptionniste'
  | 'chef_comptable'
  | 'caissier'
  | 'serveur'
  | 'gouvernante'
  | 'econome'

export function getClientHotelRole(): string {
  if (typeof window === 'undefined') return 'directeur'

  try {
    // 1. Cookie dhotel_demo_role
    const match = document.cookie.match(/(?:^|; )dhotel_demo_role=([^;]*)/)
    if (match && match[1]) {
      return decodeURIComponent(match[1])
    }

    // 2. localStorage
    const stored = localStorage.getItem('dhotel_demo_role')
    if (stored) return stored

    // 3. Profil utilisateur hors-ligne stocké
    const offlineUser = localStorage.getItem('dhotel_offline_user')
    if (offlineUser) {
      const parsed = JSON.parse(offlineUser)
      if (parsed?.role) return parsed.role
    }
  } catch (err) {
    console.warn('Erreur lecture rôle hôtelier côté client:', err)
  }

  return 'directeur'
}

export function verifierPermissionsHotel(role: string = 'directeur', ressource: 'reservations' | 'chambres' | 'factures') {
  const r = role.toLowerCase()
  const estDirectionOuAdmin = r === 'directeur' || r === 'admin'

  if (ressource === 'reservations') {
    return {
      peutCreer: true,
      peutModifier: estDirectionOuAdmin || ['receptionniste', 'manager_reception', 'chef_reception'].includes(r),
      peutAnnuler: estDirectionOuAdmin || ['manager_reception', 'chef_reception'].includes(r),
      peutSupprimer: estDirectionOuAdmin,
    }
  }

  if (ressource === 'chambres') {
    return {
      peutCreer: estDirectionOuAdmin,
      peutModifier: estDirectionOuAdmin || ['manager_reception', 'gouvernante'].includes(r),
      peutAnnuler: estDirectionOuAdmin,
      peutSupprimer: estDirectionOuAdmin,
    }
  }

  if (ressource === 'factures') {
    return {
      peutCreer: true,
      peutModifier: estDirectionOuAdmin || ['chef_comptable', 'caissier', 'receptionniste'].includes(r),
      peutAnnuler: estDirectionOuAdmin || ['chef_comptable'].includes(r),
      peutSupprimer: estDirectionOuAdmin,
    }
  }

  return {
    peutCreer: true,
    peutModifier: true,
    peutAnnuler: estDirectionOuAdmin,
    peutSupprimer: estDirectionOuAdmin,
  }
}

