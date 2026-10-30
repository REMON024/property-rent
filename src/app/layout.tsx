import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: { default: 'Basha Khoj', template: '%s · Basha Khoj' },
  description: 'Find a verified home to rent and book it for the dates you need.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#18221d' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Hind+Siliguri:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <Header />
        <main className="pb-24 md:pb-10">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
