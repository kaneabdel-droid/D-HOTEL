import { AppShell } from "@/components/AppShell";
import { getDictionary, getLocale } from "@/dictionaries";
import { I18nProvider, type Locale } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary();
  const locale = (await getLocale()) as Locale;

  return (
    <I18nProvider dict={dict} locale={locale}>
      <AppShell>{children}</AppShell>
    </I18nProvider>
  );
}
