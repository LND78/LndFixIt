import ColorConverter from '@/components/ColorConverter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Picker & Converter (HEX, RGB, HSL) | LND AI Tools',
  description: 'A free online tool to pick colors and convert them between HEX, RGB, and HSL formats instantly. Part of the LND AI suite.',
  keywords: ['Color Converter', 'Color Picker', 'HEX to RGB', 'HEX to HSL', 'LND AI'],
};

export default function ColorConverterPage() {
  return (
    <div className="control-panel slide-up">
        <ColorConverter />
    </div>
  );
}
