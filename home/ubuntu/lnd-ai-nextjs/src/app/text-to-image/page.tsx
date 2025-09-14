import TextToImage from '@/components/TextToImage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Text To Image Generator Ai | LND AI | Nano Banana',
  description: 'Create Stunning AI Images like Nano Banana from Text for Free with LND AI, free text-to-image generator without sign up!. Describe your vision and watch our advanced AI bring it to life in seconds. Generate realistic images, ghibli, and more. No sign-up required.',
  keywords: ['Free Image Generator' , 'Nano Banana' , 'AI Image Generator', 'Text to Image', 'LND AI', 'Naman Soni', 'Naman Ai', 'AI art generator', 'free AI art', 'image generation from text'],
};

export default function TextToImagePage() {
  return <TextToImage />;
}
