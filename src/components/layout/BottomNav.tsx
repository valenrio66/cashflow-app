"use client";

import { Home, ScrollText, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Riwayat", icon: ScrollText, href: "/history" },
    { label: "Dompet", icon: Wallet, href: "/wallets" },
    { label: "Setelan", icon: Settings, href: "/settings" },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-between items-center px-6 py-3 rounded-t-2xl shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive
                ? "text-indigo-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
