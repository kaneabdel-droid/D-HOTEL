"use server";

import { cookies } from "next/headers";
import { type Locale, locales, defaultLocale } from "@/dictionaries";

export async function setLanguage(lang: string) {
  const cookieStore = await cookies();
  const validLocale = locales.includes(lang as Locale) ? (lang as Locale) : defaultLocale;
  cookieStore.set("lang", validLocale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return { success: true, locale: validLocale };
}
