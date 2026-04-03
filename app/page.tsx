'use client';

import { Button } from '@/components/ui/Button';
import { TypewriterText } from '@/components/motion/TypewriterText';
import { PageTransition } from '@/components/motion/PageTransition';
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Terminal, Wifi, ShieldCheck, X, Lock, Cpu, Eye, Key } from 'lucide-react';
import { Magnetic } from '@/components/motion/Magnetic';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt3D } from '@/components/motion/Tilt3D';
import { MetisLogo } from '@/components/brand/MetisLogo';
import { AuroraBackground } from '@/components/effects/AuroraBackground';

// Background decoration
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

// ─── Modal Shell ────────────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as any },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 10,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as any },
  },
};

function ModalShell({
  open,
  onClose,
  icon,
  title,
  chipLabel,
  chipColor,
  children,
}: {
  open: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  chipLabel: string;
  chipColor: 'blue' | 'green';
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
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
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(620px, 90vw)',
              maxHeight: '80vh',
              overflowY: 'auto',
              background: 'var(--surface-container-low, #0E0F16)',
              border: '1px solid var(--surface-container-highest, #26283C)',
              borderRadius: '16px',
              padding: '28px',
              zIndex: 9001,
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(123,110,246,0.1)',
              color: 'var(--on-surface, #E8EAF2)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--accent-primary, #7B6EF6)', display: 'flex' }}>{icon}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '16px', color: 'var(--on-surface, #E8EAF2)' }}>
                  {title}
                </span>
                {/* Live/Verified chip */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: '3px 8px', borderRadius: '999px',
                  background: chipColor === 'green' ? 'rgba(74,222,128,0.1)' : 'rgba(76,201,240,0.1)',
                  border: chipColor === 'green' ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(76,201,240,0.25)',
                  color: chipColor === 'green' ? '#4ADE80' : 'var(--accent-secondary, #4CC9F0)',
                }}>
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: chipColor === 'green' ? '#4ADE80' : 'var(--accent-secondary, #4CC9F0)',
                    animation: chipLabel !== 'VERIFIED' ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }} />
                  {chipLabel}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                  color: 'var(--on-surface-variant, #A2A5B5)', display: 'flex', alignItems: 'center',
                  borderRadius: '6px', transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--on-surface, #E8EAF2)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--on-surface-variant, #A2A5B5)')}
              >
                <X size={20} />
              </button>
            </div>
            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--surface-container-highest, #26283C)', margin: '14px 0 20px' }} />

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── System Logs Modal ───────────────────────────────────────────────────────

const ALL_LOG_ENTRIES = [
  { ts: '[14:32:01 UTC]', action: 'SESSION_INIT        ', status: '✓', desc: 'Ephemeral keys generated', ok: true },
  { ts: '[14:32:01 UTC]', action: 'TEE_HANDSHAKE       ', status: '✓', desc: 'NODE_07 verified', ok: true },
  { ts: '[14:32:02 UTC]', action: 'WALLET_CONNECT      ', status: '✓', desc: 'Public key registered', ok: true },
  { ts: '[14:32:02 UTC]', action: 'PAYLOAD_ENCRYPT     ', status: '✓', desc: 'X25519-ChaCha20 active', ok: true },
  { ts: '[14:32:04 UTC]', action: 'INFERENCE_REQUEST   ', status: '→', desc: 'Routing to decentralized node', ok: null },
  { ts: '[14:32:06 UTC]', action: 'INFERENCE_COMPLETE  ', status: '✓', desc: 'Response decrypted locally', ok: true },
  { ts: '[14:32:06 UTC]', action: 'MEMORY_WIPE         ', status: '✓', desc: 'Node session cleared', ok: true },
  { ts: '[14:32:07 UTC]', action: 'AUDIT_LOG_APPEND    ', status: '✓', desc: 'Zero-log proof recorded', ok: true },
];

function SystemLogsContent({ isOpen }: { isOpen: boolean }) {
  const [displayedEntries, setDisplayedEntries] = useState<typeof ALL_LOG_ENTRIES>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedEntries([]);
      return;
    }
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < ALL_LOG_ENTRIES.length) {
        setDisplayedEntries(prev => [...prev, ALL_LOG_ENTRIES[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedEntries]);

  return (
    <div
      ref={scrollRef}
      style={{
        maxHeight: '400px',
        overflowY: 'auto',
        background: 'var(--surface-container, #141520)',
        borderRadius: '8px',
        padding: '16px',
        fontFamily: 'var(--font-geist-mono, "Geist Mono", monospace)',
        fontSize: '12px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--accent-primary, #7B6EF6) var(--surface-container-highest, #26283C)',
      }}
    >
      {displayedEntries.map((entry, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '6px', lineHeight: '1.6' }}>
          <span style={{ color: 'var(--on-surface-variant, #A2A5B5)', whiteSpace: 'nowrap', flexShrink: 0 }}>{entry.ts}</span>
          <span style={{ color: 'var(--accent-secondary, #4CC9F0)', fontWeight: 500, minWidth: '22ch', flexShrink: 0 }}>{entry.action}</span>
          <span>
            <span style={{ color: entry.ok === true ? '#4ADE80' : 'var(--accent-primary, #7B6EF6)', marginRight: '6px' }}>{entry.status}</span>
            <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>{entry.desc}</span>
          </span>
        </div>
      ))}
      {displayedEntries.length === 0 && (
        <span style={{ color: 'var(--on-surface-variant, #A2A5B5)' }}>Initializing session log...</span>
      )}
    </div>
  );
}

