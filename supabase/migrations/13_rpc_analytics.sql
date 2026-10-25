-- 13_rpc_analytics.sql
-- Fonctions PostgreSQL pour le calcul immédiat des KPIs hôteliers de référence

create or replace function public.rpc_kpi_journalier(
  p_hotel_id uuid,
  p_date date default current_date
) returns table (
  total_chambres bigint,
  chambres_occupees bigint,
  taux_occupation numeric,
  ca_hebergement numeric,
  adr numeric,
  revpar numeric,
  ca_global_jour numeric
) language plpgsql security definer as $$
declare
  v_total_chambres bigint;
  v_occupees bigint;
  v_ca_hebergement numeric;
  v_ca_global numeric;
  v_to numeric;
  v_adr numeric;
  v_revpar numeric;
begin
  -- 1. Nombre total de chambres actives
  select count(*) into v_total_chambres
  from public.chambres
  where hotel_id = p_hotel_id and actif = true and statut_menage != 'maintenance';

  if v_total_chambres = 0 then
    v_total_chambres := 1;
  end if;

  -- 2. Nombre de chambres occupées à la date
  select count(*) into v_occupees
  from public.reservations
  where hotel_id = p_hotel_id
    and statut in ('confirmee', 'check_in')
    and date_arrivee <= p_date
    and date_depart > p_date;

  -- 3. Chiffre d'affaires hébergement du jour
  select coalesce(sum(tarif_nuit_convenu), 0) into v_ca_hebergement
  from public.reservations
  where hotel_id = p_hotel_id
    and statut in ('confirmee', 'check_in')
    and date_arrivee <= p_date
    and date_depart > p_date;

  -- 4. Chiffre d'affaires global encaissé le jour
  select coalesce(sum(montant), 0) into v_ca_global
  from public.reglements
  where hotel_id = p_hotel_id
    and date_reglement::date = p_date;

  -- 5. Calculs des Ratios Hôteliers
  v_to := round((v_occupees::numeric / v_total_chambres::numeric) * 100, 1);

  if v_occupees > 0 then
    v_adr := round(v_ca_hebergement / v_occupees, 0);
  else
    v_adr := 0;
  end if;

  v_revpar := round((v_ca_hebergement / v_total_chambres), 0);

  return query select
    v_total_chambres,
    v_occupees,
    v_to,
    v_ca_hebergement,
    v_adr,
    v_revpar,
    v_ca_global;
end;
$$;
