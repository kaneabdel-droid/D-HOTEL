import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function handleLogout(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Erreur lors du signOut Supabase:", err);
  }

  const cookieStore = await cookies();
  cookieStore.delete("d_hotel_session");
  cookieStore.delete("dhotel_demo_role");
  cookieStore.delete("demba_offline_active");

  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("d_hotel_session");
  response.cookies.delete("dhotel_demo_role");
  response.cookies.delete("demba_offline_active");

  return response;
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}
