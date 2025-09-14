import BinaryConverter from '@/components/BinaryConverter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binary Convereter | Decimal, Hex, Octal & Text Converter | LND AI',
  description: 'Free online tool to convert between binary, decimal, hexadecimal, octal, and text (ASCII). Fast and easy to use. Part of the LND AI suite.',
  keywords: ['Binary Converter' , 'Binary To Decimal' , 'Decimal Converter', 'Hex Converter', 'Octal Converter', 'Binary To' , 'ASCII Converter', 'LND AI'],
};

export default function BinaryConverterPage() {
  return <BinaryConverter />;
}
