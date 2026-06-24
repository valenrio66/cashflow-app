"use client";

import { fetcher } from "@/lib/api";
import { useBalanceStore } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import useSWR from "swr";

type SummaryData = {
  totalBalance: number;
  income: number;
  expense: number;
};

export default function BalanceCard() {
  const {
    data: summary,
    error,
    isLoading,
  } = useSWR<SummaryData>("/api/summary", fetcher);

  const { showBalance, toggleBalance } = useBalanceStore();

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-6 h-45 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-2" size={24} />
        <span className="text-sm font-medium">Menghitung saldo...</span>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 h-45 flex items-center justify-center text-rose-500 text-sm font-medium">
        Gagal memuat saldo.
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-lg shadow-slate-900/10 relative overflow-hidden transition-transform active:scale-[0.98]">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-center mb-2 relative z-10">
        <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
          Total Saldo
        </span>
        <button
          onClick={toggleBalance} // <-- Gunakan fungsi dari global store
          className="text-slate-400 hover:text-white transition-colors"
        >
          {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <h2 className="text-3xl font-semibold tracking-tight mb-6 relative z-10">
        {showBalance ? formatRupiah(summary.totalBalance) : "Rp ••••••••"}
      </h2>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft size={16} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Pemasukan
            </span>
            <span className="text-sm font-semibold text-emerald-400">
              {showBalance ? formatRupiah(summary.income) : "••••••"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400">
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Pengeluaran
            </span>
            <span className="text-sm font-semibold text-rose-400">
              {showBalance ? formatRupiah(summary.expense) : "••••••"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
