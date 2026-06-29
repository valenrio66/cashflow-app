"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Transaction {
  id: string | number;
  amount: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  description: string;
  created_at: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  useEffect(() => {
    async function fetchLatestTransactions() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setNotifications(data);
      }
      setIsLoading(false);
    }

    fetchLatestTransactions();
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date) + " WIB"
    );
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 transition-colors relative"
      >
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Log Sistem</h3>
            {isLoading ? (
              <Loader2 size={14} className="animate-spin text-slate-400" />
            ) : (
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                {notifications.length} Sinkronisasi
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto scrollbar-hide">
            {notifications.length === 0 && !isLoading && (
              <p className="text-xs text-center text-slate-400 py-4">
                Belum ada transaksi dicatat.
              </p>
            )}

            {notifications.map((trx) => (
              <div
                key={trx.id}
                className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <CheckCircle2
                  className="text-emerald-500 shrink-0 mt-0.5"
                  size={16}
                />
                <div className="flex flex-col gap-0.5 w-full">
                  <p className="text-xs font-semibold text-slate-800">
                    Transaksi Berhasil
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed truncate">
                    {trx.description ||
                      (trx.type === "INCOME"
                        ? "Pemasukan"
                        : trx.type === "EXPENSE"
                          ? "Pengeluaran"
                          : "Transfer")}{" "}
                    senilai{" "}
                    <span className="font-semibold text-slate-700">
                      {formatRupiah(trx.amount)}
                    </span>{" "}
                    tersimpan
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block">
                    Disinkronkan pada {formatTime(trx.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
