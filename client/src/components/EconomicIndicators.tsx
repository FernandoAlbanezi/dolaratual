import { TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface IndicatorData {
  country: string;
  gdp: number | null;
  inflation: number | null;
  debt: number | null;
  gdpGrowth: number | null;
  lastUpdate: string;
}

interface EconomicIndicatorsProps {
  indicators: IndicatorData[];
}

export default function EconomicIndicators({ indicators }: EconomicIndicatorsProps) {
  const getTrendColor = (value: number | null, isNegativeBad: boolean = true) => {
    if (value === null) return 'text-gray-500';
    if (isNegativeBad) {
      return value >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return value <= 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  const getTrendIcon = (value: number | null, isNegativeBad: boolean = true) => {
    if (value === null) return null;
    if (isNegativeBad) {
      return value >= 0 ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      );
    } else {
      return value <= 0 ? (
        <TrendingDown className="w-4 h-4" />
      ) : (
        <TrendingUp className="w-4 h-4" />
      );
    }
  };

  return (
    <div className="space-y-4">
      {indicators.map((indicator) => (
        <Card key={indicator.country} className="p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{indicator.country}</h3>
            <p className="text-xs text-gray-500">{indicator.lastUpdate}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* PIB */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-medium text-gray-600">PIB</p>
                {indicator.gdp !== null && (
                  <div className={`flex items-center gap-1 ${getTrendColor(indicator.gdpGrowth)}`}>
                    {getTrendIcon(indicator.gdpGrowth, true)}
                  </div>
                )}
              </div>
              {indicator.gdp !== null ? (
                <>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(indicator.gdp / 1e12).toFixed(2)}T
                  </p>
                  {indicator.gdpGrowth !== null && (
                    <p className={`text-sm font-medium mt-1 ${getTrendColor(indicator.gdpGrowth)}`}>
                      {indicator.gdpGrowth >= 0 ? '+' : ''}{indicator.gdpGrowth.toFixed(2)}%
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">Sem dados</p>
                </div>
              )}
            </div>

            {/* Inflacao */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-medium text-gray-600">Inflacao</p>
                {indicator.inflation !== null && (
                  <div className={`flex items-center gap-1 ${getTrendColor(indicator.inflation, false)}`}>
                    {getTrendIcon(indicator.inflation, false)}
                  </div>
                )}
              </div>
              {indicator.inflation !== null ? (
                <p className={`text-lg font-semibold ${getTrendColor(indicator.inflation, false)}`}>
                  {indicator.inflation.toFixed(2)}%
                </p>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">Sem dados</p>
                </div>
              )}
            </div>

            {/* Divida */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-medium text-gray-600">Divida Publica</p>
                {indicator.debt !== null && (
                  <div className={`flex items-center gap-1 ${getTrendColor(indicator.debt, false)}`}>
                    {getTrendIcon(indicator.debt, false)}
                  </div>
                )}
              </div>
              {indicator.debt !== null ? (
                <p className={`text-lg font-semibold ${getTrendColor(indicator.debt, false)}`}>
                  {indicator.debt.toFixed(1)}%
                </p>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">Sem dados</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs font-medium text-blue-600 mb-2">Status</p>
              <p className="text-sm text-blue-700">
                Dados atualizados regularmente de fontes oficiais
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
