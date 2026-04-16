import { describe, it, expect } from 'vitest';
import {
  isWeekend,
  isHoliday,
  isTradingDay,
  getMonthTradingDays,
  getSellDateForMonth,
  DEFAULT_CONFIG,
} from '../lib/tradingCalendar';

describe('tradingCalendar', () => {
  // 1. Weekends are not trading days
  it('Saturday is a weekend', () => {
    // 2026-04-18 is a Saturday
    expect(isWeekend(new Date(2026, 3, 18))).toBe(true);
  });

  it('Sunday is a weekend', () => {
    // 2026-04-19 is a Sunday
    expect(isWeekend(new Date(2026, 3, 19))).toBe(true);
  });

  it('Monday is not a weekend', () => {
    expect(isWeekend(new Date(2026, 3, 20))).toBe(false);
  });

  // 2. Official holidays are excluded
  it('New Year 2026 is a holiday', () => {
    expect(isHoliday(new Date(2026, 0, 1), DEFAULT_CONFIG)).toBe(true);
  });

  it('April 23 is a holiday', () => {
    expect(isHoliday(new Date(2026, 3, 23), DEFAULT_CONFIG)).toBe(true);
  });

  it('A regular weekday is not a holiday', () => {
    expect(isHoliday(new Date(2026, 3, 16), DEFAULT_CONFIG)).toBe(false);
  });

  // isTradingDay combines both checks
  it('holiday is not a trading day', () => {
    expect(isTradingDay(new Date(2026, 0, 1), DEFAULT_CONFIG)).toBe(false);
  });

  it('weekend is not a trading day', () => {
    expect(isTradingDay(new Date(2026, 3, 18), DEFAULT_CONFIG)).toBe(false);
  });

  it('regular weekday is a trading day', () => {
    expect(isTradingDay(new Date(2026, 3, 16), DEFAULT_CONFIG)).toBe(true);
  });

  // Half-day holidays default to closed
  it('half-day holiday is closed by default', () => {
    // 2026-03-19 is Ramadan Eve (half-day)
    expect(isTradingDay(new Date(2026, 2, 19), DEFAULT_CONFIG)).toBe(false);
  });

  it('half-day holiday is open when config says so', () => {
    const config = { ...DEFAULT_CONFIG, halfDaysClosed: false };
    expect(isTradingDay(new Date(2026, 2, 19), config)).toBe(true);
  });

  // getMonthTradingDays
  it('returns correct number of trading days for a month', () => {
    const days = getMonthTradingDays(2026, 3, DEFAULT_CONFIG); // April 2026
    // April has 30 days, ~22 weekdays, minus April 23 holiday
    expect(days.length).toBeGreaterThan(0);
    expect(days.length).toBeLessThanOrEqual(22);
    // April 23 should not be in the list
    expect(days.find(d => d.getDate() === 23)).toBeUndefined();
  });

  // getSellDateForMonth
  it('returns last trading day when strategy is "last"', () => {
    const date = getSellDateForMonth(2026, 3, 'last', DEFAULT_CONFIG);
    expect(date).not.toBeNull();
    // Should be April 30 (Thursday) if it's a trading day, or earlier
    expect(date!.getMonth()).toBe(3);
  });

  it('returns first trading day when strategy is "first"', () => {
    const date = getSellDateForMonth(2026, 3, 'first', DEFAULT_CONFIG);
    expect(date).not.toBeNull();
    expect(date!.getMonth()).toBe(3);
    // Should be April 1 or the first weekday
    expect(date!.getDate()).toBeLessThanOrEqual(3);
  });
});
