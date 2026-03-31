import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isLoginPage = false; // layout wraps all admin pages including login

  if (!user) {
    return <>{children}</>;
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/admin/login");
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
        <span className="text-2xl">🐶</span>
        <div>
          <p className="font-heading text-sm font-bold">놓다 관리자</p>
          <p className="text-xs text-muted-foreground">익선동</p>
        </div>
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
    <a
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span>{icon}</span>
      {label}
    </a>
  );
}
