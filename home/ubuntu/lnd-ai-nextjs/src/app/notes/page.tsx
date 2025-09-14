import NotesApp from '@/components/NotesApp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple Notes App | LND AI Tools',
  description: 'A free and simple online notes app that saves your text automatically to your browser. Your notes are private and stored locally.',
  keywords: ['Notes App', 'Simple Notes', 'Online Notepad', 'Free Tools', 'LND AI'],
};

export default function NotesAppPage() {
  return (
    <div className="control-panel slide-up">
        <NotesApp />
    </div>
  );
}
