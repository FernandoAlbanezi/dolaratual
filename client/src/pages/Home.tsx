import { useEffect, useState } from 'react';
import DollarCard from '@/components/DollarCard';
import SimpleLineChart from '@/components/SimpleLineChart';
import { RefreshCw, Clock } from 'lucide-react';

interface CurrencyData {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

interface HistoricalData {
  time: string;
  value: number;
}

export default function Home() {
  const [dollarData, setDollarData] = useState<{
    commercial: CurrencyData | null;
    tourism: CurrencyData | null;
    ptax: CurrencyData | null;
  }>({
    commercial: null,
    tourism: null,
    ptax: null,
  });

  const [historicalData, setHistoricalData] = useState<{
    commercial: HistoricalData[];
    tourism: HistoricalData[];
  }>({
    commercial: [],
    tourism: [],
  });

  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchDollarData = async () => {
    try {
      setError('');
      // Fetch current rates
      const response = await fetch(
        'https://economia.awesomeapi.com.br/json/last/USD-BRL,USD-BRLT,USD-BRLPTAX'
      );
      const data = await response.json();

      setDollarData({
        commercial: data.USDBRL,
        tourism: data.USDBRLT,
        ptax: data.USDBRLPTAX,
      });

      // Fetch historical data (last 15 days)
      const historicalResponse = await fetch(
        'https://economia.awesomeapi.com.br/json/daily/USD-BRL/15'
      );
      const historicalDataArray = await historicalResponse.json();

      // Process historical data for charts
      const processedData = historicalDataArray.slice(0, 10).reverse().map((item: any) => ({
        time: new Date(item.timestamp * 1000).toLocaleDateString('pt-BR', {
          month: '2-digit',
          day: '2-digit',
        }),
        value: parseFloat(item.bid),
      }));

      setHistoricalData({
        commercial: processedData,
        tourism: processedData,
      });

      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
      setLoading(false);
    } catch (err) {
      setError('Erro ao buscar dados de câmbio');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDollarData();
    const interval = setInterval(fetchDollarData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando cotações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDollarData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitor de Dolar 24h</h1>
              <p className="text-sm text-gray-600 mt-1">Acompanhamento em tempo real das cotacoes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{lastUpdate}</span>
              </div>
              <button
                onClick={fetchDollarData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Primary Card - Commercial Dollar */}
        <div className="mb-8">
          {dollarData.commercial && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Dolar Comercial</h2>
                <p className="text-sm text-gray-500">Taxa oficial do mercado interbancario</p>
              </div>
              <div className="flex items-baseline gap-4 mb-8">
                <div className="text-6xl font-bold text-gray-900 font-mono">
                  {parseFloat(dollarData.commercial.bid).toFixed(4)}
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  parseFloat(dollarData.commercial.pctChange) >= 0
                    ? 'bg-green-50'
                    : 'bg-red-50'
                }`}>
                  <span className={`text-lg font-semibold ${
                    parseFloat(dollarData.commercial.pctChange) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {parseFloat(dollarData.commercial.pctChange) >= 0 ? '+' : ''}
                    {parseFloat(dollarData.commercial.pctChange).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Compra (Bid)</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {parseFloat(dollarData.commercial.bid).toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Venda (Ask)</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {parseFloat(dollarData.commercial.ask).toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Maxima (24h)</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {parseFloat(dollarData.commercial.high).toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Minima (24h)</p>
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {parseFloat(dollarData.commercial.low).toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {dollarData.tourism && (
            <DollarCard
              title="Dolar Turismo"
              code="USD-BRLT"
              bid={parseFloat(dollarData.tourism.bid)}
              ask={parseFloat(dollarData.tourism.ask)}
              pctChange={parseFloat(dollarData.tourism.pctChange)}
              varBid={parseFloat(dollarData.tourism.varBid)}
              high={parseFloat(dollarData.tourism.high)}
              low={parseFloat(dollarData.tourism.low)}
              lastUpdate={lastUpdate}
            />
          )}
          {dollarData.ptax && (
            <DollarCard
              title="Dolar PTAX (Banco Central)"
              code="USD-BRLPTAX"
              bid={parseFloat(dollarData.ptax.bid)}
              ask={parseFloat(dollarData.ptax.ask)}
              pctChange={parseFloat(dollarData.ptax.pctChange)}
              varBid={parseFloat(dollarData.ptax.varBid)}
              high={parseFloat(dollarData.ptax.high)}
              low={parseFloat(dollarData.ptax.low)}
              lastUpdate={lastUpdate}
            />
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {historicalData.commercial.length > 0 && (
            <SimpleLineChart
              data={historicalData.commercial}
              title="Variacao Dolar Comercial (Ultimos 10 dias)"
              isPositive={parseFloat(dollarData.commercial?.pctChange || '0') >= 0}
            />
          )}
          {historicalData.tourism.length > 0 && (
            <SimpleLineChart
              data={historicalData.tourism}
              title="Variacao Dolar Turismo (Ultimos 10 dias)"
              isPositive={parseFloat(dollarData.tourism?.pctChange || '0') >= 0}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Sobre as cotacoes</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              <strong>Dolar Comercial:</strong> Taxa oficial utilizada em transacoes comerciais e financeiras entre bancos.
            </li>
            <li>
              <strong>Dolar Turismo:</strong> Taxa utilizada em casas de cambio para turistas e pessoas fisicas.
            </li>
            <li>
              <strong>PTAX:</strong> Taxa calculada pelo Banco Central do Brasil, utilizada como referencia para contratos financeiros.
            </li>
            <li>
              <strong>Atualizacao:</strong> Os dados sao atualizados a cada minuto automaticamente.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
