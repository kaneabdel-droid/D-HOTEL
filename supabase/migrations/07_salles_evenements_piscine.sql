-- 07_salles_evenements_piscine.sql
-- MICE (Salles, Séminaires, Banquets), Billetterie Piscine & Soirées

create table if not exists public.espaces_mice (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  nom varchar(100) not null, -- Salle Baobab, Salon VIP Teranga, Esplanade Océane
  type varchar(50) default 'salle_reunion', -- salle_reunion, salon_vip, jardin_mariage, terrasse
  capacite_theatre int default 50,
  capacite_banquet int default 30,
  capacite_en_u int default 25,
  tarif_journee numeric(12,2) not null,
  tarif_demi_journee numeric(12,2) not null,
  equipements text[], -- videoprojecteur, sono, micros, paperboard, wifi_dedie
  actif boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.reservations_evenements (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  espace_id uuid not null references public.espaces_mice(id),
  titre_evenement varchar(255) not null, -- ex: "Séminaire Banque Mondiale", "Mariage Fall-Diagne"
  client_nom varchar(255) not null,
  client_contact varchar(100) not null,
  date_debut date not null,
  date_fin date not null,
  disposition varchar(50) default 'theatre',
  nb_participants int default 20,
  forfait_restauration text, -- pauses_cafe_incluses, dejeuner_buffet
  montant_total numeric(12,2) not null,
  acompte_verse numeric(12,2) default 0,
  statut varchar(20) default 'confirme', -- devis, confirme, en_cours, termine, annule
  created_at timestamptz default now()
);

create table if not exists public.daypass_piscine (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  numero_ticket varchar(50) not null,
  client_nom varchar(100) not null,
  client_telephone varchar(50),
  formule varchar(50) default 'adulte_simple', -- adulte_simple, enfant_simple, pass_avec_dejeuner
  prix numeric(12,2) not null,
  date_validite date not null default current_date,
  serviettes_pretees int default 1,
  caution_serviette numeric(12,2) default 5000.00,
  caution_restituee boolean default false,
  mode_paiement varchar(30) default 'especes',
  created_at timestamptz default now()
);

create index if not exists idx_evenements_dates on public.reservations_evenements (hotel_id, date_debut, date_fin);
create index if not exists idx_daypass_date on public.daypass_piscine (hotel_id, date_validite);
