import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { verifierSecuriteRequete } from "@/lib/security";
import { createAdminIdentityMiddlewareClient } from "@/utils/supabase/admin-identity";
import { isAdminEmail } from "@/lib/admin/auth";

const PUBLIC_PREFIXES = [
  "/login",
  "/mot-de-passe-oublie",
  "/reservation/merci",
  "/auth",
  "/api/cron",
  "/robots.txt",
  "/favicon.ico",
  "/decouvrir-dhotel",
  "/guide",
  "/tarifs",
];

export async function updateSession(request: NextRequest) {
  // 1. Bouclier de sécurité anti-intrusion
  const reponseSecurite = verifierSecuriteRequete(request);
  if (reponseSecurite) return reponseSecurite;

  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Webhooks et crons
  if (pathname.startsWith('/api/cron') || pathname.startsWith('/api/webhooks')) {
    return supabaseResponse;
  }

  // 2. Gestion de l'espace SuperAdmin (/admin)
  if (pathname === '/admin/login') {
    return supabaseResponse;
  }

  if (pathname.startsWith('/admin')) {
    let adminUser = null;
    try {
      adminUser = await createAdminIdentityMiddlewareClient(request, supabaseResponse)
        .auth.getUser()
        .then(({ data }: any) => data?.user);
    } catch {
      adminUser = null;
    }

    const hasLegacyAdmin = Boolean(request.cookies.get('d_hotel_admin_session')?.value);

    if (isAdminEmail(adminUser?.email) || hasLegacyAdmin) {
      return supabaseResponse;
    }

    // Non connecté ou non autorisé : redirection vers le login admin
    const returnTo = `https://d-hotel.dembasolution.com${pathname}${request.nextUrl.search}`;
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = `?next=${encodeURIComponent(returnTo)}`;
    return NextResponse.redirect(url);
  }

  // 3. Espace applicatif client de D-HOTEL
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: sessionData } = await supabase.auth.getUser();
  const connecte = Boolean(sessionData?.user);
  const estPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!connecte && !estPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (connecte && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
