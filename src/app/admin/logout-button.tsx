"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-1 block text-xs text-red-400 hover:text-red-500"
    >
      로그아웃
    </button>
  );
}
