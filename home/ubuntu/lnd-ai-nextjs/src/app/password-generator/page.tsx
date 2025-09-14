import PasswordGenerator from '@/components/PasswordGenerator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Password Generator | LND AI Tools',
  description: 'Generate strong, secure, and random passwords with customizable options for free. Includes passphrase generation. Part of the LND AI tool suite.',
  keywords: ['Password Generator', 'Secure Password', 'Random Password', 'Passphrase Generator', 'LND AI'],
};

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}
