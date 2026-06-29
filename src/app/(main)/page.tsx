"use client";

import BalanceCard from "@/components/shared/BalanceCard";
import LogoutButton from "@/components/shared/LogoutButton";
import NotificationBell from "@/components/shared/NotificationBell";
import RecentTransactions from "@/components/shared/RecentTransactions";

export default function HomePage() {
  return (
    <div className="px-5 pt-7 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 font-medium block">
            Halo, Selamat Datang
          </span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Catatan Keuangan
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <LogoutButton />
        </div>
      </div>

      <BalanceCard />

      <RecentTransactions />
    </div>
  );
}
