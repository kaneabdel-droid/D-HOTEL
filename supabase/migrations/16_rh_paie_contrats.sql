-- 16_rh_paie_contrats.sql
-- Module RH complet pour D-HOTEL : Salariés, Prestataires, Contrats, Conventions, Pointage, Paie, Cotisations sociales & Fiscalité (OHADA / Sénégal)

-- 1. Table des Collaborateurs (Salariés permanents, saisonniers, extras et prestataires extérieurs)
create table if not exists public.rh_salaries (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  matricule varchar(30) not null,
  nom varchar(100) not null,
  prenom varchar(100) not null,
  statut varchar(30) not null default 'permanent', -- permanent, saisonnier, journalier, prestataire
  poste varchar(100) not null,
  departement varchar(100) not null, -- Reception, Housekeeping, Cuisine, Restaurant, Maintenance, etc.
  date_embauche date not null default current_date,
  telephone varchar(30),
  email varchar(120),
  
  -- Fiscalité & Situation de Famille (CGI Sénégal)
  situation_familiale varchar(20) default 'celibataire', -- celibataire, marie, divorce, veuf
  nombre_enfants int default 0,
  nombre_conjoints int default 0,
  parts_ir numeric(3,1) default 1.0,
  regime_ipres varchar(20) default 'general', -- general, cadre, exempte
  numero_ipres varchar(50),
  numero_css varchar(50),
  
  -- Rémunération contractuelle de base
  categorie_conventionnelle varchar(50), -- CAT-1 à CAT-9, CADRE-DIR
  salaire_base numeric(12,2) not null default 0,
  sursalaire numeric(12,2) default 0,
  primes_mensuelles numeric(12,2) default 0,
  indemnite_transport numeric(12,2) default 26000,
  
  -- Mode de règlement
  mode_paiement varchar(30) default 'virement', -- virement, wave, orange_money, cheque, especes
  coordonnees_bancaires text,
  
  actif boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(hotel_id, matricule)
);

-- 2. Table des Contrats de Travail & Conventions
create table if not exists public.rh_contrats (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  salarie_id uuid not null references public.rh_salaries(id) on delete cascade,
  type_contrat varchar(30) not null, -- cdi, cdd, saisonnier, journalier, prestation, stage
  numero_contrat varchar(50),
  date_debut date not null,
  date_fin date, -- null pour CDI
  periode_essai_mois int default 1,
  salaire_base numeric(12,2) not null,
  sursalaire numeric(12,2) default 0,
  primes_mensuelles numeric(12,2) default 0,
  categorie_conventionnelle varchar(50),
  statut varchar(20) default 'actif', -- actif, cloture, suspendu
  fichier_contrat_url text,
  created_at timestamptz default now()
);

-- 3. Table des Pointages & Présences
create table if not exists public.rh_pointages (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  salarie_id uuid not null references public.rh_salaries(id) on delete cascade,
  date_pointage date not null,
  statut varchar(30) not null default 'present', -- present, retard, demi_journee, conge_paye, maladie, absence_justifiee, absence_injustifiee, conge_sans_solde, repos_hebdo
  retard_minutes int default 0,
  heures_normales numeric(4,2) default 8.0,
  heures_supp_jour numeric(4,2) default 0,
  heures_supp_nuit numeric(4,2) default 0,
  heures_dimanche_ferie numeric(4,2) default 0,
  motif_absence text,
  valide_par uuid references public.utilisateurs(id),
  created_at timestamptz default now(),
  unique(salarie_id, date_pointage)
);

-- 4. Table des Périodes de Paie
create table if not exists public.rh_periodes_paie (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  mois int not null check (mois between 1 and 12),
  annee int not null,
  statut varchar(20) default 'brouillon', -- brouillon, calcule, valide, cloture
  date_cloture timestamptz,
  total_brut numeric(14,2) default 0,
  total_net numeric(14,2) default 0,
  total_charges_patronales numeric(14,2) default 0,
  total_impots_vrs numeric(14,2) default 0,
  created_at timestamptz default now(),
  unique(hotel_id, annee, mois)
);

