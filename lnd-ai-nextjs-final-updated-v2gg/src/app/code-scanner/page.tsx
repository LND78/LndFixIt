import CodeScanner from '@/components/CodeScanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR & Barcode Scanner | LND AI Tools',
  description: 'Scan QR codes and barcodes directly from your browser using your camera. Free and easy to use online code scanner.',
  keywords: ['QR Code Scanner', 'Barcode Scanner', 'Code Scanner', 'LND AI'],
};

export default function CodeScannerPage() {
  return (
    <div className="control-panel slide-up">
        <CodeScanner />
    </div>
  );
}
