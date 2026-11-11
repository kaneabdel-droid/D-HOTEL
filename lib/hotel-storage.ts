/**
 * Utilitaire de persistance locale étanche pour D-HÔTEL
 * Permet de gérer les données réelles de l'établissement tout en présentant
 * les données de démonstration en filigrane sans impact lorsque l'établissement est neuf.
 */

export function loadHotelData<T>(
  key: string,
  defaultDemoData: T[]
): { items: T[]; isExempleFiligrane: boolean } {
  if (typeof window === 'undefined') {
    return { items: defaultDemoData, isExempleFiligrane: true }
  }

  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return { items: parsed, isExempleFiligrane: false }
      }
    }
  } catch (err) {
    console.warn(`Erreur lecture storage pour ${key}:`, err)
  }

  // Si aucune donnée réelle n'a encore été enregistrée pour cet établissement
  return { items: defaultDemoData, isExempleFiligrane: true }
}

export function saveHotelData<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (err) {
    console.warn(`Erreur sauvegarde storage pour ${key}:`, err)
  }
}

export function clearHotelData(key: string): void {
  if (typeof window === 'undefined') return
  try {
    // Enregistre un tableau vide explicite pour indiquer que l'utilisateur a vidé la liste
    localStorage.setItem(key, JSON.stringify([]))
  } catch (err) {
    console.warn(`Erreur reset storage pour ${key}:`, err)
  }
}

