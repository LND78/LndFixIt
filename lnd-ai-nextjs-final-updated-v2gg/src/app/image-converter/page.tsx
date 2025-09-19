import ImageConverter from '@/components/ImageConverter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Format Converter | LND AI Tools',
  description: 'Convert images between JPG, PNG, WebP, and other formats online for free. Fast and simple image conversion.',
  keywords: ['Image Converter', 'Convert JPG', 'Convert PNG', 'Convert WebP', 'LND AI'],
};

export default function ImageConverterPage() {
  return <ImageConverter />;
}
