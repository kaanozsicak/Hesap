import React from 'react';
import { formatTL, formatLot } from '../../lib/format';
import { ComparisonResult, SimulationResult } from '../../lib/simulation';

interface Props {
  comparison: ComparisonResult;
  result1: SimulationResult;
  result2: SimulationResult;
}

export const ComparisonCards: React.FC<Props> = ({ comparison, result1, result2 }) => {
  return (
    <div className="card">
      <div className="card-title">Senaryo Karşılaştırması</div>
      <div className="comparison-grid">
        <div className="comparison-card">
          <div className="label">Daha Fazla Lot Kalan</div>
          <div className="value" style={{ color: 'var(--green)' }}>
            {comparison.moreLotScenario}
          </div>
          <div className="sub">Fark: {formatLot(comparison.temmuzImpactLots)} lot</div>
        </div>
        <div className="comparison-card">
          <div className="label">Daha Fazla Değer Kalan</div>
          <div className="value" style={{ color: 'var(--green)' }}>
            {comparison.moreValueScenario}
          </div>
          <div className="sub">Fark: {formatTL(comparison.temmuzImpactValue)}</div>
        </div>
      </div>
      <div className="comparison-grid">
        <div className="comparison-card">
          <div className="label">Standart — Yıl Sonu</div>
          <div className="value" style={{ color: 'var(--accent)' }}>
            {formatLot(result1.yearEndLots)} lot
          </div>
          <div className="sub">{formatTL(result1.yearEndValue)}</div>
        </div>
        <div className="comparison-card">
          <div className="label">Temmuz Özel — Yıl Sonu</div>
          <div className="value" style={{ color: 'var(--orange)' }}>
            {formatLot(result2.yearEndLots)} lot
          </div>
          <div className="sub">{formatTL(result2.yearEndValue)}</div>
        </div>
      </div>
    </div>
  );
};
