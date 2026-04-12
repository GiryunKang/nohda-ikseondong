# Supabase Migrations

## How to apply

These SQL files need to be run manually in Supabase Studio:

1. Go to https://supabase.com/dashboard/project/vnmuocjnfmnlmdqostrk
2. Navigate to **SQL Editor**
3. Run each migration file in order:

### Migrations

| File | Purpose | Required |
|------|---------|----------|
| `20260412_increment_article_view.sql` | Atomic view counter RPC (fixes race condition) | Yes |
| `20260412_rls_policies.sql` | Row Level Security policies (critical security) | Yes |

### Verification

After running the migrations, verify:

1. **RPC**: Call `select increment_article_view('any-article-uuid')` — should execute without error
2. **RLS**: Toggle RLS ON for articles, places, admin_profiles, sns_posts in the Table Editor
3. **Public read**: Visit the site and confirm articles load correctly
4. **Admin write**: Log in to admin panel and confirm CRUD operations work
