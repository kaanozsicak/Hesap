import React from 'react';
import { SellDayStrategy } from '../../lib/tradingCalendar';

interface SimParams {
  startingLots: number;
  currentPrice: number;
  dailyGrowthRate: number;
  monthlyTarget: number;
  temmuzTarget: number;
  temmuzActive: boolean;
  referenceDate: string;
  sellDayStrategy: SellDayStrategy;
  halfDaysClosed: boolean;
}

interface Props {
  params: SimParams;
  onChange: (params: SimParams) => void;
}

export const ParamsForm: React.FC<Props> = ({ params, onChange }) => {
  const update = (key: keyof SimParams, value: unknown) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="card">
      <div className="card-title">Parametreler</div>
      <div className="params-grid">
        <div className="input-group">
          <label>Başlangıç Lotu</label>
          <input
            type="number"
            value={params.startingLots}
            onChange={e => update('startingLots', Math.max(0, Math.floor(Number(e.target.value) || 0)))}
          />
        </div>
        <div className="input-group">
          <label>Güncel Fiyat (TL)</label>
          <input
            type="number"
            step="0.01"
            value={params.currentPrice}
            onChange={e => update('currentPrice', Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="input-group">
          <label>Günlük Artış (%)</label>
          <input
            type="number"
            step="0.0001"
            value={(params.dailyGrowthRate * 100).toFixed(4)}
            onChange={e => update('dailyGrowthRate', Math.max(0, (Number(e.target.value) || 0) / 100))}
          />
        </div>
        <div className="input-group">
          <label>Aylık Satış Hedefi (TL)</label>
          <input
            type="number"
            value={params.monthlyTarget}
            onChange={e => update('monthlyTarget', Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="input-group">
          <label>Temmuz Satış Tutarı (TL)</label>
          <input
            type="number"
            value={params.temmuzTarget}
            onChange={e => update('temmuzTarget', Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="input-group">
          <label>Referans Tarih</label>
          <input
            type="date"
            value={params.referenceDate}
            onChange={e => update('referenceDate', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Satış Günü</label>
          <select
            value={params.sellDayStrategy}
            onChange={e => update('sellDayStrategy', e.target.value as SellDayStrategy)}
          >
            <option value="last">Ayın Son İş Günü</option>
            <option value="first">Ayın İlk İş Günü</option>
          </select>
        </div>
        <div className="input-group">
          <div className="toggle-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={params.temmuzActive}
                onChange={e => update('temmuzActive', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
            <label onClick={() => update('temmuzActive', !params.temmuzActive)}>
              Temmuz Özel Satış
            </label>
          </div>
        </div>
        <div className="input-group">
          <div className="toggle-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={params.halfDaysClosed}
                onChange={e => update('halfDaysClosed', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
            <label onClick={() => update('halfDaysClosed', !params.halfDaysClosed)}>
              Yarım Gün Tatil Kapalı
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { SimParams };
