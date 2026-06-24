"use client";

import { fetcher } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

type Transaction = {
  id: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  source_wallet_name: string | null;
  destination_wallet_name: string | null;
};

export default function RecentTransactions() {
  const {
    data: transactions,
    error,
    isLoading,
  } = useSWR<Transaction[]>("/api/transactions?limit=5", fetcher);

  const getWalletText = (tx: Transaction) => {
    if (tx.type === "INCOME") return tx.destination_wallet_name || "-";
    if (tx.type === "EXPENSE") return tx.source_wallet_name || "-";
    return `${tx.source_wallet_name} → ${tx.destination_wallet_name}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-base">
          Transaksi Terbaru
        </h3>
        <Link
          href="/history"
          className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading && (
          <div className="py-8 flex justify-center text-slate-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-xs font-medium text-rose-500">
            Gagal memuat transaksi
          </div>
        )}

        {transactions && transactions.length === 0 && (
          <div className="text-center py-8 text-xs font-medium text-slate-400 bg-white rounded-2xl border border-slate-100">
            Belum ada transaksi
          </div>
        )}

        {transactions &&
          transactions.map((tx) => {
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
  );
}
