import {
  TradingCalendarConfig,
  DEFAULT_CONFIG,
  getMonthTradingDays,
  getSellDateForMonth,
  isTradingDay,
  SellDayStrategy,
  countTradingDaysBetween,
} from './tradingCalendar';
import { ScenarioPlan } from './scenarioPlans';

export interface SimulationParams {
  startingLots: number;
  currentPrice: number;
  dailyGrowthRate: number;      // e.g. 0.005885
  referenceDate: Date;
  sellDayStrategy: SellDayStrategy;
  calendarConfig: TradingCalendarConfig;
  scenarioPlan: ScenarioPlan;
}

export interface MonthResult {
  year: number;
  month: number;                 // 0-indexed
  tradingDayCount: number;
  targetSellValue: number;
  sellDayPrice: number;
  endOfMonthPrice: number;
  soldLots: number;
  soldValue: number;
  remainingLots: number;
  remainingValue: number;
}

export interface SimulationResult {
  scenarioId: string;
  scenarioLabel: string;
  months: MonthResult[];
  totalSoldLots: number;
  totalSoldValue: number;
  yearEndLots: number;
  yearEndValue: number;
  yearEndPrice: number;
  firstSaleMonth: { year: number; month: number };
  startingLots: number;
}

export interface ComparisonResult {
  lotDifference: number;          // scenario2.yearEndLots - scenario1.yearEndLots
  valueDifference: number;        // scenario2.yearEndValue - scenario1.yearEndValue
  moreLotScenario: string;
  moreValueScenario: string;
  temmuzImpactLots: number;
  temmuzImpactValue: number;
}

/**
 * Project price from a given date to a target date using geometric daily growth.
 * Only trading days cause price increases.
 */
export function projectPrice(
  startPrice: number,
  startDate: Date,
  targetDate: Date,
  dailyGrowthRate: number,
  config: TradingCalendarConfig = DEFAULT_CONFIG
): number {
  const tradingDays = countTradingDaysBetween(startDate, targetDate, config);
  return startPrice * Math.pow(1 + dailyGrowthRate, tradingDays);
}

/**
 * Get the price on a specific date, given a reference price and date.
 */
function getPriceOnDate(
  referencePrice: number,
  referenceDate: Date,
  targetDate: Date,
  dailyGrowthRate: number,
  config: TradingCalendarConfig
): number {
  // If target is same day or before reference, return reference price
  const refNorm = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const targetNorm = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  if (targetNorm <= refNorm) return referencePrice;
  return projectPrice(referencePrice, refNorm, targetNorm, dailyGrowthRate, config);
}

/**
 * Run the monthly liquidation simulation for one scenario.
 */
export function runMonthlyLiquidationSimulation(params: SimulationParams): SimulationResult {
  const {
    startingLots,
    currentPrice,
    dailyGrowthRate,
    referenceDate,
    sellDayStrategy,
    calendarConfig,
    scenarioPlan,
  } = params;

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  // First sale month is the month after the reference month
  const firstSaleMonth = refMonth + 1;
  // Simulate through end of reference year (December)
  const lastMonth = 11;

  let remainingLots = startingLots;
  const months: MonthResult[] = [];
  const refDateNorm = new Date(refYear, refMonth, referenceDate.getDate());

  for (let m = firstSaleMonth; m <= lastMonth; m++) {
    const tradingDays = getMonthTradingDays(refYear, m, calendarConfig);
    const tradingDayCount = tradingDays.length;

    const sellDate = getSellDateForMonth(refYear, m, sellDayStrategy, calendarConfig);
    const lastTradingDay = tradingDays.length > 0 ? tradingDays[tradingDays.length - 1] : null;

    // Price on the sell day
    const sellDayPrice = sellDate
      ? getPriceOnDate(currentPrice, refDateNorm, sellDate, dailyGrowthRate, calendarConfig)
      : currentPrice;

    // end-of-month price: price at end of last trading day of the month
    const endOfMonthDate = lastTradingDay
      ? new Date(lastTradingDay.getFullYear(), lastTradingDay.getMonth(), lastTradingDay.getDate() + 1)
      : sellDate
        ? new Date(sellDate.getFullYear(), sellDate.getMonth(), sellDate.getDate() + 1)
        : new Date(refYear, m + 1, 1);
    
    // Price at end of month = price after last trading day
    const endOfMonthPrice = lastTradingDay
      ? getPriceOnDate(currentPrice, refDateNorm, new Date(lastTradingDay.getFullYear(), lastTradingDay.getMonth(), lastTradingDay.getDate() + 1), dailyGrowthRate, calendarConfig)
      : sellDayPrice;

    // Monthly target
    const targetSellValue = scenarioPlan.getMonthlyTarget(refYear, m);

    // Calculate lots to sell
    let soldLots = 0;
    let soldValue = 0;

    if (sellDate && remainingLots > 0 && sellDayPrice > 0) {
      const rawLots = targetSellValue / sellDayPrice;
      soldLots = Math.min(remainingLots, Math.floor(rawLots));
      soldValue = soldLots * sellDayPrice;
    }

    remainingLots = remainingLots - soldLots;
    const remainingValue = remainingLots * endOfMonthPrice;

    months.push({
      year: refYear,
      month: m,
      tradingDayCount,
      targetSellValue,
      sellDayPrice,
      endOfMonthPrice,
      soldLots,
      soldValue,
      remainingLots,
      remainingValue,
    });
  }

  const totalSoldLots = months.reduce((sum, m) => sum + m.soldLots, 0);
  const totalSoldValue = months.reduce((sum, m) => sum + m.soldValue, 0);
  const lastMonthResult = months[months.length - 1];
  const yearEndLots = lastMonthResult ? lastMonthResult.remainingLots : startingLots;
  const yearEndPrice = lastMonthResult ? lastMonthResult.endOfMonthPrice : currentPrice;
  const yearEndValue = yearEndLots * yearEndPrice;

  return {
    scenarioId: scenarioPlan.id,
    scenarioLabel: scenarioPlan.label,
    months,
    totalSoldLots,
    totalSoldValue,
    yearEndLots,
    yearEndValue,
    yearEndPrice,
    firstSaleMonth: { year: refYear, month: firstSaleMonth },
    startingLots,
  };
}

/**
 * Compare two scenario results.
 */
export function compareScenarioResults(
  result1: SimulationResult,
  result2: SimulationResult
): ComparisonResult {
  const lotDiff = result2.yearEndLots - result1.yearEndLots;
  const valueDiff = result2.yearEndValue - result1.yearEndValue;

  return {
    lotDifference: lotDiff,
    valueDifference: valueDiff,
    moreLotScenario: lotDiff > 0 ? result2.scenarioLabel : lotDiff < 0 ? result1.scenarioLabel : 'Eşit',
    moreValueScenario: valueDiff > 0 ? result2.scenarioLabel : valueDiff < 0 ? result1.scenarioLabel : 'Eşit',
    temmuzImpactLots: Math.abs(lotDiff),
    temmuzImpactValue: Math.abs(valueDiff),
  };
}
