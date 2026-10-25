import { NextResponse, type NextRequest } from "next/server";

// Signatures courantes de probing ou d'attaque à rejeter immédiatement avec 403 Forbidden
const MOTIFS_SUSPECTS = [
  /\.env(\.|$)/i,
  /\.git(\/|$)/i,
  /wp-(admin|login|content|includes)/i,
  /\.php$/i,
  /\.sql$/i,
  /\/(eval-stdin|telescope|actuator|xmlrpc\.php)/i,
  /\/\.aws\//i,
];

export function verifierSecuriteRequete(req: NextRequest): NextResponse | null {
  const pathname = req.nextUrl.pathname;

  for (const motif of MOTIFS_SUSPECTS) {
    if (motif.test(pathname)) {
      return new NextResponse("Accès strictement interdit.", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }

  return null;
}
