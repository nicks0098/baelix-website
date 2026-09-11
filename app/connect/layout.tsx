import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Universal Connector',
  description:
    'Connect supported AI accounts to the BAELIX desktop app through each provider\'s official authorization flow.',
  alternates: { canonical: '/connect' },
  robots: { index: false, follow: false },
};

export default function ConnectorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
