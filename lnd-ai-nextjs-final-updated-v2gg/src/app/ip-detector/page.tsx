import IpDetector from '@/components/IpDetector';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IP Address Detector | LND AI Tools',
  description: 'Get detailed information about any IP address, including location, ISP, and timezone, with this free online tool.',
  keywords: ['IP Detector', 'What is my IP', 'IP Lookup', 'LND AI'],
};

export default function IpDetectorPage() {
  return <IpDetector />;
}
