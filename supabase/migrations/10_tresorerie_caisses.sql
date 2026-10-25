-- 10_tresorerie_caisses.sql
-- Multi-caisses, sessions de caisse avec clôture aveugle et règlements

create table if not exists public.comptes_tresorerie (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  libelle varchar(100) not null, -- Caisse Réception, Caisse Bar, Compte Wave Business, Compte Orange Money, Compte Bancaire BOA
  type varchar(20) not null, -- caisse_physique, banque, mobile_money
  solde_courant numeric(14,2) default 0,
  devise varchar(10) default 'XOF',
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.sessions_caisse (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  compte_id uuid not null references public.comptes_tresorerie(id),
  caissier_id uuid not null references public.utilisateurs(id),
  date_ouverture timestamptz not null default now(),
  date_fermeture timestamptz,
  fond_caisse_ouverture numeric(12,2) not null default 0,
  total_encaissements numeric(12,2) default 0,
  total_decaissements numeric(12,2) default 0,
  montant_theorique_fermeture numeric(12,2) default 0,
  montant_reel_compte numeric(12,2), -- Comptage physique aveugle par l'opérateur
  ecart numeric(12,2), -- montant_reel_compte - montant_theorique_fermeture
  statut varchar(20) default 'ouverte', -- ouverte, fermee, validee_direction
  commentaire_cloture text,
  valide_par_id uuid references public.utilisateurs(id)
);

create table if not exists public.reglements (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  session_caisse_id uuid references public.sessions_caisse(id),
  folio_id uuid references public.folios(id),
  reservation_id uuid references public.reservations(id),
  client_id uuid references public.clients(id),
  montant numeric(12,2) not null,
  mode_paiement varchar(30) not null, -- especes, wave, orange_money, carte_bancaire, virement, cheque
  reference_transaction varchar(100), -- numéro Wave / transaction ID
  date_reglement timestamptz default now(),
  auteur_id uuid references public.utilisateurs(id)
);

create index if not exists idx_sessions_caisse on public.sessions_caisse (hotel_id, statut);
create index if not exists idx_reglements_folio on public.reglements (folio_id);
