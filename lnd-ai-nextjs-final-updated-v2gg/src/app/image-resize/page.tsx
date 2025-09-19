import ImageResize from '@/components/ImageResize';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Resizer | LND AI Tools',
  description: 'Resize images to any dimension online for free. Maintain quality with our easy-to-use image resizing tool.',
  keywords: ['Image Resizer', 'Resize Image', 'Free Tools', 'LND AI'],
};

export default function ImageResizePage() {
  return <ImageResize />;
}
