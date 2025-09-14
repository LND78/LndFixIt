import Whiteboard from '@/components/Whiteboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Whiteboard | LND AI Tools',
  description: 'A simple and free online whiteboard for drawing, sketching, and brainstorming. No sign-up required.',
  keywords: ['Whiteboard', 'Online Whiteboard', 'Drawing Tool', 'Free Tools', 'LND AI'],
};

export default function WhiteboardPage() {
  return (
    <div className="control-panel slide-up">
        <Whiteboard />
    </div>
  );
}
