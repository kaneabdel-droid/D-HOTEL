-- 03_clients.sql
-- Fichier clients (CRM), fiches d'identité et historique voyageur

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  civilite varchar(10) default 'M.',
  nom varchar(100) not null,
  prenom varchar(100),
  telephone varchar(50) not null,
  email varchar(255),
  type_piece varchar(20) default 'passeport', -- cni, passeport, permis
  numero_piece varchar(100),
  date_expiration_piece date,
  nationalite varchar(100) default 'Sénégalaise',
  profession varchar(100),
  ville_residence varchar(100),
  pays_residence varchar(10) default 'SN',
  est_vip boolean default false,
  remarques_preferences text,
  piece_scan_url text,
  created_at timestamptz default now()
);

create index if not exists idx_clients_hotel_telephone on public.clients (hotel_id, telephone);
create index if not exists idx_clients_hotel_nom on public.clients (hotel_id, lower(nom));
