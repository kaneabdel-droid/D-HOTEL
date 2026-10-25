-- 00_schema_hotels.sql
-- Table centrale des établissements hôteliers / complexes touristiques (Multi-Tenancy)

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  nom varchar(255) not null,
  forme_juridique varchar(50) default 'SARL',
  ninea varchar(50),
  rccm varchar(50),
  telephone varchar(50) not null,
  email varchar(255),
  site_web varchar(255),
  adresse text,
  ville varchar(100) default 'Dakar',
  pays varchar(10) default 'SN',
  devise varchar(10) default 'XOF',
  taux_tva numeric(5,2) default 18.00,
  taxe_sejour_par_nuit numeric(10,2) default 1000.00,
  logo_url text,
  subscription_tier varchar(50) default 'standard', -- starter, pro, resort
  statut varchar(20) default 'actif', -- actif, suspendu
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_hotels_statut on public.hotels (statut);
