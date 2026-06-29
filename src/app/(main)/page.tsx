import BalanceCard from "@/components/shared/BalanceCard";
import LogoutButton from "@/components/shared/LogoutButton";
import RecentTransactions from "@/components/shared/RecentTransactions";
import { Bell } from "lucide-react";

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
        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        </button>

        <LogoutButton />
      </div>

      <BalanceCard />

      <RecentTransactions />
    </div>
  );
}
