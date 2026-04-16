import React from 'react';
import { MonthResult, SimulationResult } from '../../lib/simulation';
import { formatTL, formatLot, formatNumber, getMonthName } from '../../lib/format';

interface Props {
  result: SimulationResult;
}

export const SimulationTable: React.FC<Props> = ({ result }) => {
  return (
    <div className="table-wrapper">
      <table className="sim-table">
        <thead>
          <tr>
            <th>Ay</th>
            <th>İşlem Günü</th>
            <th>Hedef Satış</th>
            <th>Satış Fiyatı</th>
            <th>Ay Sonu Fiyat</th>
            <th>Satılan Lot</th>
            <th>Satış Tutarı</th>
            <th>Kalan Lot</th>
            <th>Kalan Değer</th>
          </tr>
        </thead>
        <tbody>
          {result.months.map((m: MonthResult) => (
            <tr key={`${m.year}-${m.month}`}>
              <td>{getMonthName(m.month)}</td>
              <td>{m.tradingDayCount}</td>
              <td>{formatTL(m.targetSellValue)}</td>
              <td>{formatNumber(m.sellDayPrice, 2)} TL</td>
              <td>{formatNumber(m.endOfMonthPrice, 2)} TL</td>
              <td>{formatLot(m.soldLots)}</td>
              <td>{formatTL(m.soldValue)}</td>
              <td>{formatLot(m.remainingLots)}</td>
              <td>{formatTL(m.remainingValue)}</td>
            </tr>
          ))}
          <tr className="summary-row">
            <td>TOPLAM</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{formatNumber(result.yearEndPrice, 2)} TL</td>
            <td>{formatLot(result.totalSoldLots)}</td>
            <td>{formatTL(result.totalSoldValue)}</td>
            <td>{formatLot(result.yearEndLots)}</td>
            <td>{formatTL(result.yearEndValue)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
