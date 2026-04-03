import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { CustomCursor } from '@/components/cursor/CustomCursor';

export const metadata: Metadata = {
  title: 'METIS | Submerged Intelligence',
  description: 'Encrypted AI analysis of your portfolio. Zero-log inference.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-accent-primary selection:text-white">
        
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
