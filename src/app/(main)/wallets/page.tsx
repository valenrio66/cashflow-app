"use client";

import { fetcher } from "@/lib/api";
import { useBalanceStore } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import { getWalletUI } from "@/lib/wallet-config";
import { Eye, EyeOff, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

type Wallet = {
  id: number;
  name: string;
  balance: number;
  type: string;
};

function WalletLogo({ logoUrl, name }: { logoUrl: string; name: string }) {
  const [isError, setIsError] = useState(!logoUrl);

  const getInitials = (str: string) => {
    const cleanWords = str.replace(/[^a-zA-Z0-9 ]/g, "").split(" ");
    if (cleanWords.length >= 2 && cleanWords[1][0]) {
      return (cleanWords[0][0] + cleanWords[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  if (isError) {
    return (
      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xs font-bold tracking-wider shadow-sm">
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="p-1.5 w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-full h-full object-contain rounded-sm"
        onError={() => setIsError(true)}
      />
    </div>
  );
}

export default function WalletsPage() {
  const {
    data: wallets,
    error,
    isLoading,
  } = useSWR<Wallet[]>("/api/wallets", fetcher);

  const { showBalance, toggleBalance } = useBalanceStore();

  return (
    <div className="px-5 pt-7 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Daftar Dompet
        </h1>

        {/* Kelompokkan Tombol Eye dan Tombol Tambah di kanan */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleBalance}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
          >
            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-700 transition-colors shadow-md shadow-slate-800/20">
            <Plus size={14} strokeWidth={3} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-sm font-medium">Memuat dompet...</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium text-center border border-rose-100">
          Gagal memuat data dompet.
        </div>
      )}

      {wallets && (
        <div className="grid grid-cols-1 gap-4 pb-24">
          {wallets.map((wallet) => {
            const { color, logoUrl } = getWalletUI(wallet.name);

            return (
              <div
                key={wallet.id}
                className={`relative overflow-hidden rounded-2xl p-5 bg-linear-to-br ${color} shadow-lg shadow-slate-300/50 text-white transition-transform active:scale-[0.98]`}
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  <div className="flex justify-between items-start">
                    <WalletLogo logoUrl={logoUrl} name={wallet.name} />

                    <span className="text-[10px] font-bold tracking-wider uppercase bg-black/20 px-2.5 py-1 rounded-md">
                      {wallet.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-white/90 mb-1">
                      {wallet.name}
                    </h3>
                    <p className="text-2xl font-bold tracking-tight">
                      {showBalance
                        ? formatRupiah(wallet.balance)
                        : "Rp ••••••••"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
