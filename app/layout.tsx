import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://baelix.pages.dev'),
  title: {
    default: 'BAELIX AI — Free AI Automation for Windows',
    template: '%s | BAELIX AI',
  },
  description: 'Download BAELIX AI, a free Windows AI workspace that turns conversations into real work with visible automation, OpenRouter intelligence, and optional Cloudflare image generation.',
  applicationName: 'BAELIX AI',
  keywords: [
    'BAELIX', 'BAELIX AI', 'free AI automation', 'Windows AI assistant',
    'AI agent for Windows', 'OpenRouter desktop app', 'Cloudflare AI image generation',
    'desktop automation', 'free AI agent',
  ],
  authors: [{ name: 'Nikhil Dhandhi' }, { name: 'Rupesh Chauhan' }],
  creator: 'BAELIX',
  publisher: 'BAELIX',
  category: 'technology',
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  icons: { icon: '/baelix-signature.svg', apple: '/baelix-logo.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    url: 'https://baelix.pages.dev',
    siteName: 'BAELIX AI',
    title: 'BAELIX AI — Free AI Automation for Windows',
    description: 'One focused Windows workspace where free AI can chat, create, and carry real work forward.',
    images: [{ url: '/screenshots/baelix-free.png', width: 1917, height: 1078, alt: 'BAELIX AI Free Intelligence workspace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BAELIX AI — Free AI Automation for Windows',
    description: 'Chat, create, and automate real work on Windows with BAELIX AI.',
    images: ['/screenshots/baelix-free.png'],
  },
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'BAELIX AI',
              alternateName: 'BAELIX',
              url: 'https://baelix.pages.dev',
              downloadUrl: 'https://baelix.pages.dev/api/download/windows',
              applicationCategory: 'ProductivityApplication',
              applicationSubCategory: 'Artificial Intelligence and Automation',
              operatingSystem: 'Windows 10, Windows 11',
              description: 'A free Windows AI workspace for conversation, visible automation, project creation, and optional image generation.',
              screenshot: [
                'https://baelix.pages.dev/screenshots/baelix-free.png',
                'https://baelix.pages.dev/screenshots/baelix-activity.png',
                'https://baelix.pages.dev/screenshots/baelix-complete.png',
              ],
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: [
                { '@type': 'Person', name: 'Nikhil Dhandhi' },
                { '@type': 'Person', name: 'Rupesh Chauhan' },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
