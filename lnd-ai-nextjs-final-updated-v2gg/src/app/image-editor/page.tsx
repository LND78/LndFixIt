import ImageEditor from '@/components/ImageEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Image Editor | LND AI Tools',
  description: 'Edit your images online for free. Adjust brightness, contrast, saturation, hue, and more with this simple yet powerful tool.',
  keywords: ['Image Editor', 'Photo Editor', 'Image Filters', 'Free Tools', 'LND AI'],
};

export default function ImageEditorPage() {
  return (
    <div className="control-panel slide-up">
        <ImageEditor />
    </div>
  );
}
