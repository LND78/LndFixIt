import NetSpeed from '@/components/NetSpeed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internet Speed Test | LND AI Tools',
  description: 'Test your internet download and upload speed for free with this simple and fast speed checker.',
  keywords: ['Internet Speed Test', 'Speed Test', 'Net Speed', 'Download Speed', 'Upload Speed', 'LND AI'],
};

export default function NetSpeedPage() {
  return (
    <div className="control-panel slide-up">
        <NetSpeed />
    </div>
  );
}
