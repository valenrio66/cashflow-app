"use client";

import { fetcher } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

type Transaction = {
  id: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  transaction_date: string;
  source_wallet_name: string | null;
  destination_wallet_name: string | null;
};

export default function HistoryPage() {
  const {
    data: transactions,
    error,
    isLoading,
  } = useSWR<Transaction[]>("/api/transactions", fetcher);

  const [activeFilter, setActiveFilter] = useState("Semua");

  const groupedTransactions = useMemo(() => {
    if (!transactions) return [];

    const filtered = transactions.filter((tx) => {
      if (activeFilter === "Semua") return true;
      if (activeFilter === "Pemasukan") return tx.type === "INCOME";
      if (activeFilter === "Pengeluaran") return tx.type === "EXPENSE";
      if (activeFilter === "Transfer") return tx.type === "TRANSFER";
      return true;
    });

    const groups: Record<string, Transaction[]> = {};

    filtered.forEach((tx) => {
      const dateObj = new Date(tx.transaction_date);

      const dateStr = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label = dateStr;
      if (dateObj.toDateString() === today.toDateString()) {
        label = `Hari ini, ${dateStr}`;
      } else if (dateObj.toDateString() === yesterday.toDateString()) {
        label = `Kemarin, ${dateStr}`;
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(tx);
    });

    return Object.keys(groups).map((date) => ({
      date,
      transactions: groups[date],
    }));
  }, [transactions, activeFilter]);

  const getWalletText = (tx: Transaction) => {
    if (tx.type === "INCOME")
      return tx.destination_wallet_name || "Tidak diketahui";
    if (tx.type === "EXPENSE")
      return tx.source_wallet_name || "Tidak diketahui";
    if (tx.type === "TRANSFER")
      return `${tx.source_wallet_name} → ${tx.destination_wallet_name}`;
    return "-";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Sticky */}
      <div className="sticky top-0 bg-slate-50/80 backdrop-blur-xl z-10 px-5 pt-7 pb-4 border-b border-slate-200/60">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Riwayat
          </h1>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Filter Pills Dinamis */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {["Semua", "Pemasukan", "Pengeluaran", "Transfer"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Area Konten Utama */}
      <div className="px-5 py-4 flex flex-col gap-6 pb-24">
        {/* State: Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-sm font-medium">Memuat riwayat...</span>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium text-center border border-rose-100">
            Gagal memuat riwayat transaksi.
          </div>
        )}

        {/* State: Kosong */}
        {!isLoading && !error && groupedTransactions.length === 0 && (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-2">
            <RefreshCw size={40} className="text-slate-200 mb-2" />
            <p className="text-sm font-medium">Belum ada transaksi</p>
          </div>
        )}

        {/* State: Success / Data Tersedia */}
        {groupedTransactions.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {group.date}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {group.transactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const isExpense = tx.type === "EXPENSE";

                return (
                  <div
                    key={tx.id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm shadow-slate-100/50 transition-transform active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600"
                            : isExpense
                              ? "bg-rose-50 text-rose-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft size={18} />
                        ) : isExpense ? (
                          <ArrowUpRight size={18} />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-800 block line-clamp-1">
                          {tx.description}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {getWalletText(tx)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-semibold text-sm ${
                          isIncome
                            ? "text-emerald-600"
                            : isExpense
                              ? "text-slate-800"
                              : "text-blue-600"
                        }`}
                      >
                        {isIncome ? "+" : isExpense ? "-" : ""}{" "}
                        {formatRupiah(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
