import WebScrap from '@/components/WebScrap';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Web Image Scraper | LND AI Tools',
  description: 'Easily scrape and download images from any website with the LND AI web scraping tool. Find high-quality images for your projects for free.',
  keywords: ['Image Scraper', 'Web Scraping', 'Download Images', 'LND AI', 'Naman Soni'],
};

export default function WebScrapingPage() {
  return <WebScrap />;
}
