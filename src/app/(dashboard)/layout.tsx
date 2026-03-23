import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-foreground">
      <Sidebar />
      {/* pt-14 offsets the fixed mobile topbar; lg:pt-0 removes it on desktop */}
      <main className="flex-1 shrink min-w-0 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
