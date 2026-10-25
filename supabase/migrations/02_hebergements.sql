-- 02_hebergements.sql
-- Types de chambres, chambres physiques et grilles tarifaires

create table if not exists public.chambres_types (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  nom varchar(100) not null, -- Standard, Deluxe, Suite Junior, Suite Présidentielle, Bungalow Plage, Tente Lodge
  code varchar(20) not null,
  capacite_adultes int default 2,
  capacite_enfants int default 1,
  tarif_base_nuit numeric(12,2) not null,
  description text,
  equipements text[], -- wifi, climatisation, tv_satellite, minibar, coffre_fort, baignoire_jacuzzi, balcon_vue_mer
  photos text[],
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.chambres (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  type_id uuid not null references public.chambres_types(id),
  numero varchar(20) not null, -- "101", "Villa 4"
  etage varchar(50) default 'RDC',
  batiment varchar(100) default 'Principal',
  statut_occupation varchar(30) default 'libre', -- libre, reservee, occupee
  statut_menage varchar(30) default 'propre', -- propre, a_nettoyer_recouche, a_nettoyer_blanc, en_cours, a_controler, maintenance
  dernier_menage timestamptz,
  notes_internes text,
  actif boolean default true,
  created_at timestamptz default now(),
  unique(hotel_id, numero)
);

create index if not exists idx_chambres_hotel_statuts on public.chambres (hotel_id, statut_occupation, statut_menage);
