-- 12_comptabilite_syscohada.sql
-- Plan comptable hôtelier SYSCOHADA Révisé et grand-livre des écritures

create table if not exists public.comptes_comptables (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  numero_compte varchar(20) not null, -- 7061, 7011, 7012, 7062, 7063, 4111, 4114, 4431, 4433, 5211, 5711
  intitule varchar(150) not null,
  classe int not null,
  type varchar(20) not null, -- actif, passif, charge, produit
  actif boolean default true,
  unique(hotel_id, numero_compte)
);

create table if not exists public.pieces_comptables (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  journal varchar(20) not null, -- VTE (Ventes), BQE (Banque), CAI (Caisse), ACH (Achats), OD (Opérations diverses)
  numero_piece varchar(50) not null,
  date_piece date not null,
  libelle varchar(255) not null,
  validee boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.lignes_ecriture (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references public.pieces_comptables(id) on delete cascade,
  compte_id uuid not null references public.comptes_comptables(id),
  debit numeric(14,2) default 0,
  credit numeric(14,2) default 0,
  libelle_ligne varchar(255),
  constraint check_equilibre check (debit >= 0 and credit >= 0 and not (debit > 0 and credit > 0))
);

create index if not exists idx_pieces_dates on public.pieces_comptables (hotel_id, date_piece);
create index if not exists idx_lignes_compte on public.lignes_ecriture (compte_id);
