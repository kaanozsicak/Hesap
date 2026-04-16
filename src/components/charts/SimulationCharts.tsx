import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SimulationResult } from '../../lib/simulation';
import { getMonthName, formatLot, formatTL } from '../../lib/format';

interface Props {
  result1: SimulationResult;
  result2: SimulationResult;
}

interface ChartData {
  month: string;
  standartLot: number;
  temmuzLot: number;
  standartDeger: number;
  temmuzDeger: number;
}

const buildChartData = (r1: SimulationResult, r2: SimulationResult): ChartData[] => {
  const data: ChartData[] = [];
  const maxLen = Math.max(r1.months.length, r2.months.length);
  for (let i = 0; i < maxLen; i++) {
    const m1 = r1.months[i];
    const m2 = r2.months[i];
    data.push({
      month: getMonthName(m1?.month ?? m2?.month ?? 0),
      standartLot: m1?.remainingLots ?? 0,
      temmuzLot: m2?.remainingLots ?? 0,
      standartDeger: m1?.remainingValue ?? 0,
      temmuzDeger: m2?.remainingValue ?? 0,
    });
  }
  return data;
};

const formatAxis = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
};

const LotTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: '#1e2130',
      border: '1px solid #2a2d3e',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: '0.78rem',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey.includes('Deger') || p.dataKey.includes('deger')
            ? formatTL(p.value)
            : formatLot(p.value)}
        </div>
      ))}
    </div>
  );
};

export const SimulationCharts: React.FC<Props> = ({ result1, result2 }) => {
  const data = buildChartData(result1, result2);

  return (
    <>
      <div className="card">
        <div className="card-title">Kalan Lot Karşılaştırması</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
              <XAxis dataKey="month" tick={{ fill: '#8b8fa3', fontSize: 11 }} />
              <YAxis tickFormatter={formatAxis} tick={{ fill: '#8b8fa3', fontSize: 11 }} />
              <Tooltip content={<LotTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '0.75rem' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="standartLot"
                name="Standart Plan"
                stroke="#4f8cff"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="temmuzLot"
                name="Temmuz Özel"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Kalan Değer Karşılaştırması (TL)</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
              <XAxis dataKey="month" tick={{ fill: '#8b8fa3', fontSize: 11 }} />
              <YAxis tickFormatter={formatAxis} tick={{ fill: '#8b8fa3', fontSize: 11 }} />
              <Tooltip content={<LotTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '0.75rem' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="standartDeger"
                name="Standart Plan"
                stroke="#4f8cff"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="temmuzDeger"
                name="Temmuz Özel"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};
