"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col items-center justify-center p-5 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 relative w-16 h-16 drop-shadow-sm">
            <Image
              src="/icons/icon-192x192.png"
              alt="Logo Catatan Keuangan"
              fill
              className="object-contain rounded-2xl"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Silakan masuk ke Cashflow App
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-800 font-medium"
              placeholder="Alamat Email"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-800 font-medium"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-slate-800 text-white font-semibold py-3.5 rounded-2xl hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              "Masuk ke Aplikasi"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
