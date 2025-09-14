import AdvancedClock from '@/components/AdvancedClock';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Day & Time Tool | LND AI',
  description: 'View the current time and date in multiple timezones around the world. Defaults to your local timezone.',
  keywords: ['Timezone Converter', 'World Clock', 'Time Tool', 'LND AI'],
};

export default function AdvancedClockPage() {
  return (
    <div className="control-panel slide-up">
        <AdvancedClock />
    </div>
  );
}
