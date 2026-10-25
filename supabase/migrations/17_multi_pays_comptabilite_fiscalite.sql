-- 17_multi_pays_comptabilite_fiscalite.sql
-- Extension multi-pays du module comptable et fiscal de D-HOTEL
-- Supporte :
--   - SYSCOHADA Révisé (Sénégal, Côte d'Ivoire, CEMAC, UEMOA)
--   - PCGM Mauritanie (Plan Comptable Général Mauritanien, CNSS, CNAM, ITS)
--   - PCGM Maroc (Plan Comptable Général Marocain, CNSS, AMO, IR salaires CGI 2026)
--   - IFRS / Anglo-Saxon (Nigéria CAMA/PITA, Gambie Companies Act/GRA, Ghana GRA/SSNIT)
--   - Paramétrage personnalisé hors Sénégal

-- 1. Table des modèles de plan comptable et paramètres par pays
create table if not exists public.rh_modeles_pays (
  code varchar(10) primary key, -- SN, MR, MA, NG, GM, GH, PERSO
  nom varchar(100) not null,
  devise varchar(10) not null, -- XOF, MRU, MAD, NGN, GMD, GHS, USD
  symbole_devise varchar(10) not null,
  referentiel_comptable varchar(30) not null, -- SYSCOHADA, PCGM_MAROC, PCGM_MAURITANIE, IFRS_ANGLO
  nom_plan_comptable varchar(150) not null,
  heures_normales_mois numeric(5,2) default 173.33,
  majoration_hs_jour numeric(5,2) default 25.0,
  majoration_hs_nuit numeric(5,2) default 50.0,
  majoration_hs_dimanche numeric(5,2) default 100.0,
  indemnite_transport_exoneree numeric(12,2) default 0,
  abattement_frais_pro_pct numeric(5,2) default 0,
  plafond_abattement_annuel numeric(12,2),
  type_deduction_famille varchar(30) default 'parts', -- parts, charge_fixe, cra_anglo, aucun
  montant_deduction_charge numeric(12,2) default 0,
  actif boolean default true,
  created_at timestamptz default now()
);

-- 2. Configuration comptable et fiscale propre à chaque hôtel
create table if not exists public.hotel_configuration_rh_fiscale (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  pays_code varchar(10) not null references public.rh_modeles_pays(code),
  referentiel_comptable varchar(30) not null,
  devise varchar(10) not null,
  compte_charges_salaires varchar(50) not null,
  compte_charges_sociales_patronales varchar(50) not null,
  compte_salaires_nets_dus varchar(50) not null,
  compte_organismes_sociaux varchar(50) not null,
  compte_etat_impots varchar(50) not null,
  config_json jsonb default '{}'::jsonb,
  updated_at timestamptz default now(),
  unique(hotel_id)
);

-- 3. Extension de la table des salariés pour rattachement pays et avantages
alter table public.rh_salaries
  add column if not exists pays_code varchar(10) default 'SN',
  add column if not exists avantages_en_nature numeric(12,2) default 0;

-- 4. Insertion des modèles officiels par pays
insert into public.rh_modeles_pays (code, nom, devise, symbole_devise, referentiel_comptable, nom_plan_comptable, heures_normales_mois, majoration_hs_jour, majoration_hs_nuit, majoration_hs_dimanche, indemnite_transport_exoneree, abattement_frais_pro_pct, plafond_abattement_annuel, type_deduction_famille, montant_deduction_charge)
values
  ('SN', 'Sénégal (OHADA / UEMOA)', 'XOF', 'FCFA', 'SYSCOHADA', 'SYSCOHADA Révisé', 173.33, 30.0, 50.0, 100.0, 26000, 30.0, 900000, 'parts', 0),
  ('MR', 'Mauritanie (PCGM / CGI Mauritanie)', 'MRU', 'MRU', 'PCGM_MAURITANIE', 'Plan Comptable Général Mauritanien (PCGM)', 173.33, 25.0, 50.0, 100.0, 1500, 0, null, 'aucun', 0),
  ('MA', 'Maroc (PCGM / CGI Maroc)', 'MAD', 'DH', 'PCGM_MAROC', 'Plan Comptable Général Marocain (PCGM)', 191.0, 25.0, 50.0, 100.0, 500, 35.0, 35000, 'charge_fixe', 600),
  ('NG', 'Nigéria (IFRS / CAMA / PITA 2025)', 'NGN', '₦', 'IFRS_ANGLO', 'Nigerian Standard Chart of Accounts (IFRS)', 173.33, 25.0, 50.0, 100.0, 20000, 20.0, null, 'cra_anglo', 0),
  ('GM', 'Gambie (GRA / SSHFC)', 'GMD', 'D', 'IFRS_ANGLO', 'Gambia Standard Chart of Accounts (Companies Act)', 173.33, 25.0, 50.0, 100.0, 1000, 0, null, 'aucun', 0),
  ('GH', 'Ghana (GRA / SSNIT / IFRS)', 'GHS', 'GH₵', 'IFRS_ANGLO', 'Ghana Standard Chart of Accounts (IFRS)', 173.33, 25.0, 50.0, 100.0, 200, 0, null, 'aucun', 0),
  ('PERSO', 'Paramétrage Sur-Mesure / Hors Sénégal', 'USD', '$', 'IFRS_ANGLO', 'Plan Comptable Hôtelier Personnalisé', 173.33, 25.0, 50.0, 100.0, 0, 10.0, 5000, 'charge_fixe', 300)
on conflict (code) do update set
  nom = excluded.nom,
  devise = excluded.devise,
  symbole_devise = excluded.symbole_devise,
  referentiel_comptable = excluded.referentiel_comptable,
  nom_plan_comptable = excluded.nom_plan_comptable;

-- 5. RLS
alter table public.rh_modeles_pays enable row level security;
alter table public.hotel_configuration_rh_fiscale enable row level security;

create policy "rh_modeles_pays_read_all" on public.rh_modeles_pays for select to authenticated using (true);
create policy "hotel_config_rh_tenant" on public.hotel_configuration_rh_fiscale
  for all using (hotel_id = auth.uid() or exists (select 1 from public.utilisateurs u where u.id = auth.uid() and u.hotel_id = hotel_configuration_rh_fiscale.hotel_id));
