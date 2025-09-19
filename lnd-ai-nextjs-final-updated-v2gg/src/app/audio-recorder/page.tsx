import AudioRecorder from '@/components/AudioRecorder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Audio Recorder | LND AI Tools',
  description: 'Record audio directly from your microphone online for free. Save and download your recordings as WEBM files.',
  keywords: ['Audio Recorder', 'Voice Recorder', 'Record Audio', 'Free Tools', 'LND AI'],
};

export default function AudioRecorderPage() {
  return (
    <div className="control-panel slide-up">
        <AudioRecorder />
    </div>
  );
}
