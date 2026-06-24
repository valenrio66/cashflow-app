import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh bg-slate-50 flex justify-center font-sans text-slate-800 overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-xl h-full relative flex flex-col">
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
