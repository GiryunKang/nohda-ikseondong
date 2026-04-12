-- =============================================================================
-- RLS Policies for nohda-ikseondong
-- Created: 2026-04-12
-- =============================================================================
-- Admin check helper: a user is an admin if they have a row in admin_profiles.
-- All admin checks use: exists (select 1 from public.admin_profiles where id = auth.uid())
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. articles
-- ---------------------------------------------------------------------------
alter table public.articles enable row level security;

-- Public: anyone (anon + authenticated) can read published articles
create policy "articles_select_published"
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

-- Admin: full CRUD on all articles
create policy "articles_admin_select"
  on public.articles
  for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "articles_admin_insert"
  on public.articles
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "articles_admin_update"
  on public.articles
  for update
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "articles_admin_delete"
  on public.articles
  for delete
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 2. places
-- ---------------------------------------------------------------------------
alter table public.places enable row level security;

-- Public: anyone can read places
create policy "places_select_public"
  on public.places
  for select
  to anon, authenticated
  using (true);

-- Admin / cron: full CRUD
create policy "articles_admin_select"
  on public.places
  for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "places_admin_insert"
  on public.places
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "places_admin_update"
  on public.places
  for update
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "places_admin_delete"
  on public.places
  for delete
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. admin_profiles
-- ---------------------------------------------------------------------------
alter table public.admin_profiles enable row level security;

-- Authenticated users can read only their own profile row
create policy "admin_profiles_select_own"
  on public.admin_profiles
  for select
  to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. sns_posts
-- ---------------------------------------------------------------------------
alter table public.sns_posts enable row level security;

-- Admin only: full CRUD
create policy "sns_posts_admin_select"
  on public.sns_posts
  for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "sns_posts_admin_insert"
  on public.sns_posts
  for insert
  to authenticated
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "sns_posts_admin_update"
  on public.sns_posts
  for update
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "sns_posts_admin_delete"
  on public.sns_posts
  for delete
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));
