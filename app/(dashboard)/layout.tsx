import { AppShell } from "@/components/AppShell";
import { getDictionary, getLocale } from "@/dictionaries";
import { I18nProvider, type Locale } from "@/lib/i18n";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const DEMO_PROFILES: Record<string, { nom: string; role: string; hotel: string }> = {
  directeur: {
    nom: "Mamadou Sow (Directeur)",
    role: "Direction Générale",
    hotel: "Hôtel Teranga Palace 5★",
  },
  receptionniste: {
    nom: "Aïcha Ba (Réception)",
    role: "Réception & Front-Desk",
    hotel: "Hôtel Teranga Palace 5★",
  },
  serveur: {
    nom: "Babacar Diagne (Maître d'Hôtel)",
    role: "Restauration & Bar POS",
    hotel: "Hôtel Teranga Palace 5★",
  },
  gouvernante: {
    nom: "Mariama Fall (Gouvernante)",
    role: "Gouvernance & Étages",
    hotel: "Hôtel Teranga Palace 5★",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary();
  const locale = (await getLocale()) as Locale;

  let utilisateurNom = "Mamadou Sow (Directeur)";
  let roleLibelle = "Direction Générale";
  let hotelNom = "Hôtel Teranga Palace 5★";

  const cookieStore = await cookies();
  const demoRole = cookieStore.get("dhotel_demo_role")?.value;

  if (demoRole && DEMO_PROFILES[demoRole]) {
    utilisateurNom = DEMO_PROFILES[demoRole].nom;
    roleLibelle = DEMO_PROFILES[demoRole].role;
    hotelNom = DEMO_PROFILES[demoRole].hotel;
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const meta = user.user_metadata || {};
      utilisateurNom = meta.nom_complet || meta.nom || user.email?.split("@")[0] || utilisateurNom;
      if (meta.etablissement_nom) hotelNom = meta.etablissement_nom;

      const { data: profile } = await supabase
        .from("utilisateurs")
        .select("role, nom, hotel_id, gie_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        if (profile.nom) utilisateurNom = profile.nom;
        if (profile.role) {
          const roleMap: Record<string, string> = {
            directeur: "Direction Générale",
            admin: "Administrateur Système",
            receptionniste: "Réception & Front-Desk",
            serveur: "Restauration & Bar",
            caissier: "Caisse & Facturation",
            gouvernante: "Service des Étages",
            econome: "Économat & Stocks",
          };
          roleLibelle = roleMap[profile.role] || profile.role;
        }

        const hotelId = profile.hotel_id || profile.gie_id;
        if (hotelId) {
          const { data: hData } = await supabase
            .from("hotels")
            .select("nom")
            .eq("id", hotelId)
            .maybeSingle();
          if (hData?.nom) hotelNom = hData.nom;
        }
      }
    }
  } catch (err) {
    // Repli démo sans crash
    console.warn("Échec chargement profil hôtelier:", err);
  }

  return (
    <I18nProvider dict={dict} locale={locale}>
      <AppShell
        hotelNom={hotelNom}
        utilisateurNom={utilisateurNom}
        roleLibelle={roleLibelle}
      >
        {children}
      </AppShell>
    </I18nProvider>
  );
}
