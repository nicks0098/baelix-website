import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private owner inbox',
  robots: { index: false, follow: false, nocache: true },
};

export default function FeedbackInboxLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
