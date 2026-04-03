'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart2, 
  BrainCircuit, 
  Wallet, 
  ShieldAlert, 
  LogOut, 
  Settings 
} from 'lucide-react';
import { Magnetic } from '../motion/Magnetic';
import { MetisLogo } from '../brand/MetisLogo';

const navItems = [
  { icon: BarChart2, label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: BrainCircuit, label: 'Intelligence', href: '/dashboard/intelligence' },
  { icon: Wallet, label: 'Vault Control', href: '/dashboard/vault' },
  { icon: ShieldAlert, label: 'Tax Phantom', href: '/dashboard/tax' },
  { icon: LogOut, label: 'Exit Vector', href: '/dashboard/exit' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-outline-variant/15 bg-surface flex flex-col justify-between hidden md:flex shrink-0">
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant/15">
          <Magnetic strength={0.2}>
            <Link href="/" className="flex items-center group">
              <MetisLogo size="sm" />
            </Link>
          </Magnetic>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 text-accent-primary shadow-[inset_2px_0_0_var(--accent-primary)]" 
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <item.icon className="w-5 h-5 stroke-[1.5px]" />
                <span className="font-dm text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-outline-variant/15">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors",
            pathname.startsWith('/dashboard/settings')
              ? "bg-primary/10 text-accent-primary"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
        >
          <Settings className="w-5 h-5 stroke-[1.5px]" />
          <span className="font-dm text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
