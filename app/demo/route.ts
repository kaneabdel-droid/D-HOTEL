import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "directeur";
  const next = searchParams.get("next") || "/dashboard";

  const response = NextResponse.redirect(new URL(next, request.url));
  const options = { path: "/", maxAge: 86400, sameSite: "lax" as const };

  response.cookies.set("dhotel_demo_role", role, options);
  response.cookies.set("d_hotel_session", "demo", options);
  response.cookies.set("dhotel_demo_session", "1", options);

  return response;
}

