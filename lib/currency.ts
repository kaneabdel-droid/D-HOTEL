// Devise de référence et formatage multi-devises pour D-HOTEL
// Conforme au standard DembaSolution

export type DeviseCode = 'XOF' | 'XAF' | 'MRU' | 'MAD' | 'GNF' | 'EUR' | 'USD' | 'AUCUNE';

export const DEVISES: Record<DeviseCode, { label: string; symbole: string; decimales: number }> = {
  XOF: { label: 'Franc CFA — BCEAO (XOF)', symbole: 'FCFA', decimales: 0 },
  XAF: { label: 'Franc CFA — BEAC (XAF)', symbole: 'FCFA', decimales: 0 },
  MRU: { label: 'Ouguiya mauritanien (MRU)', symbole: 'MRU', decimales: 2 },
  MAD: { label: 'Dirham marocain (MAD)', symbole: 'MAD', decimales: 2 },
  GNF: { label: 'Franc guinéen (GNF)', symbole: 'GNF', decimales: 0 },
  EUR: { label: 'Euro (EUR)', symbole: '€', decimales: 2 },
  USD: { label: 'Dollar US (USD)', symbole: '$', decimales: 2 },
  AUCUNE: { label: 'Sans unité (autre pays)', symbole: '', decimales: 2 },
};

export const DEVISE_PAR_DEFAUT: DeviseCode = 'XOF';

export function estDeviseValide(v: string | null | undefined): v is DeviseCode {
  return !!v && v in DEVISES;
}

export function formatMontant(valeur: number | null | undefined, devise?: string | null): string {
  const code = estDeviseValide(devise) ? devise : DEVISE_PAR_DEFAUT;
  const info = DEVISES[code];
  const nombre = Number(valeur ?? 0).toLocaleString('fr-FR', {
    minimumFractionDigits: info.decimales,
    maximumFractionDigits: info.decimales,
  });
  return info.symbole ? `${nombre} ${info.symbole}` : nombre;
}

// Formatage sécurisé pour l'impression A4 via jsPDF (évite le bug des espaces insécables U+202F)
export function formatMontantPdf(valeur: number | null | undefined, devise?: string | null): string {
  const code = estDeviseValide(devise) ? devise : DEVISE_PAR_DEFAUT;
  const decimales = DEVISES[code].decimales;
  const [entier, partieDecimale] = Number(valeur ?? 0).toFixed(decimales).split('.');
  const entierGroupe = entier.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return partieDecimale ? `${entierGroupe},${partieDecimale}` : entierGroupe;
}
