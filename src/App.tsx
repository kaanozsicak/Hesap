import React, { useState, useMemo } from 'react';
import { ParamsForm, SimParams } from './components/inputs/ParamsForm';
import { SummaryCards } from './components/summary/SummaryCards';
import { ComparisonCards } from './components/summary/ComparisonCards';
import { SimulationTable } from './components/table/SimulationTable';
import { SimulationCharts } from './components/charts/SimulationCharts';
import {
  runMonthlyLiquidationSimulation,
  compareScenarioResults,
  SimulationParams,
} from './lib/simulation';
import { createStandardPlan, createTemmuzOzelPlan } from './lib/scenarioPlans';
import { TradingCalendarConfig } from './lib/tradingCalendar';
import { TR_HOLIDAYS_2026 } from './data/holidays/tr-2026';
import { formatTL, formatLot, formatPercent, formatMonthYear } from './lib/format';

const DEFAULT_PARAMS: SimParams = {
  startingLots: 1800,
  currentPrice: 5030.56,
  dailyGrowthRate: 0.005885,
  monthlyTarget: 180_000,
  temmuzTarget: 2_000_000,
  temmuzActive: true,
  referenceDate: '2026-04-16',
  sellDayStrategy: 'last',
  halfDaysClosed: true,
};

type TabId = 'comparison' | 'standard' | 'temmuz';

const App: React.FC = () => {
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS);
  const [activeTab, setActiveTab] = useState<TabId>('comparison');
  const [showParams, setShowParams] = useState(false);

  const calendarConfig: TradingCalendarConfig = useMemo(
    () => ({
      halfDaysClosed: params.halfDaysClosed,
      holidays: TR_HOLIDAYS_2026,
    }),
    [params.halfDaysClosed]
  );

  const refDate = useMemo(() => {
    const parts = params.referenceDate.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }, [params.referenceDate]);

  const standardResult = useMemo(() => {
    const plan = createStandardPlan(params.monthlyTarget);
    const simParams: SimulationParams = {
      startingLots: params.startingLots,
      currentPrice: params.currentPrice,
      dailyGrowthRate: params.dailyGrowthRate,
      referenceDate: refDate,
      sellDayStrategy: params.sellDayStrategy,
      calendarConfig,
      scenarioPlan: plan,
    };
    return runMonthlyLiquidationSimulation(simParams);
  }, [params, calendarConfig, refDate]);

  const temmuzResult = useMemo(() => {
    const plan = createTemmuzOzelPlan(
      params.monthlyTarget,
      params.temmuzTarget,
      params.temmuzActive
    );
    const simParams: SimulationParams = {
      startingLots: params.startingLots,
      currentPrice: params.currentPrice,
      dailyGrowthRate: params.dailyGrowthRate,
      referenceDate: refDate,
      sellDayStrategy: params.sellDayStrategy,
      calendarConfig,
      scenarioPlan: plan,
    };
    return runMonthlyLiquidationSimulation(simParams);
  }, [params, calendarConfig, refDate]);

  const comparison = useMemo(
    () => compareScenarioResults(standardResult, temmuzResult),
    [standardResult, temmuzResult]
  );

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>
          <span>TLY</span> Satış Simülasyonu
        </h1>
        <p>Aylık planlı satış projeksiyonu · İki senaryo karşılaştırması</p>
      </div>

      {/* Quick Overview Card */}
      <div className="card">
        <div className="card-title">Başlangıç Verileri</div>
        <div className="summary-grid">
          <div className="summary-item accent">
            <div className="label">Enstrüman</div>
            <div className="value">TLY</div>
          </div>
          <div className="summary-item">
            <div className="label">Mevcut Lot</div>
            <div className="value">{formatLot(params.startingLots)}</div>
          </div>
          <div className="summary-item">
            <div className="label">Güncel Fiyat</div>
            <div className="value">{formatTL(params.currentPrice)}</div>
          </div>
          <div className="summary-item">
            <div className="label">Günlük Artış</div>
            <div className="value">{formatPercent(params.dailyGrowthRate)}</div>
          </div>
          <div className="summary-item">
            <div className="label">Aylık Hedef</div>
            <div className="value">{formatTL(params.monthlyTarget)}</div>
          </div>
          <div className="summary-item orange">
            <div className="label">Temmuz Özel</div>
            <div className="value">{formatTL(params.temmuzTarget)}</div>
          </div>
          <div className="summary-item accent">
            <div className="label">İlk Satış Ayı</div>
            <div className="value">{formatMonthYear(standardResult.firstSaleMonth.year, standardResult.firstSaleMonth.month)}</div>
          </div>
          <div className="summary-item green">
            <div className="label">Yıl Sonu Fiyat</div>
            <div className="value">{formatTL(standardResult.yearEndPrice)}</div>
          </div>
        </div>
      </div>

      {/* Params toggle */}
      <button className="expand-btn" onClick={() => setShowParams(!showParams)}>
        {showParams ? '▾ Parametreleri Gizle' : '▸ Parametreleri Düzenle'}
      </button>

      {showParams && <ParamsForm params={params} onChange={setParams} />}

      {/* Comparison Cards */}
      <ComparisonCards
        comparison={comparison}
        result1={standardResult}
        result2={temmuzResult}
      />

      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          Karşılaştırma
        </button>
        <button
          className={`tab-btn ${activeTab === 'standard' ? 'active' : ''}`}
          onClick={() => setActiveTab('standard')}
        >
          Standart
        </button>
        <button
          className={`tab-btn ${activeTab === 'temmuz' ? 'active' : ''}`}
          onClick={() => setActiveTab('temmuz')}
        >
          Temmuz Özel
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'comparison' && (
        <SimulationCharts result1={standardResult} result2={temmuzResult} />
      )}

      {activeTab === 'standard' && (
        <>
          <SummaryCards
            result={standardResult}
            currentPrice={params.currentPrice}
            dailyGrowthRate={params.dailyGrowthRate}
            monthlyTarget={params.monthlyTarget}
            temmuzTarget={params.temmuzTarget}
          />
          <div className="card">
            <div className="card-title">Standart Plan — Ay Ay Detay</div>
            <SimulationTable result={standardResult} />
          </div>
        </>
      )}

      {activeTab === 'temmuz' && (
        <>
          <SummaryCards
            result={temmuzResult}
            currentPrice={params.currentPrice}
            dailyGrowthRate={params.dailyGrowthRate}
            monthlyTarget={params.monthlyTarget}
            temmuzTarget={params.temmuzTarget}
          />
          <div className="card">
            <div className="card-title">Temmuz Özel Plan — Ay Ay Detay</div>
            <SimulationTable result={temmuzResult} />
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div className="disclaimer">
        Bu çalışma sabit günlük artış varsayımıyla oluşturulmuş bir projeksiyondur.
        Gerçek fon performansı farklı olabilir. Yatırım tavsiyesi değildir.
      </div>
    </div>
  );
};

export default App;
