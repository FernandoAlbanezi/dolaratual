import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DollarCardProps {
  title: string;
  code: string;
  bid: number;
  ask: number;
  pctChange: number;
  varBid: number;
  high: number;
  low: number;
  lastUpdate: string;
}

export default function DollarCard({
  title,
  code,
  bid,
  ask,
  pctChange,
  varBid,
  high,
  low,
  lastUpdate,
}: DollarCardProps) {
  const isPositive = pctChange >= 0;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgTrendColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <Card className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-xs text-gray-500">{code}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded ${bgTrendColor}`}>
          {isPositive ? (
            <TrendingUp className={`w-4 h-4 ${trendColor}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${trendColor}`} />
          )}
          <span className={`text-sm font-semibold ${trendColor}`}>
            {isPositive ? '+' : ''}{pctChange.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-gray-900 font-mono tracking-tight">
          {bid.toFixed(4)}
        </div>
        <p className="text-xs text-gray-500 mt-2">Cotacao de Compra (Bid)</p>
      </div>

      {/* Secondary Values */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Venda (Ask)</p>
          <p className="text-lg font-semibold text-gray-800 font-mono">{ask.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Variacao</p>
          <p className={`text-lg font-semibold font-mono ${trendColor}`}>
            {varBid >= 0 ? '+' : ''}{varBid.toFixed(4)}
          </p>
        </div>
      </div>

      {/* High/Low */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Maxima (24h)</p>
          <p className="text-sm font-semibold text-gray-800 font-mono">{high.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Minima (24h)</p>
          <p className="text-sm font-semibold text-gray-800 font-mono">{low.toFixed(4)}</p>
        </div>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-gray-400 text-right">{lastUpdate}</p>
    </Card>
  );
}
