'use client';

import { Button } from '@/components/ui/Button';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { PageTransition } from '@/components/motion/PageTransition';
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Terminal, Wifi, ShieldCheck, X, Lock, Cpu, Eye, Key } from 'lucide-react';
import { Magnetic } from '@/components/motion/Magnetic';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt3D } from '@/components/motion/Tilt3D';
import { MetisLogo } from '@/components/brand/MetisLogo';
import { LiquidAurora } from '@/components/motion/LiquidAurora';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

function BackgroundLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--outline-variant)" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}

// ─── Shared Modal Shell ────────────────────────────────────────────────────────
function ModalShell({
  open,
  onClose,
  icon,
  title,
  chip,
  chipColor,
  children,
}: {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  chip: string;
  chipColor: 'live' | 'verified';
  children: React.ReactNode;
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(7,8,12,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 9000,
            }}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(620px, 92vw)',
              maxHeight: '82vh',
              overflowY: 'auto',
              background: 'var(--surface-container-low, #0E0F16)',
              border: '1px solid rgba(123,110,246,0.25)',
              borderRadius: '16px',
              padding: '28px',
              zIndex: 9001,
              boxShadow:
                '0 24px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(123,110,246,0.08)',
              color: 'var(--on-surface, #E8EAF2)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(123,110,246,0.12)',
                  border: '1px solid rgba(123,110,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  color: 'var(--on-surface, #E8EAF2)',
                  flex: 1,
                }}
              >
                {title}
              </span>
              {/* Live/Verified chip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontWeight: 500,
                  background:
                    chipColor === 'live'
                      ? 'rgba(76,201,240,0.08)'
                      : 'rgba(74,222,128,0.08)',
                  border:
                    chipColor === 'live'
                      ? '1px solid rgba(76,201,240,0.2)'
                      : '1px solid rgba(74,222,128,0.2)',
                  color: chipColor === 'live' ? '#4CC9F0' : '#4ADE80',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: chipColor === 'live' ? '#4CC9F0' : '#4ADE80',
                    display: 'inline-block',
                    animation: chipColor === 'live' ? 'pulse 1.5s infinite' : undefined,
                  }}
                />
                {chip}
              </div>
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--on-surface-variant, #A2A5B5)',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                  marginLeft: 4,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--on-surface, #E8EAF2)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--on-surface-variant, #A2A5B5)')}
              >
                <X size={18} />
              </button>
            </div>
            {/* Divider */}
            <div
              style={{
                height: 1,
                background: 'rgba(70,72,80,0.25)',
                marginBottom: 20,
              }}
            />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── System Logs Modal ─────────────────────────────────────────────────────────
const LOG_ENTRIES = [
  { time: '[14:32:01 UTC]', action: 'SESSION_INIT', icon: '✓', desc: 'Ephemeral keys generated', success: true },
  { time: '[14:32:01 UTC]', action: 'TEE_HANDSHAKE', icon: '✓', desc: 'NODE_07 verified', success: true },
  { time: '[14:32:02 UTC]', action: 'WALLET_CONNECT', icon: '✓', desc: 'Public key registered', success: true },
  { time: '[14:32:02 UTC]', action: 'PAYLOAD_ENCRYPT', icon: '✓', desc: 'X25519-ChaCha20 active', success: true },
  { time: '[14:32:04 UTC]', action: 'INFERENCE_REQUEST', icon: '→', desc: 'Routing to decentralized node', success: false },
  { time: '[14:32:06 UTC]', action: 'INFERENCE_COMPLETE', icon: '✓', desc: 'Response decrypted locally', success: true },
  { time: '[14:32:06 UTC]', action: 'MEMORY_WIPE', icon: '✓', desc: 'Node session cleared', success: true },
  { time: '[14:32:07 UTC]', action: 'AUDIT_LOG_APPEND', icon: '✓', desc: 'Zero-log proof recorded', success: true },
];

