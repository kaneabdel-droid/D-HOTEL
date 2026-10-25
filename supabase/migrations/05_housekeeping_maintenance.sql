-- 05_housekeeping_maintenance.sql
-- Gouvernance, minibar, objets trouvés et maintenance technique

create table if not exists public.tickets_maintenance (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  chambre_id uuid references public.chambres(id) on delete set null,
  titre varchar(255) not null,
  description text,
  degre_urgence varchar(20) default 'moyen', -- faible, moyen, urgent, bloquant
  statut varchar(20) default 'ouvert', -- ouvert, en_cours, resolu, ferme
  photo_url text,
  declare_par_id uuid references public.utilisateurs(id),
  assigne_a_id uuid references public.utilisateurs(id),
  date_resolution timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.minibar_consommations (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  chambre_id uuid not null references public.chambres(id),
  article_nom varchar(100) not null,
  quantite int not null default 1,
  prix_unitaire numeric(12,2) not null,
  declare_par_id uuid references public.utilisateurs(id),
  facture boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.objets_trouves (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  chambre_id uuid references public.chambres(id),
  description text not null,
  lieu_precis varchar(255),
  photo_url text,
  statut varchar(20) default 'en_stock', -- en_stock, restitue, jete
  trouve_par_id uuid references public.utilisateurs(id),
  restitue_a_client_id uuid references public.clients(id),
  date_restitution timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_maintenance_hotel_statut on public.tickets_maintenance (hotel_id, statut);
