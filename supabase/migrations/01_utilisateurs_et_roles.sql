-- 01_utilisateurs_et_roles.sql
-- Gestion du personnel et des rôles hôteliers (Support Identifiant / Téléphone sans e-mail requis)

create table if not exists public.utilisateurs (
  id uuid primary key references auth.users(id) on delete cascade,
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  identifiant varchar(100) unique,
  telephone varchar(50),
  nom_complet varchar(255) not null,
  role varchar(50) not null, 
  -- directoire: 'directeur', 'adjoint'
  -- reception: 'chef_reception', 'receptionniste', 'veilleur_nuit'
  -- gouvernance: 'gouvernante_generale', 'femme_chambre', 'valet'
  -- f&b: 'maitre_hotel', 'serveur', 'barman', 'chef_cuisine', 'commis'
  -- evenements: 'responsable_mice'
  -- loisirs: 'guide', 'maitre_nageur'
  -- achats/stocks: 'econome'
  -- finance: 'comptable', 'tresorier'
  -- technique: 'technicien_maintenance'
  actif boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_utilisateurs_hotel on public.utilisateurs (hotel_id);
create index if not exists idx_utilisateurs_identifiant on public.utilisateurs (lower(identifiant));
create index if not exists idx_utilisateurs_telephone on public.utilisateurs (telephone);
