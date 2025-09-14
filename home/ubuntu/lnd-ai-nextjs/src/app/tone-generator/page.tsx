import ToneGenerator from '@/components/ToneGenerator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Tone Generator | LND AI Tools',
  description: 'Generate audio tones with variable frequency, volume, and wave shapes (sine, square, sawtooth, triangle) for free.',
  keywords: ['Tone Generator', 'Frequency Generator', 'Audio Tone', 'Sine Wave', 'LND AI'],
};

export default function ToneGeneratorPage() {
  return (
    <div className="control-panel slide-up">
        <ToneGenerator />
    </div>
  );
}
