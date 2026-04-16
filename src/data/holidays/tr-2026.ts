export interface HolidayEntry {
  date: string;       // YYYY-MM-DD
  name: string;
  halfDay?: boolean;  // true if it's a half-day holiday
}

/**
 * Turkey 2026 official holidays + religious holidays.
 * Half-day holidays default to closed (configurable).
 */
export const TR_HOLIDAYS_2026: HolidayEntry[] = [
  // New Year
  { date: '2026-01-01', name: 'Yılbaşı' },

  // National Sovereignty and Children's Day
  { date: '2026-04-23', name: 'Ulusal Egemenlik ve Çocuk Bayramı' },

  // Labour Day
  { date: '2026-05-01', name: 'Emek ve Dayanışma Günü' },

  // Commemoration of Atatürk, Youth and Sports Day
  { date: '2026-05-19', name: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı' },

  // Ramadan Bayram (Eid al-Fitr) 2026 - estimated dates
  { date: '2026-03-19', name: 'Ramazan Bayramı Arife', halfDay: true },
  { date: '2026-03-20', name: 'Ramazan Bayramı 1. Gün' },
  { date: '2026-03-21', name: 'Ramazan Bayramı 2. Gün' },
  { date: '2026-03-22', name: 'Ramazan Bayramı 3. Gün' },

  // Sacrifice Bayram (Eid al-Adha) 2026 - estimated dates
  { date: '2026-05-25', name: 'Kurban Bayramı Arife', halfDay: true },
  { date: '2026-05-26', name: 'Kurban Bayramı 1. Gün' },
  { date: '2026-05-27', name: 'Kurban Bayramı 2. Gün' },
  { date: '2026-05-28', name: 'Kurban Bayramı 3. Gün' },
  { date: '2026-05-29', name: 'Kurban Bayramı 4. Gün' },

  // Victory Day
  { date: '2026-08-30', name: 'Zafer Bayramı' },

  // Republic Day
  { date: '2026-10-28', name: 'Cumhuriyet Bayramı Arife', halfDay: true },
  { date: '2026-10-29', name: 'Cumhuriyet Bayramı' },

  // Democracy and National Unity Day
  { date: '2026-07-15', name: 'Demokrasi ve Millî Birlik Günü' },
];
