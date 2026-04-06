"use client";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out failed:", error);
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
