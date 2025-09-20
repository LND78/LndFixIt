import PdfEditor from '@/components/PdfEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Editor | LND AI Tools',
  description: 'A free, client-side PDF editor with a wide range of features.',
  keywords: ['PDF Editor', 'Edit PDF', 'PDF Annotator', 'Free Tools', 'LND AI'],
};

export default function PdfEditorPage() {
  return (
    <div className="control-panel slide-up">
      <PdfEditor />
    </div>
  );
}
