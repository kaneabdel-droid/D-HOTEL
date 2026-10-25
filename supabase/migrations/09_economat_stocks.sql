-- 09_economat_stocks.sql
-- Économat, gestion multi-dépôts, stocks et mouvements append-only

create table if not exists public.depots_stock (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  nom varchar(100) not null, -- Économat Central, Cave & Bar, Cuisine Principale, Lingerie, Produits Entretien
  responsable_id uuid references public.utilisateurs(id),
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.articles_stock (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  designation varchar(150) not null,
  categorie varchar(50) not null, -- alimentaire, boisson, hygiene, linge, technique
  unite varchar(20) not null default 'kg', -- kg, litre, piece, carton, bouteille
  seuil_alerte numeric(10,2) default 5.0,
  cout_unitaire_moyen numeric(12,2) default 0,
  fournisseur_prefere varchar(150),
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  depot_id uuid not null references public.depots_stock(id) on delete cascade,
  article_id uuid not null references public.articles_stock(id) on delete cascade,
  quantite_disponible numeric(12,2) not null default 0,
  derniere_maj timestamptz default now(),
  unique(depot_id, article_id)
);

create table if not exists public.mouvements_stock (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  depot_id uuid not null references public.depots_stock(id),
  article_id uuid not null references public.articles_stock(id),
  type_mouvement varchar(20) not null, -- entree_achat, sortie_cuisine, transfert, perte_casse, inventaire
  quantite numeric(12,2) not null,
  cout_unitaire numeric(12,2) default 0,
  motif text,
  auteur_id uuid references public.utilisateurs(id),
  created_at timestamptz default now()
);

create index if not exists idx_stocks_dispo on public.stocks (hotel_id, depot_id, article_id);
create index if not exists idx_mouvements_date on public.mouvements_stock (hotel_id, created_at);
