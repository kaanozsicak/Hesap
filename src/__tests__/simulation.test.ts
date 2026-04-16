import { describe, it, expect } from 'vitest';
import {
  runMonthlyLiquidationSimulation,
  compareScenarioResults,
  SimulationParams,
} from '../lib/simulation';
import { createStandardPlan, createTemmuzOzelPlan } from '../lib/scenarioPlans';
import { DEFAULT_CONFIG } from '../lib/tradingCalendar';

const REF_DATE = new Date(2026, 3, 16); // April 16, 2026

function makeStandardParams(): SimulationParams {
  return {
    startingLots: 1800,
    currentPrice: 5030.56,
    dailyGrowthRate: 0.005885,
    referenceDate: REF_DATE,
    sellDayStrategy: 'last',
    calendarConfig: DEFAULT_CONFIG,
    scenarioPlan: createStandardPlan(180_000),
  };
}

function makeTemmuzParams(): SimulationParams {
  return {
    startingLots: 1800,
    currentPrice: 5030.56,
    dailyGrowthRate: 0.005885,
    referenceDate: REF_DATE,
    sellDayStrategy: 'last',
    calendarConfig: DEFAULT_CONFIG,
    scenarioPlan: createTemmuzOzelPlan(180_000, 2_000_000, true),
  };
}

describe('simulation engine', () => {
  // 3. Daily compound growth formula
  it('applies geometric growth correctly', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    // First month (May) should have a higher price than starting price
    expect(result.months[0].sellDayPrice).toBeGreaterThan(5030.56);
  });

  // 4 + 5. Sold lots and remaining lots are always integers
  it('sold lots are always integers', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    for (const m of result.months) {
      expect(Number.isInteger(m.soldLots)).toBe(true);
    }
  });

  it('remaining lots are always integers', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    for (const m of result.months) {
      expect(Number.isInteger(m.remainingLots)).toBe(true);
    }
  });

  // 6. Floor rounding for lot calculation
  it('uses floor rounding for lot calculation', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    for (const m of result.months) {
      if (m.soldLots > 0) {
        const rawLots = m.targetSellValue / m.sellDayPrice;
        expect(m.soldLots).toBeLessThanOrEqual(rawLots);
        expect(m.soldLots).toBe(Math.floor(rawLots));
      }
    }
  });

  // 7. When lots run out, subsequent months have 0 sales
  it('stops selling when lots run out', () => {
    // Use a very high sell target to exhaust lots quickly
    const params = makeStandardParams();
    params.scenarioPlan = createStandardPlan(50_000_000); // should exhaust lots fast
    const result = runMonthlyLiquidationSimulation(params);
    
    let exhausted = false;
    for (const m of result.months) {
      if (exhausted) {
        expect(m.soldLots).toBe(0);
      }
      if (m.remainingLots === 0) {
        exhausted = true;
      }
    }
  });

  // 8. Reference month is considered completed, simulation starts next month
  it('reference month has no sale - simulation starts next month', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    // Reference is April (month 3), so no month 3 in results
    expect(result.months.find(m => m.month === 3)).toBeUndefined();
  });

  // 9. First planned sale month is May 2026
  it('first planned sale month is May 2026', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    expect(result.firstSaleMonth.year).toBe(2026);
    expect(result.firstSaleMonth.month).toBe(4); // 0-indexed, May = 4
  });

  // 10. Scenario 1: every month 180000
  it('standard scenario applies 180000 every month', () => {
    const result = runMonthlyLiquidationSimulation(makeStandardParams());
    for (const m of result.months) {
      expect(m.targetSellValue).toBe(180_000);
    }
  });

  // 11. Scenario 2: July has 2000000
  it('temmuz scenario applies 2000000 in July', () => {
    const result = runMonthlyLiquidationSimulation(makeTemmuzParams());
    const july = result.months.find(m => m.month === 6);
    expect(july).toBeDefined();
    expect(july!.targetSellValue).toBe(2_000_000);
  });

  // 12. Scenario 2: non-July months have 180000
  it('temmuz scenario applies 180000 in non-July months', () => {
    const result = runMonthlyLiquidationSimulation(makeTemmuzParams());
    for (const m of result.months) {
      if (m.month !== 6) {
        expect(m.targetSellValue).toBe(180_000);
      }
    }
  });

  // 13. Both scenarios start with same lots
  it('both scenarios start with 1800 lots', () => {
    const r1 = runMonthlyLiquidationSimulation(makeStandardParams());
    const r2 = runMonthlyLiquidationSimulation(makeTemmuzParams());
    expect(r1.startingLots).toBe(1800);
    expect(r2.startingLots).toBe(1800);
  });

  // 14. Comparison summary produces correct differences
  it('comparison produces correct differences', () => {
    const r1 = runMonthlyLiquidationSimulation(makeStandardParams());
    const r2 = runMonthlyLiquidationSimulation(makeTemmuzParams());
    const comparison = compareScenarioResults(r1, r2);
    
    expect(comparison.lotDifference).toBe(r2.yearEndLots - r1.yearEndLots);
    expect(comparison.valueDifference).toBeCloseTo(r2.yearEndValue - r1.yearEndValue, 0);
    expect(comparison.temmuzImpactLots).toBe(Math.abs(comparison.lotDifference));
  });

  // Year-end lots should be non-negative
  it('year-end lots are non-negative', () => {
    const r1 = runMonthlyLiquidationSimulation(makeStandardParams());
    const r2 = runMonthlyLiquidationSimulation(makeTemmuzParams());
    expect(r1.yearEndLots).toBeGreaterThanOrEqual(0);
    expect(r2.yearEndLots).toBeGreaterThanOrEqual(0);
  });

  // Starting lots integrity check 
  it('starting lots minus total sold equals year-end lots', () => {
    const r1 = runMonthlyLiquidationSimulation(makeStandardParams());
    expect(r1.yearEndLots).toBe(r1.startingLots - r1.totalSoldLots);
  });
});
