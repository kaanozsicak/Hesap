export type ScenarioId = 'standard' | 'temmuzOzel';

export interface ScenarioPlan {
  id: ScenarioId;
  label: string;
  description: string;
  getMonthlyTarget: (year: number, month: number) => number;
}

export function createStandardPlan(monthlyTarget: number): ScenarioPlan {
  return {
    id: 'standard',
    label: 'Standart Plan',
    description: `Her ay ${monthlyTarget.toLocaleString('tr-TR')} TL satış`,
    getMonthlyTarget: () => monthlyTarget,
  };
}

export function createTemmuzOzelPlan(
  monthlyTarget: number,
  temmuzTarget: number,
  temmuzActive: boolean
): ScenarioPlan {
  return {
    id: 'temmuzOzel',
    label: 'Temmuz Özel Plan',
    description: `Temmuz: ${temmuzTarget.toLocaleString('tr-TR')} TL, diğer aylar: ${monthlyTarget.toLocaleString('tr-TR')} TL`,
    getMonthlyTarget: (year: number, month: number) => {
      if (temmuzActive && month === 6) return temmuzTarget; // month 6 = July (0-indexed)
      return monthlyTarget;
    },
  };
}
