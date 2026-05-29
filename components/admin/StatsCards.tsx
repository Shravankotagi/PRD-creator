// components/admin/StatsCards.tsx

import {
  Activity,
  BarChart3,
  Mail,
  Share2,
  TrendingUp,
} from 'lucide-react';

interface StatsCardsProps {
  totalAudits: number;
  avgScore: number;
  emailsSent: number;
  shareRate: number;
}

const stats = (
  totalAudits: number,
  avgScore: number,
  emailsSent: number,
  shareRate: number
) => [
  {
    label: 'Total Audits',
    value: totalAudits.toLocaleString(),
    icon: Activity,
    trend: '+12.4%',
  },
  {
    label: 'Average Score',
    value: avgScore.toFixed(1),
    icon: BarChart3,
    trend: '+4.2%',
  },
  {
    label: 'Email Captures',
    value: emailsSent.toLocaleString(),
    icon: Mail,
    trend: '+18.1%',
  },
  {
    label: 'Share Rate',
    value: `${shareRate}%`,
    icon: Share2,
    trend: '+6.8%',
  },
];

export default function StatsCards({
  totalAudits,
  avgScore,
  emailsSent,
  shareRate,
}: StatsCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats(
        totalAudits,
        avgScore,
        emailsSent,
        shareRate
      ).map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-lg border border-el-border bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-6 w-6 text-el-blue" />
              </div>

              <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-el-navy">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm text-el-body">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}