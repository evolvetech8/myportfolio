import type { Metadata } from 'next';
import ResultsDashboard from '@/components/depositguard/results/ResultsDashboard';

/**
 * Strict Privacy & Sensitive View Shield:
 * Results are strictly ephemeral client simulations, blocked from search engines
 * using noindex, nofollow robots directives.
 */
export const metadata: Metadata = {
  title: 'Kết Quả Mô Phỏng Rủi Ro Tài Chính Mua Nhà | DepositGuard',
  description:
    'Báo cáo mô phỏng rủi ro lãi suất thả nổi, dòng tiền chi tiết và quỹ dự phòng khẩn cấp.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export const dynamic = 'force-dynamic';
import { waitlistReady } from '@/lib/waitlist/config';
export default function KetQuaPage() {
  return <ResultsDashboard waitlistOpen={waitlistReady()} />;
}
