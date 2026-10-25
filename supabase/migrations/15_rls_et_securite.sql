-- 15_rls_et_securite.sql
-- Politiques Row-Level Security (RLS) étanches par établissement hôtelier

-- Fonction utilitaire retournant l'hotel_id de l'utilisateur connecté
create or replace function public.mon_hotel_id()
returns uuid language sql stable security definer as $$
  select hotel_id from public.utilisateurs where id = auth.uid() limit 1;
$$;

-- Activation RLS sur toutes les tables
alter table public.hotels enable row level security;
alter table public.utilisateurs enable row level security;
alter table public.chambres_types enable row level security;
alter table public.chambres enable row level security;
alter table public.clients enable row level security;
alter table public.reservations enable row level security;
alter table public.folios enable row level security;
alter table public.lignes_folio enable row level security;
alter table public.tickets_maintenance enable row level security;
alter table public.points_vente enable row level security;
alter table public.tables_restaurant enable row level security;
alter table public.articles_menu enable row level security;
alter table public.commandes_restaurant enable row level security;
alter table public.espaces_mice enable row level security;
alter table public.reservations_evenements enable row level security;
alter table public.daypass_piscine enable row level security;
alter table public.activites_catalogue enable row level security;
alter table public.sessions_excursion enable row level security;
alter table public.inscriptions_activite enable row level security;
alter table public.depots_stock enable row level security;
alter table public.articles_stock enable row level security;
alter table public.stocks enable row level security;
alter table public.mouvements_stock enable row level security;
alter table public.comptes_tresorerie enable row level security;
alter table public.sessions_caisse enable row level security;
alter table public.reglements enable row level security;
alter table public.paiements_maketou enable row level security;

-- Politiques RLS types (Séparation étanche par hotel_id)
create policy "hotel_isole_hotels" on public.hotels
  for select using (id = public.mon_hotel_id());

create policy "hotel_isole_utilisateurs" on public.utilisateurs
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_chambres" on public.chambres
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_reservations" on public.reservations
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_folios" on public.folios
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_lignes_folio" on public.lignes_folio
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_commandes" on public.commandes_restaurant
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_stocks" on public.stocks
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_tresorerie" on public.sessions_caisse
  for all using (hotel_id = public.mon_hotel_id());

create policy "hotel_isole_maketou" on public.paiements_maketou
  for all using (hotel_id = public.mon_hotel_id());
