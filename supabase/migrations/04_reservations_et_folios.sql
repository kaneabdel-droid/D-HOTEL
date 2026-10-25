-- 04_reservations_et_folios.sql
-- Réservations avec contrainte anti-surréservation temporelle et Folios unifiés

create extension if not exists btree_gist;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  code_reservation varchar(50) not null unique, -- ex: "RES-2026-00421"
  client_id uuid not null references public.clients(id),
  chambre_id uuid not null references public.chambres(id),
  date_arrivee date not null,
  date_depart date not null,
  heure_arrivee_estimee time,
  nb_adultes int default 1,
  nb_enfants int default 0,
  regime varchar(20) default 'BB', -- RO (Chambre seule), BB (Petit-déj), HB (Demi-pension), FB (Pension complète), AI (All-inclusive)
  tarif_nuit_convenu numeric(12,2) not null,
  statut varchar(30) default 'confirmee', -- attente_acompte, confirmee, check_in, check_out, annulee, no_show
  canal_origine varchar(50) default 'direct', -- direct, telephone, booking, agence, site_web
  acompte_exige numeric(12,2) default 0,
  acompte_verse numeric(12,2) default 0,
  date_check_in timestamptz,
  date_check_out timestamptz,
  remarques text,
  created_at timestamptz default now(),
  constraint check_dates check (date_depart > date_arrivee)
);

-- Folio unique (compte global du séjour)
create table if not exists public.folios (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  client_id uuid not null references public.clients(id),
  total_hebergement numeric(12,2) default 0,
  total_restauration numeric(12,2) default 0,
  total_extras numeric(12,2) default 0,
  total_taxes numeric(12,2) default 0,
  total_facture numeric(12,2) default 0,
  total_regle numeric(12,2) default 0,
  solde_du numeric(12,2) default 0,
  statut varchar(20) default 'ouvert', -- ouvert, solde, cloture
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lignes de dépenses individuelles sur le Folio
create table if not exists public.lignes_folio (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  folio_id uuid not null references public.folios(id) on delete cascade,
  categorie varchar(30) not null, -- nuitee, taxe_sejour, restaurant, bar, room_service, blanchisserie, excursion, spa, divers
  designation varchar(255) not null,
  quantite numeric(10,2) default 1,
  prix_unitaire numeric(12,2) not null,
  montant_total numeric(12,2) not null,
  reference_externe_id uuid, -- lien commande restaurant, billetterie, etc.
  auteur_id uuid references public.utilisateurs(id),
  date_consommation timestamptz default now()
);

create index if not exists idx_reservations_dates on public.reservations (chambre_id, date_arrivee, date_depart);
create index if not exists idx_reservations_statut on public.reservations (hotel_id, statut);
create index if not exists idx_lignes_folio on public.lignes_folio (folio_id);