// ─── Network Status Modal ────────────────────────────────────────────────────

function StatusRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '12px', fontFamily: 'DM Sans, sans-serif', color: 'var(--on-surface-variant, #A2A5B5)' }}>{label}</span>
      <span style={{ fontSize: '12px', fontFamily: '"Geist Mono", monospace', color: valueColor || 'var(--on-surface, #E8EAF2)' }}>{value}</span>
    </div>
  );
}

function StatusCard({
  tag, tagChip, chipBg, chipBorder, chipColor, children,
}: {
  tag: string; tagChip: string; chipBg: string; chipBorder: string; chipColor: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'var(--surface-container, #141520)',
      border: '1px solid var(--surface-container-highest, #26283C)',
      borderRadius: '10px',
      padding: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant, #A2A5B5)' }}>{tag}</span>
        <span style={{
          fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em',
          padding: '3px 8px', borderRadius: '999px',
          background: chipBg, border: `1px solid ${chipBorder}`, color: chipColor,
        }}>{tagChip}</span>
      </div>
      {children}
    </div>
  );
}

function NetworkStatusContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <StatusCard tag="TEE Node Connection" tagChip="CONNECTED" chipBg="rgba(74,222,128,0.12)" chipBorder="rgba(74,222,128,0.25)" chipColor="#4ADE80">
        <StatusRow label="Active Node" value="NODE_07 · EU-WEST" />
        <StatusRow label="Latency" value="84ms" valueColor="var(--accent-secondary, #4CC9F0)" />
        <StatusRow label="Uptime" value="99.97%" />
        <StatusRow label="Protocol" value="TEE-SGX v2.1" />
      </StatusCard>

      <StatusCard tag="Encryption Channel" tagChip="ACTIVE" chipBg="rgba(123,110,246,0.12)" chipBorder="rgba(123,110,246,0.25)" chipColor="var(--accent-primary, #7B6EF6)">
        <StatusRow label="Algorithm" value="X25519-ChaCha20-Poly1305" />
        <StatusRow label="Session Key" value="EPHEMERAL · Rotates on disconnect" />
        <StatusRow label="Payload Size" value="2.4 KB avg" />
        <StatusRow label="Zero-log" value="ENFORCED" valueColor="#4ADE80" />
      </StatusCard>

      <StatusCard tag="Solana RPC" tagChip="DEVNET" chipBg="rgba(251,191,36,0.12)" chipBorder="rgba(251,191,36,0.25)" chipColor="#FBBF24">
        <StatusRow label="Endpoint" value="api.devnet.solana.com" />
        <StatusRow label="Block Height" value="287,441,892" />
        <StatusRow label="TPS" value="2,847" />
        <StatusRow label="Status" value="Operational" valueColor="#4ADE80" />
      </StatusCard>
    </div>
  );
}

// ─── Security Modal ──────────────────────────────────────────────────────────

function SecurityArcScore({ score }: { score: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--surface-container-highest, #26283C)" strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none"
            stroke="url(#secGrad)" strokeWidth="5"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="var(--accent-secondary, #4CC9F0)" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: '20px', fontWeight: 700, color: 'var(--on-surface, #E8EAF2)', lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ADE80', marginTop: '2px' }}>SECURE</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', fontFamily: '"Geist Mono", monospace', color: 'var(--on-surface-variant, #A2A5B5)', marginTop: '6px' }}>
        Last audited: just now
      </div>
    </div>
  );
}

const SEC_CHECKS = [
  {
    icon: <ShieldCheck size={16} />, iconBg: 'rgba(74,222,128,0.12)', iconColor: '#4ADE80',
    label: 'Local Encryption', sub: 'Data encrypted before any network call',
    badge: 'ACTIVE', badgeType: 'green' as const,
  },
  {
    icon: <Lock size={16} />, iconBg: 'rgba(74,222,128,0.12)', iconColor: '#4ADE80',
    label: 'Zero Server Storage', sub: 'No prompts or responses stored server-side',
    badge: 'VERIFIED', badgeType: 'green' as const,
  },
  {
    icon: <Cpu size={16} />, iconBg: 'rgba(76,201,240,0.12)', iconColor: 'var(--accent-secondary, #4CC9F0)',
    label: 'TEE Inference', sub: 'Trusted Execution Environment confirmed',
    badge: 'VERIFIED', badgeType: 'blue' as const,
  },
  {
    icon: <Eye size={16} />, iconBg: 'rgba(74,222,128,0.12)', iconColor: '#4ADE80',
    label: 'Zero-Log Policy', sub: 'Inference nodes wipe memory after each session',
    badge: 'ENFORCED', badgeType: 'green' as const,
  },
  {
    icon: <Key size={16} />, iconBg: 'rgba(76,201,240,0.12)', iconColor: 'var(--accent-secondary, #4CC9F0)',
    label: 'Ephemeral Keys', sub: 'Session keys never persist beyond current session',
    badge: 'ACTIVE', badgeType: 'blue' as const,
  },
];

