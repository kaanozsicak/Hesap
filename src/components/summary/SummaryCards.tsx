import React from 'react';
import { formatTL, formatLot, formatPercent, formatMonthYear } from '../../lib/format';
import { SimulationResult } from '../../lib/simulation';

interface Props {
  result: SimulationResult;
  currentPrice: number;
  dailyGrowthRate: number;
  monthlyTarget: number;
  temmuzTarget: number;
}

export const SummaryCards: React.FC<Props> = ({
  result,
  currentPrice,
  dailyGrowthRate,
  monthlyTarget,
  temmuzTarget,
}) => {
  return (
    <div className="card">
      <div className="card-title">Genel Bakış — {result.scenarioLabel}</div>
      <div className="summary-grid">
        <div className="summary-item accent">
          <div className="label">Enstrüman</div>
          <div className="value">TLY</div>
        </div>
        <div className="summary-item">
          <div className="label">Mevcut Lot</div>
          <div className="value">{formatLot(result.startingLots)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Güncel Fiyat</div>
          <div className="value">{formatTL(currentPrice)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Günlük Artış</div>
          <div className="value">{formatPercent(dailyGrowthRate)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Aylık Satış Hedefi</div>
          <div className="value">{formatTL(monthlyTarget)}</div>
        </div>
        <div className="summary-item orange">
          <div className="label">Temmuz Özel</div>
          <div className="value">{formatTL(temmuzTarget)}</div>
        </div>
        <div className="summary-item green">
          <div className="label">Yıl Sonu Kalan Lot</div>
          <div className="value">{formatLot(result.yearEndLots)}</div>
        </div>
        <div className="summary-item green">
          <div className="label">Yıl Sonu Kalan Değer</div>
          <div className="value">{formatTL(result.yearEndValue)}</div>
        </div>
        <div className="summary-item accent">
          <div className="label">İlk Satış Ayı</div>
          <div className="value">{formatMonthYear(result.firstSaleMonth.year, result.firstSaleMonth.month)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Yıl Sonu Fiyat</div>
          <div className="value">{formatTL(result.yearEndPrice)}</div>
        </div>
        <div className="summary-item red">
          <div className="label">Toplam Satılan Lot</div>
          <div className="value">{formatLot(result.totalSoldLots)}</div>
        </div>
        <div className="summary-item red">
          <div className="label">Toplam Satılan TL</div>
          <div className="value">{formatTL(result.totalSoldValue)}</div>
        </div>
      </div>
    </div>
  );
};
