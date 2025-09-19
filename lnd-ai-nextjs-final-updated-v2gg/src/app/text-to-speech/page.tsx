import TextToSpeech from '@/components/TextToSpeech';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Text to Speech (TTS) | LND AI by Naman Soni',
  description: 'Convert text into natural-sounding speech for free with the LND AI TTS tool. Multiple languages and voices available. No sign-up required.',
  keywords: ['Text to Speech', 'TTS', 'AI Voice Generator', 'LND AI', 'Naman Soni'],
};

export default function TextToSpeechPage() {
  return <TextToSpeech />;
}
