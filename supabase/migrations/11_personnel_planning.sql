-- 11_personnel_planning.sql
-- Planning des quarts (shifts), présences et gestion du tronc des pourboires

create table if not exists public.quarts_travail (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  nom varchar(50) not null, -- Quart Matin, Quart Soir, Quart Nuit, Journée Continue
  heure_debut time not null,
  heure_fin time not null,
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.plannings_personnel (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  utilisateur_id uuid not null references public.utilisateurs(id) on delete cascade,
  quart_id uuid not null references public.quarts_travail(id),
  date_poste date not null,
  statut_presence varchar(20) default 'prevu', -- prevu, present, retard, absence_justifiee, absence_injustifiee
  remarques text,
  unique(utilisateur_id, date_poste)
);

create table if not exists public.pourboires_tronc (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  date_collecte date not null default current_date,
  montant_total numeric(12,2) not null,
  departement varchar(50) default 'restaurant', -- restaurant, bar, reception, bagagistes
  statut_repartition varchar(20) default 'en_attente', -- en_attente, distribue
  date_distribution timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_plannings_dates on public.plannings_personnel (hotel_id, date_poste);
