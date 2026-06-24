import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center font-sans text-slate-800">
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen relative flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
