import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Hotel } from "lucide-react";
import ClientSignupForm from "./ClientSignupForm";

export const metadata = {
  title: "Créer un compte • D-HOTEL DEMBA Hospitality Suite",
  description:
    "Activez votre établissement sur D-HOTEL. PMS hôtelier moderne, Touch POS Restaurant & Bar, et fiches de police dématérialisées.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header Minimaliste */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-amber-500/20">
              H
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">D-HOTEL</span>
              <span className="block text-[9px] text-amber-400 font-semibold tracking-widest uppercase">
                DEMBA Hospitality Suite
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Déjà un compte ? <span className="text-amber-400 font-semibold underline underline-offset-4">Connexion</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Activez votre établissement sur D-HOTEL
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
            PMS intuitif, fiches de police 1-clic et caisse restaurant tactile. Opérationnel en 2 minutes sans carte bancaire.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-12 text-center text-slate-500 text-xs">
              Chargement du formulaire...
            </div>
          }
        >
          <ClientSignupForm />
        </Suspense>

        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Données souveraines cryptées • Support client WhatsApp 7j/7</span>
        </div>
      </main>
    </div>
  );
}
