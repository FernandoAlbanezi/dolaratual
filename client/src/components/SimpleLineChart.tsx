import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  title: string;
  isPositive: boolean;
}

export default function SimpleLineChart({ data, title, isPositive }: SimpleLineChartProps) {
  const lineColor = isPositive ? '#16a34a' : '#dc2626';

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
            formatter={(value: any) => typeof value === 'number' ? value.toFixed(4) : value}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