-- 5. Table des Bulletins de Paie
create table if not exists public.rh_bulletins_paie (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  periode_id uuid not null references public.rh_periodes_paie(id) on delete cascade,
  salarie_id uuid not null references public.rh_salaries(id) on delete cascade,
  matricule varchar(30) not null,
  nom_complet varchar(200) not null,
  poste varchar(100),
  statut_collab varchar(30),
  jours_travailles int default 26,
  heures_normales numeric(6,2) default 173.33,
  heures_supp numeric(6,2) default 0,
  salaire_base numeric(12,2) not null default 0,
  sursalaire numeric(12,2) default 0,
  primes numeric(12,2) default 0,
  indemnite_transport numeric(12,2) default 0,
  salaire_brut numeric(12,2) not null default 0,
  brut_imposable numeric(12,2) not null default 0,
  total_retenues_salariales numeric(12,2) not null default 0,
  net_a_payer numeric(12,2) not null default 0,
  total_charges_patronales numeric(12,2) not null default 0,
  cout_total_employeur numeric(12,2) not null default 0,
  statut_paiement varchar(20) default 'en_attente', -- en_attente, paye
  date_paiement timestamptz,
  mode_paiement varchar(30) default 'virement',
  created_at timestamptz default now(),
  unique(periode_id, salarie_id)
);

-- 6. Table des Lignes de Bulletin de Paie (Détail calculé)
create table if not exists public.rh_bulletins_lignes (
  id uuid primary key default gen_random_uuid(),
  bulletin_id uuid not null references public.rh_bulletins_paie(id) on delete cascade,
  type_ligne varchar(30) not null, -- gain, retenue_absence, retenue_salariale, charge_patronale
  libelle varchar(150) not null,
  base numeric(12,2) default 0,
  taux numeric(5,2),
  montant_salarial numeric(12,2) default 0,
  montant_patronal numeric(12,2) default 0,
  ordre int default 1
);

-- Index pour requêtes performantes
create index if not exists idx_rh_salaries_hotel on public.rh_salaries(hotel_id, statut);
create index if not exists idx_rh_contrats_salarie on public.rh_contrats(hotel_id, salarie_id);
create index if not exists idx_rh_pointages_date on public.rh_pointages(hotel_id, date_pointage);
create index if not exists idx_rh_bulletins_periode on public.rh_bulletins_paie(hotel_id, periode_id);

-- RLS & Sécurité
alter table public.rh_salaries enable row level security;
alter table public.rh_contrats enable row level security;
alter table public.rh_pointages enable row level security;
alter table public.rh_periodes_paie enable row level security;
alter table public.rh_bulletins_paie enable row level security;
alter table public.rh_bulletins_lignes enable row level security;

create policy "rh_salaries_hotel_tenant" on public.rh_salaries
  for all using (hotel_id = auth.uid() or exists (select 1 from public.utilisateurs u where u.id = auth.uid() and u.hotel_id = rh_salaries.hotel_id));

create policy "rh_contrats_hotel_tenant" on public.rh_contrats
  for all using (hotel_id = auth.uid() or exists (select 1 from public.utilisateurs u where u.id = auth.uid() and u.hotel_id = rh_contrats.hotel_id));

create policy "rh_pointages_hotel_tenant" on public.rh_pointages
  for all using (hotel_id = auth.uid() or exists (select 1 from public.utilisateurs u where u.id = auth.uid() and u.hotel_id = rh_pointages.hotel_id));

create policy "rh_periodes_hotel_tenant" on public.rh_periodes_paie
  for all using (hotel_id = auth.uid() or exists (select 1 from public.utilisateurs u where u.id = auth.uid() and u.hotel_id = rh_periodes_paie.hotel_id));

create policy "rh_bulletins_hotel_tenant" on public.rh_bulletins_paie
  for all using (hotel_id = auth.uid() or exists (select 1 from public.utilisateurs u where u.id = auth.uid() and u.hotel_id = rh_bulletins_paie.hotel_id));

create policy "rh_lignes_hotel_tenant" on public.rh_bulletins_lignes
  for all using (exists (select 1 from public.rh_bulletins_paie b where b.id = rh_bulletins_lignes.bulletin_id));
