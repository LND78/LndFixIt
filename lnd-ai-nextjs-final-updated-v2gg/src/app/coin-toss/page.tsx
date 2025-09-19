import CoinToss from '@/components/CoinToss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coin Toss Online | LND AI Tools',
  description: 'A simple, free online coin toss tool to flip a virtual coin for heads or tails. Part of the LND AI suite.',
  keywords: ['Coin Toss', 'Flip a Coin', 'Heads or Tails', 'Coin Toss Online', 'LND AI' , 'Filp Coin'],
};

export default function CoinTossPage() {
  return (
    <div className="control-panel slide-up">
        <CoinToss />
    </div>
  );
}
