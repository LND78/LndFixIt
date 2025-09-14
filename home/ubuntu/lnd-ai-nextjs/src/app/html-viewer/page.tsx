import HtmlSandbox from '@/components/HtmlSandbox';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML Viewer & Sandbox | LND AI Tools',
  description: 'Write and test HTML, CSS, and JavaScript code in a live sandbox environment. View your results instantly and download your work.',
  keywords: ['HTML Viewer', 'HTML Sandbox', 'Code Editor', 'LND AI'],
};

export default function HtmlViewerPage() {
  return (
    <div className="control-panel slide-up">
        <HtmlSandbox />
    </div>
  );
}
