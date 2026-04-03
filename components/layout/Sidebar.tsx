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
import { useState, useRef } from 'react';

const navItems = [
  { icon: BarChart2, label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: BrainCircuit, label: 'Intelligence', href: '/dashboard/intelligence' },
  { icon: Wallet, label: 'Vault Control', href: '/dashboard/vault' },
  { icon: ShieldAlert, label: 'Tax Phantom', href: '/dashboard/tax' },
  { icon: LogOut, label: 'Exit Vector', href: '/dashboard/exit' },
];

function NavItem({ item, isActive }: { item: typeof navItems[0], isActive: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Link
      ref={ref}
      href={item.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-300 overflow-hidden",
        isActive 
          ? "bg-primary/10 text-accent-primary" 
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
      )}
    >
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 60px at ${mousePos.x}px ${mousePos.y}px, rgba(123, 110, 246, 0.2), transparent 100%)`
          }}
        />
      )}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-primary">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[2px] h-4 bg-white shadow-[0_0_10px_var(--accent-primary)] animate-pulse" />
        </div>
      )}
      <item.icon className="w-5 h-5 stroke-[1.5px] relative z-10" />
      <span className="font-dm text-sm font-medium relative z-10">{item.label}</span>
    </Link>
  );
}

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
          {navItems.map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              isActive={pathname.startsWith(item.href)} 
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-outline-variant/15 flex flex-col gap-4">
        {/* SECURE Badge */}
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/20 rounded-sm">
          <div className="relative flex items-center justify-center w-2 h-2">
            <div className="absolute w-full h-full bg-accent-secondary rounded-full animate-ping opacity-75"></div>
            <div className="relative w-1.5 h-1.5 bg-accent-secondary rounded-full"></div>
          </div>
          <span className="font-geist text-[10px] tracking-widest text-on-surface-variant uppercase font-medium">Secure Enclave</span>
        </div>

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
