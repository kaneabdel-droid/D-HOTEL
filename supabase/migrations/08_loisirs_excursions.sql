-- 08_loisirs_excursions.sql
-- Catalogue d'activités, randonnées, excursions et plannings des sorties

create table if not exists public.activites_catalogue (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  titre varchar(150) not null, -- Safari Réserve de Bandia, Balade en Pirogue Iles du Saloum, Randonnée VTT Dunes, Massage Relaxant Spa
  type varchar(50) default 'excursion', -- excursion, randonnee, nautique, spa, sport
  duree_heures numeric(4,1) default 3.0,
  prix_par_adulte numeric(12,2) not null,
  prix_par_enfant numeric(12,2) default 0,
  capacite_max int default 12,
  description text,
  equipement_fourni text,
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.sessions_excursion (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  activite_id uuid not null references public.activites_catalogue(id),
  date_sortie date not null,
  heure_depart time not null,
  guide_id uuid references public.utilisateurs(id),
  vehicule_assigne varchar(100), -- Minibus 1, 4x4 Safari, Pirogue Bleue
  statut varchar(20) default 'programmee', -- programmee, complete, en_cours, terminee, annulee
  created_at timestamptz default now()
);

create table if not exists public.inscriptions_activite (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  session_id uuid not null references public.sessions_excursion(id) on delete cascade,
  client_id uuid not null references public.clients(id),
  chambre_id uuid references public.chambres(id),
  nb_adultes int default 1,
  nb_enfants int default 0,
  montant_total numeric(12,2) not null,
  decharge_responsabilite_signee boolean default true,
  statut_paiement varchar(30) default 'en_attente', -- en_attente, regle_comptant, impute_chambre
  created_at timestamptz default now()
);

create index if not exists idx_sessions_dates on public.sessions_excursion (hotel_id, date_sortie);