function SystemLogsContent({ open }: { open: boolean }) {
  const [displayed, setDisplayed] = useState<typeof LOG_ENTRIES>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setDisplayed([]);
      return;
    }
    let idx = 0;
    const iv = setInterval(() => {
      if (idx >= LOG_ENTRIES.length) {
        clearInterval(iv);
        return;
      }
      const entryToAdd = LOG_ENTRIES[idx];
      setDisplayed((prev) => [...prev, entryToAdd]);
      idx++;
    }, 180);
    return () => clearInterval(iv);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayed]);

  return (
    <div
      ref={scrollRef}
      style={{
        maxHeight: 400,
        overflowY: 'auto',
        background: 'var(--surface-container, #141520)',
        borderRadius: 8,
        padding: 16,
        fontFamily: 'var(--font-geist-mono, monospace)',
        fontSize: 12,
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--accent-primary, #7B6EF6) var(--surface-container-high, #1C1E2E)',
      }}
    >
      {displayed.map((entry, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 8,
            lineHeight: '1.6',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)', flexShrink: 0 }}>
            {entry.time}
          </span>
          <span
            style={{
              color: '#4CC9F0',
              fontWeight: 500,
              minWidth: '22ch',
              flexShrink: 0,
            }}
          >
            {entry.action}
          </span>
          <span>
            <span
              style={{
                color: entry.icon === '✓' ? '#4ADE80' : 'var(--accent-primary, #7B6EF6)',
                marginRight: 6,
              }}
            >
              {entry.icon}
            </span>
            <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>
              {entry.desc}
            </span>
          </span>
        </div>
      ))}
      {displayed.length < LOG_ENTRIES.length && (
        <div style={{ color: 'var(--accent-primary, #7B6EF6)', opacity: 0.5 }}>
          ▌
        </div>
      )}
    </div>
  );
}

