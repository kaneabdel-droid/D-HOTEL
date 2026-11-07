"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

export interface EtablissementItem {
  id: string;
  nom: string;
  type: string;
  ville: string;
  chambres: number;
  directeur: string;
  telephone: string;
  email?: string;
  plan: string;
  prix: string;
  statut: 'actif' | 'essai' | 'suspendu';
  compte_verrouille?: boolean;
  expireLe: string;
  dateCreation?: string;
  source?: 'supabase' | 'demo';
}

const DEMO_ETABLISSEMENTS: EtablissementItem[] = [
  {
    id: 'hot-01',
    nom: 'Hôtel Teranga Palace',
    type: 'Hôtel & Résidence',
    ville: 'Dakar (Almadies)',
    chambres: 120,
    directeur: 'Mamadou Sow',
    telephone: '+221 33 800 00 00',
    email: 'direction@terangapalace.sn',
    plan: 'hotel',
    prix: '20 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-10-30',
    source: 'demo',
  },
  {
    id: 'hot-02',
    nom: 'Résidence Palm Beach',
    type: 'Hôtel & Résidence',
    ville: 'Saly Portudal',
    chambres: 45,
    directeur: 'Aminata Touré',
    telephone: '+221 77 650 44 11',
    email: 'contact@palmbeachsaly.sn',
    plan: 'hotel',
    prix: '20 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-08-15',
    source: 'demo',
  },
  {
    id: 'hot-03',
    nom: 'Écolodge du Saloum',
    type: 'Auberge & Campement',
    ville: 'Toubacouta',
    chambres: 18,
    directeur: 'Jean-Luc Gomis',
    telephone: '+221 78 300 22 99',
    email: 'resa@saloum-ecolodge.com',
    plan: 'auberge',
    prix: '15 000 FCFA/m',
    statut: 'essai',
    expireLe: '2026-11-14',
    source: 'demo',
  },
  {
    id: 'hot-04',
    nom: 'Campement Le Bolong Fleuri',
    type: 'Auberge & Campement',
    ville: 'Cap Skirring',
    chambres: 12,
    directeur: 'Bakary Sagna',
    telephone: '+221 77 500 88 12',
    email: 'bolong@campement.sn',
    plan: 'auberge',
    prix: '15 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-05-10',
    source: 'demo',
  },
  {
    id: 'hot-05',
    nom: 'Hôtel Saint-Louis Fleuve',
    type: 'Hôtel & Résidence',
    ville: 'Saint-Louis (Île)',
    chambres: 32,
    directeur: 'Ousmane Diagne',
    telephone: '+221 33 961 12 34',
    email: 'contact@stlouis-fleuve.sn',
    plan: 'hotel',
    prix: '20 000 FCFA/m',
    statut: 'actif',
    expireLe: '2027-03-20',
    source: 'demo',
  },
];

export async function getEtablissementsSuperAdmin(): Promise<EtablissementItem[]> {
  try {
    const admin = createAdminClient();
    const realEtablissements: EtablissementItem[] = [];

    // 1. Récupération dynamique depuis Supabase Auth
    try {
      const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
        perPage: 100,
      });

      if (!usersError && usersData?.users) {
        for (const u of usersData.users) {
          const meta = u.user_metadata || {};
          // On prend en compte tout compte ayant un nom d'établissement ou créé via signup
          if (meta.etablissement_nom || u.email) {
            const planKey =
              meta.plan === 'auberge' ||
                meta.etablissement_type === 'campement' ||
                meta.etablissement_type === 'auberge'
                ? 'auberge'
                : 'hotel';

            const typeLabel =
              meta.etablissement_type === 'campement'
                ? 'Campement Touristique'
                : meta.etablissement_type === 'auberge'
                  ? 'Auberge & Gîte'
                  : planKey === 'auberge'
                    ? 'Auberge & Campement'
                    : 'Hôtel & Résidence';

            const prixLabel = planKey === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m';

            realEtablissements.push({
              id: u.id,
              nom: meta.etablissement_nom || `Établissement (${u.email})`,
              type: typeLabel,
              ville: meta.ville || 'Sénégal',
              chambres: Number(meta.chambres_nb) || 15,
              directeur: meta.nom_complet || u.email?.split('@')[0] || 'Directeur',
              telephone: meta.telephone || u.phone || '+221 --',
              email: u.email,
              plan: planKey,
              prix: prixLabel,
              statut: u.banned_until ? 'suspendu' : u.email_confirmed_at ? 'actif' : 'essai',
              compte_verrouille: Boolean(u.banned_until),
              expireLe: new Date(new Date(u.created_at).getTime() + 30 * 24 * 3600 * 1000)
                .toISOString()
                .split('T')[0],
              dateCreation: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              source: 'supabase',
            });
          }
        }
      }
    } catch (e) {
      console.warn("Échec listUsers SuperAdmin:", e);
    }

    // 2. Si la table public.hotels existe, enrichir avec les données SQL
    try {
      const { data: hotelsData } = await admin.from('hotels').select('*');
      if (hotelsData && hotelsData.length > 0) {
        for (const h of hotelsData) {
          if (!realEtablissements.some((item) => item.id === h.id || item.nom.toLowerCase() === h.nom.toLowerCase())) {
            const planKey = h.subscription_tier === 'auberge' ? 'auberge' : 'hotel';
            const estVerrouille = Boolean(h.compte_verrouille || h.statut === 'suspendu');
            realEtablissements.push({
              id: h.id,
              nom: h.nom,
              type: planKey === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence',
              ville: h.ville || 'Dakar',
              chambres: 15,
              directeur: h.email?.split('@')[0] || 'Directeur',
              telephone: h.telephone || '+221 --',
              email: h.email,
              plan: planKey,
              prix: planKey === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m',
              statut: estVerrouille ? 'suspendu' : 'actif',
              compte_verrouille: estVerrouille,
              expireLe: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
              source: 'supabase',
            });
          }
        }
      }
    } catch {
      // Table hotels optionnelle
    }

    if (realEtablissements.length > 0) {
      return [...realEtablissements, ...DEMO_ETABLISSEMENTS];
    }

    return DEMO_ETABLISSEMENTS;
  } catch (err) {
    console.error("Erreur getEtablissementsSuperAdmin:", err);
    return DEMO_ETABLISSEMENTS;
  }
}

