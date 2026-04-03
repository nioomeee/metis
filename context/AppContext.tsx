'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type RPCEndpoint = 'mainnet' | 'devnet' | 'custom';

export interface AppSettings {
  rpcEndpoint: RPCEndpoint;
  customRpc: string;
  showTestMode: boolean;
  teeRegion: 'us-east' | 'eu-west' | 'ap-south';
  privacyMode: boolean;
  reducedMotion: boolean;
}

export interface SessionState {
  connected: boolean;
  walletAddress: string | null;
  lastInferenceId: string | null;
  sessionStarted: number | null;
}

interface AppContextValue {
  settings: AppSettings;
  session: SessionState;
  updateSettings: (partial: Partial<AppSettings>) => void;
  updateSession: (partial: Partial<SessionState>) => void;
  resetSession: () => void;
  isHydrated: boolean;
}

const defaultSettings: AppSettings = {
  rpcEndpoint: 'mainnet',
  customRpc: '',
  showTestMode: false,
  teeRegion: 'us-east',
  privacyMode: true,
  reducedMotion: false,
};

const defaultSession: SessionState = {
  connected: false,
  walletAddress: null,
  lastInferenceId: null,
  sessionStarted: null,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [session, setSession] = useState<SessionState>(defaultSession);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('metis-settings');
      if (saved) setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    } catch {}
    setIsHydrated(true);
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try { localStorage.setItem('metis-settings', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const updateSession = useCallback((partial: Partial<SessionState>) => {
    setSession((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(defaultSession);
  }, []);

  return (
    <AppContext.Provider value={{ settings, session, updateSettings, updateSession, resetSession, isHydrated }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
