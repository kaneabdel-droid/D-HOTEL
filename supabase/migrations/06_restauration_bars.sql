-- 06_restauration_bars.sql
-- Points de vente, tables, cartes/menus, KDS et déstockage des recettes

create table if not exists public.points_vente (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  nom varchar(100) not null, -- Restaurant Gastronomique, Bar Piscine, Paillote Plage, Room-Service
  type varchar(50) default 'restaurant', -- restaurant, bar, snack, room_service
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.tables_restaurant (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  point_vente_id uuid not null references public.points_vente(id) on delete cascade,
  numero varchar(50) not null, -- Table 1, Terrasse 4, Transat 12
  capacite int default 4,
  statut varchar(20) default 'libre', -- libre, occupee, addition_demandee
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.articles_menu (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  point_vente_id uuid references public.points_vente(id) on delete set null,
  nom varchar(150) not null,
  categorie varchar(50) not null, -- Entrées, Plats Locaux, Grillades, Desserts, Cocktails, Boissons, Vins
  prix_vente numeric(12,2) not null,
  cout_estime numeric(12,2) default 0,
  description text,
  allergens text[],
  disponible boolean default true,
  photo_url text,
  created_at timestamptz default now()
);

create table if not exists public.commandes_restaurant (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  point_vente_id uuid not null references public.points_vente(id),
  table_id uuid references public.tables_restaurant(id),
  serveur_id uuid references public.utilisateurs(id),
  chambre_imputee_id uuid references public.chambres(id),
  statut varchar(30) default 'en_attente', -- en_attente, en_cuisine, pret, servi, regle, annule
  mode_reglement varchar(30), -- especes, mobile_money, carte, imputation_chambre
  montant_ht numeric(12,2) not null default 0,
  montant_tva numeric(12,2) not null default 0,
  montant_total numeric(12,2) not null default 0,
  date_commande timestamptz default now()
);

create table if not exists public.lignes_commande_restaurant (
  id uuid primary key default gen_random_uuid(),
  commande_id uuid not null references public.commandes_restaurant(id) on delete cascade,
  article_id uuid not null references public.articles_menu(id),
  quantite int not null default 1,
  prix_unitaire numeric(12,2) not null,
  montant_total numeric(12,2) not null,
  cuisson_instructions text,
  statut_kds varchar(20) default 'en_attente' -- en_attente, en_preparation, pret
);

create index if not exists idx_commandes_kds on public.commandes_restaurant (hotel_id, statut);
