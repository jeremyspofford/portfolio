'use client';

import { ActivityCalendar } from 'react-activity-calendar';
import { useEffect, useState } from 'react';

interface ContributionsProps {
  data: Array<{
    date: string;
    count: number;
    level: number;
  }>;
  total: number;
}

export function Contributions({ data, total }: ContributionsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h3 className="text-lg sm:text-xl font-bold">Coding Activity</h3>
        <span className="text-xs sm:text-sm text-muted-foreground font-mono">
          {total.toLocaleString()} contributions in the last year
        </span>
      </div>

      <div className="p-3 sm:p-6 border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-x-auto">
        <div className="min-w-[650px] sm:min-w-0">
           <ActivityCalendar
            data={data}
            theme={{
              light: ['#ebedf0', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
            }}
            blockSize={10}
            blockMargin={3}
            fontSize={11}
            labels={{
                legend: {
                    less: 'Less',
                    more: 'More'
                },
                months: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
                totalCount: '{{count}} contributions in {{year}}',
                weekdays: [
                    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
                ]
            }}
            showWeekdayLabels
          />
        </div>
      </div>
       <div className="flex justify-end text-xs text-muted-foreground gap-1">
          <span>Data from</span>
          <a href="https://github.com/jeremyspofford" target="_blank" className="hover:text-primary transition-colors font-medium">@jeremyspofford</a>
          on GitHub
      </div>
    </div>
  );
}
