"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const handleLogout = async () => {
    setLoading(true);

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
      aria-label="Logout"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} className="ml-0.5" />
      )}
    </button>
  );
}
