"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";

export async function signupHotelAction(formData: FormData) {
  const etablissementNom = (formData.get("etablissement_nom") as string)?.trim();
  const etablissementType = (formData.get("etablissement_type") as string)?.trim() || "hotel";
  const plan = (formData.get("plan") as string)?.trim() || "hotel";
  const cycle = (formData.get("cycle") as string)?.trim() || "yearly";
  const directeurNom = (formData.get("directeur_nom") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const telephone = (formData.get("telephone") as string)?.trim();
  const password = formData.get("password") as string;
  const chambresNb = parseInt((formData.get("chambres_nb") as string) || "10", 10);

  if (!etablissementNom || !email || !password) {
    redirect("/signup?error=Veuillez renseigner le nom de l'établissement, votre email et votre mot de passe.");
  }

  const supabase = await createClient();

  // Inscription Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nom_complet: directeurNom || "Directeur",
        telephone,
        etablissement_nom: etablissementNom,
        etablissement_type: etablissementType,
        plan,
        cycle,
        chambres_nb: chambresNb,
      },
    },
  });

  if (authError) {
    redirect(`/signup?error=${encodeURIComponent(authError.message)}`);
  }

  const userId = authData.user?.id;

  // Création dans public.hotels et public.utilisateurs via admin client
  try {
    const admin = createAdminClient();

    const { data: hotelData } = await admin
      .from("hotels")
      .insert({
        nom: etablissementNom,
        telephone: telephone || "Non renseigné",
        email: email,
        subscription_tier: plan,
        statut: "actif",
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
        nom_complet: directeurNom || etablissementNom,
        identifiant: email.split("@")[0],
        telephone: telephone || null,
        role: "directeur",
        actif: true,
      });
    }
  } catch (err) {
    console.warn("Erreur non bloquante création tables hotel/utilisateur:", err);
  }

  if (authData.session) {
    redirect("/dashboard");
  } else {
    redirect("/login?message=Votre établissement a été créé avec succès ! Connectez-vous pour configurer vos chambres.");
  }
}
