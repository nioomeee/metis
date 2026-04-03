import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBar } from '@/components/layout/StatusBar';
import { LiquidAurora } from '@/components/motion/LiquidAurora';
import { PageContextBar } from '@/components/layout/PageContextBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-accent-primary selection:text-white">
      <LiquidAurora />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar />
        <PageContextBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <StatusBar />
      </div>
    </div>
  );
}