export async function creerEtablissementSuperAdmin(formData: FormData) {
  const nom = (formData.get("nom") as string)?.trim();
  const type = (formData.get("type") as string)?.trim() || "hotel";
  const ville = (formData.get("ville") as string)?.trim() || "Dakar";
  const chambres = parseInt((formData.get("chambres") as string) || "15", 10);
  const directeur = (formData.get("directeur") as string)?.trim() || "Directeur";
  const telephone = (formData.get("telephone") as string)?.trim() || "+221 77 000 00 00";
  const email = (formData.get("email") as string)?.trim() || `contact@${nom.toLowerCase().replace(/\s+/g, '')}.sn`;
  const password = (formData.get("password") as string) || "Demba@2026!";
  const plan = (formData.get("plan") as string)?.trim() || "hotel";
  const statut = (formData.get("statut") as string)?.trim() || "actif";

  if (!nom) {
    return { error: "Le nom de l'établissement est requis." };
  }

  try {
    const admin = createAdminClient();

    // 1. Création de l'utilisateur dans Supabase Auth
    const { data: userData, error: userError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nom_complet: directeur,
        telephone,
        etablissement_nom: nom,
        etablissement_type: type,
        plan,
        ville,
        chambres_nb: chambres,
      },
    });

    if (userError) {
      console.warn("Notice création auth user:", userError.message);
    }

    const userId = userData?.user?.id;

    // 2. Création dans public.hotels si la table existe
    try {
      const { data: hotelData } = await admin
        .from("hotels")
        .insert({
          nom,
          telephone,
          email,
          ville,
          subscription_tier: plan,
          statut,
          taux_tva: 18.0,
          taxe_sejour_par_nuit: 1000.0,
        })
        .select("id")
        .maybeSingle();

      const hotelId = hotelData?.id;

      if (userId && hotelId) {
        await admin.from("utilisateurs").upsert({
          id: userId,
          hotel_id: hotelId,
          nom_complet: directeur,
          identifiant: email.split("@")[0],
          telephone,
          role: "directeur",
          actif: statut === "actif",
        });
      }
    } catch (e) {
      console.warn("Notice création table hotels:", e);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/etablissements");

    return {
      success: true,
      etablissement: {
        id: userId || `hot-${Date.now().toString().slice(-4)}`,
        nom,
        type: type === 'auberge' ? 'Auberge & Campement' : 'Hôtel & Résidence',
        ville,
        chambres,
        directeur,
        telephone,
        email,
        plan,
        prix: plan === 'auberge' ? '15 000 FCFA/m' : '20 000 FCFA/m',
        statut: statut as 'actif' | 'essai' | 'suspendu',
        compte_verrouille: statut === 'suspendu',
        expireLe: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
        source: 'supabase',
      },
    };
  } catch (err: any) {
    return { error: err.message || "Erreur lors de la création de l'établissement." };
  }
}

