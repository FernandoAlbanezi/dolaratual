import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CurrencyComparisonProps {
  currencies: Array<{
    code: string;
    name: string;
    bid: number;
    pctChange: number;
  }>;
}

export default function CurrencyComparison({ currencies }: CurrencyComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currencies.map((currency) => {
        const isPositive = currency.pctChange >= 0;
        const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
        const bgTrendColor = isPositive ? 'bg-green-50' : 'bg-red-50';

        return (
          <Card key={currency.code} className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">{currency.code}</h4>
                <p className="text-xs text-gray-500">{currency.name}</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${bgTrendColor}`}>
                {isPositive ? (
                  <TrendingUp className={`w-3 h-3 ${trendColor}`} />
                ) : (
                  <TrendingDown className={`w-3 h-3 ${trendColor}`} />
                )}
                <span className={`text-xs font-semibold ${trendColor}`}>
                  {isPositive ? '+' : ''}{currency.pctChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">
              {currency.bid.toFixed(4)}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
