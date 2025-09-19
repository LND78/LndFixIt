import WeatherCheck from '@/components/WeatherCheck';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Weather Information | LND AI Tools',
  description: 'Get current weather information for any city in the world for free. Check temperature, humidity, and wind speed instantly.',
  keywords: ['Weather', 'Weather Check', 'Live Weather', 'LND AI'],
};

export default function WeatherCheckPage() {
  return <WeatherCheck />;
}
