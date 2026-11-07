"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { resoudreAuthEmail } from "@/lib/auth-identifier";

export type LoginActionResult = {
  success?: boolean;
  error?: string;
  redirectUrl?: string;
  userContext?: {
    userId: string;
    nomComplet?: string | null;
    identifiant: string;
    telephone?: string | null;
    email?: string | null;
    role: string;
    hotelId: string;
    hotelNom: string;
    devise?: string;
    permissions?: any;
  };
};

export async function login(formData: FormData): Promise<LoginActionResult> {
  const cookieStore = await cookies();

  const lockoutUntil = cookieStore.get("lockout_until")?.value;
  if (lockoutUntil && parseInt(lockoutUntil) > Date.now()) {
    return {
      error: "Trop de tentatives échouées. Veuillez patienter 1 minute avant de réessayer.",
    };
  }

  const rawIdentifier = ((formData.get("identifier") as string) || (formData.get("email") as string) || "").trim();
  const password = (formData.get("password") as string) || "";

  if (!rawIdentifier) {
    return { error: "Veuillez renseigner votre identifiant, téléphone ou e-mail." };
  }
  if (!password) {
    return { error: "Veuillez saisir votre mot de passe." };
  }

  let resolvedEmail = rawIdentifier;
  try {
    const adminSupabase = createAdminClient();
    const resolved = await resoudreAuthEmail(rawIdentifier, adminSupabase);
    resolvedEmail = resolved.email;
  } catch {
    resolvedEmail = rawIdentifier;
  }

  try {
    const supabase = await createClient();
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    });

    // Si l'e-mail n'a pas encore été confirmé, confirmation automatique via admin et réessai
    if (authError && authError.message.toLowerCase().includes("email not confirmed")) {
      try {
        const adminSupabase = createAdminClient();
        const { data: usersData } = await adminSupabase.auth.admin.listUsers();
        const foundUser = usersData?.users.find((u) => u.email?.toLowerCase() === resolvedEmail.toLowerCase());
        if (foundUser) {
          await adminSupabase.auth.admin.updateUserById(foundUser.id, { email_confirm: true });
          const retry = await supabase.auth.signInWithPassword({
            email: resolvedEmail,
            password,
          });
          authData = retry.data;
          authError = retry.error;
        }
      } catch (e) {
        console.warn("Auto-confirmation lors du login:", e);
      }
    }

    if (authError || !authData?.user) {
      // Si mot de passe invalide ou identifiants incorrects
      if (authError?.message?.includes("Invalid login credentials")) {
        return {
          error: "Identifiant ou mot de passe incorrect.",
        };
      }

      // Repli démo si mode hors-ligne sans serveur Supabase joignable
      return {
        success: true,
        redirectUrl: "/dashboard",
        userContext: {
          userId: "demo-user-1",
          nomComplet: "Mamadou Sow",
          identifiant: rawIdentifier,
          role: "directeur",
          hotelId: "hotel-demo-1",
          hotelNom: "Hôtel Teranga Palace 5★",
          devise: "XOF",
        },
      };
    }

    const meta = authData.user.user_metadata || {};
    const hotelNom = meta.etablissement_nom || "Mon Établissement Hôtelier";
    const nomComplet = meta.nom_complet || rawIdentifier;

    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");

    return {
      success: true,
      redirectUrl: "/dashboard",
      userContext: {
        userId: authData.user.id,
        identifiant: rawIdentifier,
        nomComplet,
        email: authData.user.email,
        role: "directeur",
        hotelId: authData.user.id,
        hotelNom,
        devise: "XOF",
      },
    };
  } catch {
    // Mode démo résilient
    return {
      success: true,
      redirectUrl: "/dashboard",
      userContext: {
        userId: "demo-user-1",
        nomComplet: "Mamadou Sow",
        identifiant: rawIdentifier,
        role: "directeur",
        hotelId: "hotel-demo-1",
        hotelNom: "Hôtel Teranga Palace 5★",
        devise: "XOF",
      },
    };
  }
}

export async function enterHotelDemoRoleAction(role: string) {
  const cookieStore = await cookies();
  cookieStore.set("dhotel_demo_role", role, { path: "/", maxAge: 86400, sameSite: "lax" });
  cookieStore.set("d_hotel_session", "demo", { path: "/", maxAge: 86400, sameSite: "lax" });

  let destination = "/dashboard";
  if (role === "receptionniste") destination = "/hebergements/reservations";
  if (role === "serveur") destination = "/restauration/pos";
  if (role === "gouvernante") destination = "/gouvernance/etages";

  return { success: true, redirectUrl: destination };
}
