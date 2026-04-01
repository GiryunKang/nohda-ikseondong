import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { LogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile: { name: string; role: string } | null = null;
  let isAuthenticated = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      isAuthenticated = true;

      const { data, error } = await supabase
        .from("admin_profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Admin profile query error:", error.message);
      }

      profile = data;
    }
  } catch (error) {
    console.error("Admin layout error:", error);
  }

  // Not authenticated or no profile → render children only (login page)
  if (!isAuthenticated || !profile) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar name={profile.name} role={profile.role} />
      <main className="flex-1 overflow-auto bg-background p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}

function AdminSidebar({ name, role }: { name: string; role: string }) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🐶</span>
          <div>
            <p className="font-heading text-sm font-bold">놓다 관리자</p>
            <p className="text-xs text-muted-foreground">익선동</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <SidebarLink href="/admin" label="대시보드" icon="📊" />
        <SidebarLink href="/admin/articles" label="콘텐츠 관리" icon="📝" />
        <SidebarLink href="/admin/places" label="장소 관리" icon="📍" />
        <SidebarLink href="/admin/ai-writer" label="AI 글쓰기" icon="✨" />
        <SidebarLink href="/admin/sns" label="SNS 발행" icon="📱" />
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">
          {role === "super_admin" ? "슈퍼 관리자" : "관리자"}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            ← 사이트
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
