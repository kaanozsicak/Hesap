import { HolidayEntry, TR_HOLIDAYS_2026 } from '../data/holidays/tr-2026';

export interface TradingCalendarConfig {
  halfDaysClosed: boolean;
  holidays: HolidayEntry[];
}

export const DEFAULT_CONFIG: TradingCalendarConfig = {
  halfDaysClosed: true,
  holidays: TR_HOLIDAYS_2026,
};

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isHoliday(date: Date, config: TradingCalendarConfig = DEFAULT_CONFIG): boolean {
  const dateStr = toDateStr(date);
  return config.holidays.some(h => {
    if (h.date !== dateStr) return false;
    if (h.halfDay && !config.halfDaysClosed) return false;
    return true;
  });
}

export function isTradingDay(date: Date, config: TradingCalendarConfig = DEFAULT_CONFIG): boolean {
  if (isWeekend(date)) return false;
  if (isHoliday(date, config)) return false;
  return true;
}

export function getMonthTradingDays(year: number, month: number, config: TradingCalendarConfig = DEFAULT_CONFIG): Date[] {
  const days: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (isTradingDay(date, config)) {
      days.push(date);
    }
  }
  return days;
}

export type SellDayStrategy = 'first' | 'last';

export function getSellDateForMonth(
  year: number,
  month: number,
  strategy: SellDayStrategy,
  config: TradingCalendarConfig = DEFAULT_CONFIG
): Date | null {
  const tradingDays = getMonthTradingDays(year, month, config);
  if (tradingDays.length === 0) return null;
  return strategy === 'first' ? tradingDays[0] : tradingDays[tradingDays.length - 1];
}

/** Count trading days between two dates (inclusive of start, exclusive of end) */
export function countTradingDaysBetween(
  start: Date,
  end: Date,
  config: TradingCalendarConfig = DEFAULT_CONFIG
): number {
  let count = 0;
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (current < endNorm) {
    if (isTradingDay(current, config)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/** Count trading days from a date to end of month (inclusive of date) */
export function tradingDaysFromDateToEndOfMonth(
  date: Date,
  config: TradingCalendarConfig = DEFAULT_CONFIG
): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const endExclusive = new Date(year, month + 1, 1);
  return countTradingDaysBetween(date, endExclusive, config);
}
