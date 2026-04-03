'use client';

import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/context/ToastContext';
import { OnboardingTour } from '@/components/modals/OnboardingTour';
import { KeyboardShortcutsModal } from '@/components/modals/KeyboardShortcutsModal';
import { WalletContextProvider } from '@/components/WalletContextProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      <AppProvider>
        <ToastProvider>
          <OnboardingTour />
          <KeyboardShortcutsModal />
          {children}
        </ToastProvider>
      </AppProvider>
    </WalletContextProvider>
  );
}
