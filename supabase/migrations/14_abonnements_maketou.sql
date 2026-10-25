-- 14_abonnements_maketou.sql
-- Intégration Maketou (Mobile Money & Cartes) pour acomptes et abonnements SaaS

create table if not exists public.paiements_maketou (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  cart_id varchar(100) not null unique, -- ID du panier Maketou
  reservation_id uuid references public.reservations(id) on delete set null,
  folio_id uuid references public.folios(id) on delete set null,
  type varchar(30) not null default 'acompte_reservation', -- acompte_reservation, solde_folio, abonnement_saas
  montant numeric(12,2) not null,
  devise varchar(10) default 'XOF',
  statut varchar(30) not null default 'waiting_payment', -- waiting_payment, completed, payment_failed, abandoned
  payment_id varchar(100),
  mode_paiement varchar(50), -- wave, orange_money, carte_bancaire
  client_telephone varchar(50),
  client_email varchar(255),
  derniere_verification timestamptz default now(),
  date_paiement_confirme timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_maketou_cart on public.paiements_maketou (cart_id);
create index if not exists idx_maketou_statut on public.paiements_maketou (statut);
