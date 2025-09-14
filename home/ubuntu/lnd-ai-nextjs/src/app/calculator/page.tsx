import Calculator from '@/components/Calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Scientific Calculator | LND AI Tools',
  description: 'A free, online advanced calculator with scientific functions, history, and a user-friendly interface. Part of the LND AI tool suite.',
  keywords: ['Calculator', 'Scientific Calculator', 'Online Calculator', 'Free Tools', 'LND AI'],
};

export default function CalculatorPage() {
  return <Calculator />;
}