// ─── Network Status Modal ──────────────────────────────────────────────────────
function NetworkStatusContent() {
  const cardStyle: React.CSSProperties = {
    background: 'var(--surface-container, #141520)',
    border: '1px solid rgba(70,72,80,0.25)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  };
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 10,
    letterSpacing: '0.12em',
    color: 'var(--on-surface-variant, #A2A5B5)',
    textTransform: 'uppercase' as const,
  };
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
    fontSize: 12,
    fontFamily: 'DM Sans, sans-serif',
  };
  const valStyle: React.CSSProperties = {
    fontFamily: 'var(--font-geist-mono, monospace)',
    color: 'var(--on-surface, #E8EAF2)',
    fontSize: 12,
  };

  const chip = (color: 'green' | 'violet' | 'amber', text: string) => {
    const map = {
      green: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', color: '#4ADE80' },
      violet: { bg: 'rgba(123,110,246,0.12)', border: 'rgba(123,110,246,0.25)', color: '#7B6EF6' },
      amber: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', color: '#FBB724' },
    };
    const c = map[color];
    return (
      <span
        style={{
          fontFamily: 'var(--font-geist-mono, monospace)',
          fontSize: 9,
          letterSpacing: '0.12em',
          padding: '3px 8px',
          borderRadius: 999,
          background: c.bg,
          border: `1px solid ${c.border}`,
          color: c.color,
          textTransform: 'uppercase' as const,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div>
      {/* Card 1: TEE Node */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <span style={labelStyle}>TEE NODE</span>
          {chip('green', 'CONNECTED')}
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Active Node</span>
          <span style={valStyle}>NODE_07 · EU-WEST</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Latency</span>
          <span style={{ ...valStyle, color: '#4CC9F0' }}>84ms</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Uptime</span>
          <span style={valStyle}>99.97%</span>
        </div>
        <div style={{ ...rowStyle, marginBottom: 0 }}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Protocol</span>
          <span style={valStyle}>TEE-SGX v2.1</span>
        </div>
      </div>

      {/* Card 2: Encryption Channel */}
      <div style={cardStyle}>
        <div style={headerStyle}>
          <span style={labelStyle}>ENCRYPTION CHANNEL</span>
          {chip('violet', 'ACTIVE')}
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Algorithm</span>
          <span style={valStyle}>X25519-ChaCha20-Poly1305</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Session Key</span>
          <span style={valStyle}>EPHEMERAL · Rotates on disconnect</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Payload Size</span>
          <span style={valStyle}>2.4 KB avg</span>
        </div>
        <div style={{ ...rowStyle, marginBottom: 0 }}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Zero-log</span>
          <span style={{ ...valStyle, color: '#4ADE80' }}>ENFORCED</span>
        </div>
      </div>

      {/* Card 3: Solana RPC */}
      <div style={{ ...cardStyle, marginBottom: 0 }}>
        <div style={headerStyle}>
          <span style={labelStyle}>SOLANA RPC</span>
          {chip('amber', 'DEVNET')}
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Endpoint</span>
          <span style={valStyle}>api.devnet.solana.com</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Block Height</span>
          <span style={valStyle}>287,441,892</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>TPS</span>
          <span style={valStyle}>2,847</span>
        </div>
        <div style={{ ...rowStyle, marginBottom: 0 }}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Status</span>
          <span style={{ ...valStyle, color: '#4ADE80' }}>Operational</span>
        </div>
      </div>
    </div>
  );
}

// ─── Security Modal ────────────────────────────────────────────────────────────
function SecurityContent() {
  const score = 98;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const checks = [
    {
      Icon: ShieldCheck,
      iconColor: '#4ADE80',
      iconBg: 'rgba(74,222,128,0.12)',
      label: 'Local Encryption',
      sub: 'Data encrypted before any network call',
      badge: 'ACTIVE',
      badgeColor: 'green' as const,
    },
    {
      Icon: Lock,
      iconColor: '#4ADE80',
      iconBg: 'rgba(74,222,128,0.12)',
      label: 'Zero Server Storage',
      sub: 'No prompts or responses stored server-side',
      badge: 'VERIFIED',
      badgeColor: 'green' as const,
    },
    {
      Icon: Cpu,
      iconColor: '#4CC9F0',
      iconBg: 'rgba(76,201,240,0.12)',
      label: 'TEE Inference',
      sub: 'Trusted Execution Environment confirmed',
      badge: 'VERIFIED',
      badgeColor: 'blue' as const,
    },
    {
      Icon: Eye,
      iconColor: '#4ADE80',
      iconBg: 'rgba(74,222,128,0.12)',
      label: 'Zero-Log Policy',
      sub: 'Inference nodes wipe memory after each session',
      badge: 'ENFORCED',
      badgeColor: 'green' as const,
    },
    {
      Icon: Key,
      iconColor: '#4CC9F0',
      iconBg: 'rgba(76,201,240,0.12)',
      label: 'Ephemeral Keys',
      sub: 'Session keys never persist beyond current session',
      badge: 'ACTIVE',
      badgeColor: 'blue' as const,
    },
  ];

  const badgeStyle = (color: 'green' | 'blue'): React.CSSProperties => ({
    fontFamily: 'var(--font-geist-mono, monospace)',
    fontSize: 9,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '3px 10px',
    borderRadius: 999,
    background:
      color === 'green'
        ? 'rgba(74,222,128,0.1)'
        : 'rgba(76,201,240,0.1)',
    border:
      color === 'green'
        ? '1px solid rgba(74,222,128,0.25)'
        : '1px solid rgba(76,201,240,0.25)',
    color: color === 'green' ? '#4ADE80' : '#4CC9F0',
    flexShrink: 0,
  });

  return (
    <div>
      {/* Score hero */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#4CC9F0" />
              </linearGradient>
            </defs>
            <circle
              cx={40}
              cy={40}
              r={radius}
              fill="none"
              stroke="rgba(70,72,80,0.3)"
              strokeWidth={6}
            />
            <motion.circle
              cx={40}
              cy={40}
              r={radius}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--on-surface, #E8EAF2)',
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 7,
                letterSpacing: '0.15em',
                color: '#4ADE80',
                textTransform: 'uppercase' as const,
                marginTop: 2,
              }}
            >
              SECURE
            </span>
          </div>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: 11,
            color: 'var(--on-surface-variant, #A2A5B5)',
            marginTop: 8,
          }}
        >
          Last audited: just now
        </div>
      </div>

      {/* Security checks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {checks.map(({ Icon, iconColor, iconBg, label, sub, badge, badgeColor }, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: 'var(--surface-container, #141520)',
              border: '1px solid rgba(70,72,80,0.2)',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: iconBg,
                border: `1px solid ${iconColor}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={14} color={iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  color: 'var(--on-surface, #E8EAF2)',
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 11,
                  color: 'var(--on-surface-variant, #A2A5B5)',
                }}
              >
                {sub}
              </div>
            </div>
            <span style={badgeStyle(badgeColor)}>{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { connected, connect } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<'logs' | 'network' | 'security' | null>(null);

  useEffect(() => {
    if (connected) {
      router.push('/dashboard/intelligence');
    }
  }, [connected, router]);

  const handleConnect = async () => {
    setVisible(true);
  };

  return (
    <PageTransition>
      <main className="min-h-screen relative flex flex-col bg-transparent selection:bg-[#F72585]/30">
        <LiquidAurora />
        
        {/* Content wrapper to appear above aurora */}
        <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navigation / Header */}
        <header className="fixed top-0 w-full flex items-center justify-between px-8 py-6 z-50 bg-background/5 backdrop-blur-sm">
          <Magnetic strength={0.4}>
            <Link href="/" className="hover:scale-105 transition-transform cursor-none">
              <MetisLogo size="sm" />
            </Link>
          </Magnetic>
          <div className="hidden md:flex gap-6 font-geist text-xs tracking-widest text-on-surface-variant uppercase items-center">
            <button
              onClick={() => setActiveModal('logs')}
              className="hover:text-accent-primary transition-colors cursor-pointer bg-transparent border-none font-geist text-xs tracking-widest text-on-surface-variant uppercase"
            >
              System Logs
            </button>
            <button
              onClick={() => setActiveModal('network')}
              className="hover:text-accent-secondary transition-colors cursor-pointer bg-transparent border-none font-geist text-xs tracking-widest text-on-surface-variant uppercase"
            >
              Network Status
            </button>
            <button
              onClick={() => setActiveModal('security')}
              className="hover:text-accent-tertiary transition-colors cursor-pointer bg-transparent border-none font-geist text-xs tracking-widest text-on-surface-variant uppercase"
            >
              Security
            </button>
            <ConnectWalletButton />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 w-full min-h-screen pt-32 pb-20 px-6 mx-auto text-center flex flex-col items-center justify-center text-pretty">
          <div className="flex flex-col items-center mb-10">
            <MetisLogo size="lg" animated showTagline />
            <div className="inline-flex items-center gap-2 px-3 py-1 mt-6 rounded-full border border-accent-tertiary/20 bg-accent-tertiary/5 font-geist text-[10px] tracking-widest text-accent-tertiary uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-tertiary animate-pulse" />
              Enclave Network Genesis • V1.0.4
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="font-serif italic text-6xl md:text-9xl leading-tight tracking-tight text-on-surface mb-8 select-none pointer-events-none drop-shadow-2xl"
          >
            Submerged<br />
            Intelligence.
          </motion.h1>

          <div className="max-w-2xl mx-auto mb-12 text-on-surface-variant font-mono text-sm leading-relaxed border-l-2 border-accent-tertiary/50 pl-6 text-left">
            <TypewriterText
              text="METIS encrypts your portfolio locally before any AI ever sees it. Zero-log inference. Your holdings, your alpha — permanently yours. Centralized vector databases store your net worth in plaintext. LLM providers sell sentiment data derived from your private holdings. MEV bots frontrun transactions."
              speed={20}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <Magnetic strength={0.2}>
              <ConnectWalletButton />
            </Magnetic>
            <Link href="/manifesto" className="text-on-surface-variant font-geist text-xs uppercase tracking-[0.2em] border-b border-outline-variant/30 pb-1 cursor-pointer hover:border-accent-tertiary hover:text-on-surface transition-all">
              Read Manifesto
            </Link>
          </div>
        </section>

        {/* Features Matrix Section */}
        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-40">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Tilt3D>
              <div className="metis-card-glass p-10 h-full group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 bg-accent-primary/20 flex items-center justify-center mb-8 border border-accent-primary/30 group-hover:bg-accent-primary/40 transition-colors" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[#7B6EF6] font-mono-numbers">01</span>
                </div>
                <h3 className="text-2xl font-serif italic mb-4" style={{ transform: 'translateZ(20px)' }}>Edge Encryption</h3>
                <p className="text-sm text-on-surface-variant font-geist leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                  Data never leaves your browser in plaintext. Our local WASM runtime handles cryptographic sharding before the first packet is sent.
                </p>
              </div>
            </Tilt3D>

            <Tilt3D>
              <div className="metis-card-glass p-10 h-full group hover:-translate-y-2 transition-transform duration-500 delay-75">
                <div className="w-12 h-12 bg-accent-tertiary/20 flex items-center justify-center mb-8 border border-accent-tertiary/30 group-hover:bg-accent-tertiary/40 transition-colors" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[#F72585] font-mono-numbers">02</span>
                </div>
                <h3 className="text-2xl font-serif italic mb-4" style={{ transform: 'translateZ(20px)' }}>TEE Handshakes</h3>
                <p className="text-sm text-on-surface-variant font-geist leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                  Intelligence is served via nested Trusted Execution Environments. Even the node operator cannot inspect the compute memory.
                </p>
              </div>
            </Tilt3D>

            <Tilt3D>
              <div className="metis-card-glass p-10 h-full group hover:-translate-y-2 transition-transform duration-500 delay-150">
                <div className="w-12 h-12 bg-accent-secondary/20 flex items-center justify-center mb-8 border border-accent-secondary/30 group-hover:bg-accent-secondary/40 transition-colors" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[#4CC9F0] font-mono-numbers">03</span>
                </div>
                <h3 className="text-2xl font-serif italic mb-4" style={{ transform: 'translateZ(20px)' }}>Zero-Log Mandate</h3>
                <p className="text-sm text-on-surface-variant font-geist leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                  Stateless inference ensure no vectors are persisted. Once the session ends, the keys are burned and memory is wiped clean.
                </p>
              </div>
            </Tilt3D>
          </motion.div>
        </section>

        {/* Architecture Section */}
        <section className="relative z-10 w-full bg-accent-tertiary/5 py-40 border-y border-outline-variant/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-5xl mx-auto px-6 text-center"
          >
            <h2 className="text-4xl md:text-6xl font-serif italic mb-16 tracking-tight">System Topology.</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative">
              <Tilt3D>
                <div className="flex flex-col items-center group cursor-pointer" style={{ transform: 'translateZ(30px)' }}>
                  <div className="w-24 h-24 rounded-full border border-accent-primary flex items-center justify-center bg-background shadow-[0_0_30px_rgba(123,110,246,0.2)] group-hover:shadow-[0_0_50px_rgba(123,110,246,0.6)] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest uppercase">Local</span>
                  </div>
                  <span className="mt-6 text-[10px] font-geist uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-accent-primary transition-colors">Edge Sharding</span>
                </div>
              </Tilt3D>
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-accent-primary via-accent-tertiary to-accent-secondary opacity-50" />
              <Tilt3D>
                <div className="flex flex-col items-center group cursor-pointer" style={{ transform: 'translateZ(30px)' }}>
                  <div className="w-24 h-24 rounded-full border border-accent-tertiary flex items-center justify-center bg-background shadow-[0_0_30px_rgba(247,37,133,0.2)] animate-pulse group-hover:shadow-[0_0_50px_rgba(247,37,133,0.6)] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest uppercase">Compute</span>
                  </div>
                  <span className="mt-6 text-[10px] font-geist uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-accent-tertiary transition-colors">TEE Enclave</span>
                </div>
              </Tilt3D>
              <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-accent-secondary via-accent-tertiary to-accent-primary opacity-50" />
              <Tilt3D>
                <div className="flex flex-col items-center group cursor-pointer" style={{ transform: 'translateZ(30px)' }}>
                  <div className="w-24 h-24 rounded-full border border-accent-secondary flex items-center justify-center bg-background shadow-[0_0_30px_rgba(76,201,240,0.2)] group-hover:shadow-[0_0_50px_rgba(76,201,240,0.6)] group-hover:scale-110 transition-all duration-300">
                    <span className="text-[10px] font-mono tracking-widest uppercase">Alpha</span>
                  </div>
                  <span className="mt-6 text-[10px] font-geist uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-accent-secondary transition-colors">Safe Insights</span>
                </div>
              </Tilt3D>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 w-full py-24 px-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-12">
          <MetisLogo size="sm" />
          <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-[0.4em] text-center md:text-left">
            Submerged Privacy Protocol • Established 2024
          </div>
          <div className="flex gap-10 text-[10px] font-geist uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-accent-tertiary transition-colors">Hardware</a>
            <a href="#" className="hover:text-accent-tertiary transition-colors">Manifesto</a>
            <a href="#" className="hover:text-accent-tertiary transition-colors">Nodes</a>
          </div>
        </footer>
        </div>
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <ModalShell
        open={activeModal === 'logs'}
        onClose={() => setActiveModal(null)}
        icon={<Terminal size={16} color="#7B6EF6" />}
        title="System Logs"
        chip="LIVE"
        chipColor="live"
      >
        <SystemLogsContent open={activeModal === 'logs'} />
      </ModalShell>

      <ModalShell
        open={activeModal === 'network'}
        onClose={() => setActiveModal(null)}
        icon={<Wifi size={16} color="#7B6EF6" />}
        title="Network Status"
        chip="LIVE"
        chipColor="live"
      >
        <NetworkStatusContent />
      </ModalShell>

      <ModalShell
        open={activeModal === 'security'}
        onClose={() => setActiveModal(null)}
        icon={<ShieldCheck size={16} color="#7B6EF6" />}
        title="Security Audit"
        chip="VERIFIED"
        chipColor="verified"
      >
        <SecurityContent />
      </ModalShell>

    </PageTransition>
  );
}
