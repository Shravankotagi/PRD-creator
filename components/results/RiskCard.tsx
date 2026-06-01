// components/results/RiskCard.tsx

import type { Risk } from '@/types/audit';

interface RiskCardProps {
  risk: Risk;
}

const severityStyles = {
  CRITICAL: 'bg-red-100 text-red-700 border border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border border-green-200',
};

export default function RiskCard({ risk }: RiskCardProps) {
  return (
    <div className="rounded-lg border border-el-border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-lg font-semibold text-el-navy">
          {risk.title}
        </h3>
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${severityStyles[risk.severity]}`}
          >
            {risk.severity}
          </span>
          {risk.confidence && (
            <span className="text-xs text-el-muted font-medium">
              {risk.confidence === 'HIGH' ? '● High confidence' : '◐ Medium confidence'}
            </span>
          )}
        </div>

      {risk.evidence && (
        <div className="mb-3 px-3 py-2 bg-gray-50 border-l-2 border-el-blue rounded text-xs text-el-muted italic">
          Evidence: "{risk.evidence}"
        </div>
      )}

      <p className="mb-5 text-sm leading-6 text-el-body">
        {risk.detail}
      </p>

      <div className="rounded-md border border-red-100 bg-red-50 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">
          Business Impact
        </p>

        <p className="text-sm leading-6 text-red-800">
          {risk.impact}
        </p>
      </div>
    </div>
  );
}