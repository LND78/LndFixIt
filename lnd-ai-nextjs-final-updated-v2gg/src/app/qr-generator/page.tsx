import QrGenerator from '@/components/QrGenerator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free QR Code Generator | LND AI Tools',
  description: 'Create custom QR codes for URLs, text, and more for free. Easy to use and download. Part of the LND AI tool suite by Naman Soni.',
  keywords: ['QR Code Generator', 'Free QR Code', 'QR Code', 'LND AI', 'Naman Ai'],
};

export default function QrGeneratorPage() {
  return <QrGenerator />;
}
