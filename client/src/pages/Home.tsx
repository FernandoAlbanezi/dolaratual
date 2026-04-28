import { useEffect, useState } from 'react';
import DollarCard from '@/components/DollarCard';
import SimpleLineChart from '@/components/SimpleLineChart';
import CurrencyComparison from '@/components/CurrencyComparison';
import EconomicIndicators from '@/components/EconomicIndicators';
import { RefreshCw, Clock, TrendingUp } from 'lucide-react';

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

interface IndicatorData {
  country: string;
  gdp: number | null;
  inflation: number | null;
  debt: number | null;
  gdpGrowth: number | null;
  lastUpdate: string;
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

  const [otherCurrencies, setOtherCurrencies] = useState<Array<{
    code: string;
    name: string;
    bid: number;
    pctChange: number;
  }>>([]);

  const [historicalData, setHistoricalData] = useState<{
    commercial: HistoricalData[];
    tourism: HistoricalData[];
  }>({
    commercial: [],
    tourism: [],
  });

  const [economicIndicators, setEconomicIndicators] = useState<IndicatorData[]>([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Dados simulados para indicadores econômicos (em produção, viriam de uma API)
  const getMockEconomicData = (): IndicatorData[] => {
    return [
      {
        country: 'Brasil',
        gdp: 2.08e12,
        inflation: 4.2,
        debt: 58.5,
        gdpGrowth: 2.9,
        lastUpdate: new Date().toLocaleString('pt-BR'),
      },
      {
        country: 'Estados Unidos',
        gdp: 27.36e12,
        inflation: 3.1,
        debt: 123.5,
        gdpGrowth: 2.5,
        lastUpdate: new Date().toLocaleString('pt-BR'),
      },
      {
        country: 'Argentina',
        gdp: 0.45e12,
        inflation: 189.4,
        debt: 87.2,
        gdpGrowth: -2.1,
        lastUpdate: new Date().toLocaleString('pt-BR'),
      },
      {
        country: 'Canada',
        gdp: 2.14e12,
        inflation: 2.0,
        debt: 84.3,
        gdpGrowth: 1.1,
        lastUpdate: new Date().toLocaleString('pt-BR'),
      },
      {
        country: 'Mexico',
        gdp: 1.29e12,
        inflation: 4.8,
        debt: 45.2,
        gdpGrowth: 1.5,
        lastUpdate: new Date().toLocaleString('pt-BR'),
      },
    ];
  };

  const fetchDollarData = async () => {
    try {
      setError('');
      // Fetch current rates
      const response = await fetch(
        'https://economia.awesomeapi.com.br/json/last/USD-BRL,USD-BRLT,USD-BRLPTAX,EUR-BRL,GBP-BRL,JPY-BRL,CAD-BRL,AUD-BRL,CHF-BRL'
      );
      const data = await response.json();

      setDollarData({
        commercial: data.USDBRL,
        tourism: data.USDBRLT,
        ptax: data.USDBRLPTAX,
      });

      // Set other currencies
      setOtherCurrencies([
        {
          code: 'EUR',
          name: 'Euro',
          bid: parseFloat(data.EURBRL?.bid || '0'),
          pctChange: parseFloat(data.EURBRL?.pctChange || '0'),
        },
        {
          code: 'GBP',
          name: 'Libra Esterlina',
          bid: parseFloat(data.GBPBRL?.bid || '0'),
          pctChange: parseFloat(data.GBPBRL?.pctChange || '0'),
        },
        {
          code: 'JPY',
          name: 'Iene Japones',
          bid: parseFloat(data.JPYBRL?.bid || '0'),
          pctChange: parseFloat(data.JPYBRL?.pctChange || '0'),
        },
        {
          code: 'CAD',
          name: 'Dolar Canadense',
          bid: parseFloat(data.CADBRL?.bid || '0'),
          pctChange: parseFloat(data.CADBRL?.pctChange || '0'),
        },
        {
          code: 'AUD',
          name: 'Dolar Australiano',
          bid: parseFloat(data.AUDBRL?.bid || '0'),
          pctChange: parseFloat(data.AUDBRL?.pctChange || '0'),
        },
        {
          code: 'CHF',
          name: 'Franco Suico',
          bid: parseFloat(data.CHFBRL?.bid || '0'),
          pctChange: parseFloat(data.CHFBRL?.pctChange || '0'),
        },
      ]);

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

      // Set economic indicators
      setEconomicIndicators(getMockEconomicData());

      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
      setLoading(false);
    } catch (err) {
      setError('Erro ao buscar dados de cambio');
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
          <p className="text-gray-600">Carregando cotacoes...</p>
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
              <p className="text-sm text-gray-600 mt-1">Acompanhamento em tempo real das cotacoes e indicadores economicos</p>
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

        {/* Outras Moedas */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Comparacao de Moedas</h2>
          </div>
          <CurrencyComparison currencies={otherCurrencies} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        {/* Indicadores Economicos */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Indicadores Economicos</h2>
          </div>
          <EconomicIndicators indicators={economicIndicators} />
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Sobre as cotacoes e indicadores</h3>
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
              <strong>Outras Moedas:</strong> Cotacoes de EUR, GBP, JPY, CAD, AUD e CHF em relacao ao Real.
            </li>
            <li>
              <strong>Indicadores Economicos:</strong> PIB, Inflacao e Divida Publica dos principais paises.
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