export async function toggleVerrouillerEtablissement(etablissementId: string, bloquer: boolean) {
  const admin = createAdminClient();
  try {
    // 1. Mise à jour de la table hotels
    try {
      await admin
        .from('hotels')
        .update({
          statut: bloquer ? 'suspendu' : 'actif',
          compte_verrouille: bloquer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', etablissementId);
    } catch (e) {
      console.warn('Note mise à jour hotel:', e);
    }

    // 2. Si c\'est un compte Auth ou lié
    try {
      await admin.auth.admin.updateUserById(etablissementId, {
        ban_duration: bloquer ? '87600h' : 'none',
      });
    } catch {
      try {
        const { data: users } = await admin
          .from('utilisateurs')
          .select('id')
          .eq('hotel_id', etablissementId);

        if (users && users.length > 0) {
          for (const u of users) {
            await admin.auth.admin.updateUserById(u.id, {
              ban_duration: bloquer ? '87600h' : 'none',
            });
          }
        }
      } catch { }
    }

    revalidatePath('/admin/etablissements');
    revalidatePath('/admin');
    return { success: true, bloquer };
  } catch (err: any) {
    return { error: err.message || 'Erreur lors du verrouillage' };
  }
}

export interface PaiementAbonnementItem {
  id: string;
  hotelId?: string;
  hotelNom: string;
  montant: number;
  devise: string;
  niveau: string;
  provider: string;
  moyenPaiement: string;
  statut: 'pending' | 'completed' | 'failed';
  notes?: string;
  date: string;
}

export async function getPaiementsAbonnementsSuperAdmin(): Promise<PaiementAbonnementItem[]> {
  const admin = createAdminClient();
  try {
    const { data, error } = await admin
      .from('abonnement_paiements')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        hotelId: p.hotel_id,
        hotelNom: p.hotel_nom || 'Établissement Hôtelier',
        montant: Number(p.montant),
        devise: p.devise || 'XOF',
        niveau: p.niveau,
        provider: p.provider,
        moyenPaiement: p.moyen_paiement,
        statut: p.statut as any,
        notes: p.notes,
        date: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    }
  } catch (err) {
    console.warn('Note getPaiementsAbonnementsSuperAdmin:', err);
  }

  // Fallback démo
  return [
    {
      id: 'PAY-1089',
      hotelNom: 'Hôtel Teranga Palace 5★',
      montant: 216000,
      devise: 'XOF',
      niveau: 'hotel',
      provider: 'virement',
      moyenPaiement: 'virement',
      statut: 'completed',
      date: '2026-10-28',
    },
    {
      id: 'PAY-1088',
      hotelNom: 'Campement Le Bolong Fleuri',
      montant: 15000,
      devise: 'XOF',
      niveau: 'auberge',
      provider: 'maketou',
      moyenPaiement: 'wave',
      statut: 'completed',
      date: '2026-10-25',
    },
    {
      id: 'PAY-1087',
      hotelNom: 'Résidence Palm Beach',
      montant: 20000,
      devise: 'XOF',
      niveau: 'hotel',
      provider: 'maketou',
      moyenPaiement: 'orange',
      statut: 'completed',
      date: '2026-10-20',
    },
    {
      id: 'PAY-1086',
      hotelNom: 'Écolodge du Saloum',
      montant: 162000,
      devise: 'XOF',
      niveau: 'auberge',
      provider: 'chariow',
      moyenPaiement: 'carte',
      statut: 'completed',
      date: '2026-10-15',
    },
  ];
}

export async function validerPaiementCaisse(paiementId: string) {
  const admin = createAdminClient();
  try {
    const { data: p, error } = await admin
      .from('abonnement_paiements')
      .select('*')
      .eq('id', paiementId)
      .maybeSingle();

    if (error || !p) {
      return { error: 'Paiement introuvable' };
    }

    const { fulfillSubscriptionPayment } = await import('@/lib/payments/fulfill');
    await fulfillSubscriptionPayment({
      hotelId: p.hotel_id,
      forfait: p.niveau,
      montant: p.montant,
      provider: 'caisse',
      paymentId: p.id,
    });

    revalidatePath('/admin');
    revalidatePath('/admin/abonnements');
    revalidatePath('/admin/etablissements');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la validation caisse' };
  }
}

export async function validerPaiementVirement(paiementId: string) {
  const admin = createAdminClient();
  try {
    const { data: p, error } = await admin
      .from('abonnement_paiements')
      .select('*')
      .eq('id', paiementId)
      .maybeSingle();

    if (error || !p) {
      return { error: 'Paiement introuvable' };
    }

    const { fulfillSubscriptionPayment } = await import('@/lib/payments/fulfill');
    await fulfillSubscriptionPayment({
      hotelId: p.hotel_id,
      forfait: p.niveau,
      montant: p.montant,
      provider: 'virement',
      paymentId: p.id,
    });

    revalidatePath('/admin');
    revalidatePath('/admin/abonnements');
    revalidatePath('/admin/etablissements');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la validation du virement' };
  }
}

export async function supprimerPaiementAbonnement(paiementId: string) {
  const admin = createAdminClient();
  try {
    await admin.from('abonnement_paiements').delete().eq('id', paiementId);
    revalidatePath('/admin/abonnements');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}


