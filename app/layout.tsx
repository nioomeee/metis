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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const suppress = (e) => {
                  const msg = e.message || (e.reason && e.reason.message) || "";
                  if (msg.includes('MetaMask') || (e.filename && e.filename.includes('nkbihfbeogaeaoehlefnkodbefgpgknn'))) {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    if (e.preventDefault) e.preventDefault();
                    return true;
                  }
                };
                window.addEventListener('error', suppress, true);
                window.addEventListener('unhandledrejection', suppress, true);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-background text-on-surface selection:bg-accent-primary selection:text-white">
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}

