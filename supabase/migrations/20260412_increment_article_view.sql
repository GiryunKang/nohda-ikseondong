-- Atomic article view counter RPC
-- Fixes race condition where concurrent readers lost view counts
-- Replaces: select view_count → write +1 (read-modify-write)
-- With:     update articles set view_count = view_count + 1 (single atomic op)

create or replace function public.increment_article_view(article_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.articles
  set view_count = coalesce(view_count, 0) + 1
  where id = article_id
    and status = 'published';
$$;

-- Allow anonymous users to call this RPC (for public article views)
grant execute on function public.increment_article_view(uuid) to anon, authenticated;
