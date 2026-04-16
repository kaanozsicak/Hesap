const trFormatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const trFormatterInt = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const trPercent = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export function formatTL(value: number): string {
  return trFormatter.format(value) + ' TL';
}

export function formatLot(value: number): string {
  return trFormatterInt.format(Math.round(value));
}

export function formatPercent(value: number): string {
  return '%' + trPercent.format(value * 100);
}

export function formatNumber(value: number, decimals: number = 2): string {
  const f = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return f.format(value);
}

const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES_TR[month]} ${year}`;
}

export function getMonthName(month: number): string {
  return MONTH_NAMES_TR[month];
}