function SecurityContent() {
  return (
    <div>
      <SecurityArcScore score={98} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SEC_CHECKS.map((check, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
              background: check.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: check.iconColor,
            }}>
              {check.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontFamily: 'DM Sans, sans-serif', color: 'var(--on-surface, #E8EAF2)', fontWeight: 500 }}>
                {check.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--on-surface-variant, #A2A5B5)', marginTop: '1px' }}>
                {check.sub}
              </div>
            </div>
            <span style={{
              fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em',
              padding: '3px 10px', borderRadius: '999px', flexShrink: 0,
              background: check.badgeType === 'green' ? 'rgba(74,222,128,0.1)' : 'rgba(76,201,240,0.1)',
              border: check.badgeType === 'green' ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(76,201,240,0.25)',
              color: check.badgeType === 'green' ? '#4ADE80' : 'var(--accent-secondary, #4CC9F0)',
            }}>
              {check.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────

type ModalId = 'system-logs' | 'network-status' | 'security' | null;

export default function LandingPage() {
  const { connected, connect } = useWallet();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalId>(null);

  useEffect(() => {
    if (connected) {
      router.push('/dashboard/intelligence');
    }
  }, [connected, router]);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connect();
    setTimeout(() => {
      router.push('/dashboard/intelligence');
    }, 400);
  };

  const openModal = (id: ModalId) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <PageTransition>
      <main className="min-h-screen relative flex flex-col bg-transparent selection:bg-[#F72585]/30">
        <AuroraBackground />

        {/* Navigation / Header simple */}
        <header className="fixed top-0 w-full flex items-center justify-between px-8 py-6 z-50 bg-background/5 backdrop-blur-sm">
          <Magnetic strength={0.4}>
            <Link href="/" className="hover:scale-105 transition-transform cursor-none">
              <MetisLogo size="sm" />
            </Link>
          </Magnetic>
          <div className="hidden md:flex gap-6 font-geist text-xs tracking-widest text-on-surface-variant uppercase items-center">
            <button
              onClick={() => openModal('system-logs')}
              className="hover:text-accent-primary transition-colors cursor-pointer bg-transparent border-0 p-0 font-geist text-xs tracking-widest text-on-surface-variant uppercase"
            >
              System Logs
            </button>
            <button
              onClick={() => openModal('network-status')}
              className="hover:text-accent-secondary transition-colors cursor-pointer bg-transparent border-0 p-0 font-geist text-xs tracking-widest text-on-surface-variant uppercase"
            >
              Network Status
            </button>
            <button
              onClick={() => openModal('security')}
              className="hover:text-accent-tertiary transition-colors cursor-pointer bg-transparent border-0 p-0 font-geist text-xs tracking-widest text-on-surface-variant uppercase"
            >
              Security
            </button>
            <Button variant="ghost" className="text-xs h-8 border-accent-primary/20 hover:border-accent-primary/50" onClick={handleConnect}>
              Connect
            </Button>
          </div>
        </header>

        {/* ── Modals ──────────────────────────────────────────────────────── */}
        <ModalShell
          open={activeModal === 'system-logs'}
          onClose={closeModal}
          icon={<Terminal size={18} />}
          title="System Logs"
          chipLabel="LIVE"
          chipColor="blue"
        >
          <SystemLogsContent isOpen={activeModal === 'system-logs'} />
        </ModalShell>

        <ModalShell
          open={activeModal === 'network-status'}
          onClose={closeModal}
          icon={<Wifi size={18} />}
          title="Network Status"
          chipLabel="LIVE"
          chipColor="blue"
        >
          <NetworkStatusContent />
        </ModalShell>

        <ModalShell
          open={activeModal === 'security'}
          onClose={closeModal}
          icon={<ShieldCheck size={18} />}
          title="Security Audit"
          chipLabel="VERIFIED"
          chipColor="green"
        >
          <SecurityContent />
        </ModalShell>

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
              <Button
                size="lg"
                className="metis-liquid-btn px-12 h-14 font-dm font-semibold tracking-wide w-64 shadow-2xl shadow-accent-tertiary/20 group"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Handshake...</span>
                ) : (
                  <span className="group-hover:tracking-widest transition-all duration-300">CONNECT ENCLAVE</span>
                )}
              </Button>
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
                  <span className="text-[#7B6EF6] font-mono">01</span>
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
                  <span className="text-[#F72585] font-mono">02</span>
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
                  <span className="text-[#4CC9F0] font-mono">03</span>
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

      </main>
    </PageTransition>
  );
}
