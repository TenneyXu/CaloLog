// 热量换算：千焦（kJ）⇄ 大卡（kcal）
// 科学标准：1 kcal = 4.184 kJ

export const KJ_PER_KCAL = 4.184

export function kjToKcal(kj: number): number {
  return kj / KJ_PER_KCAL
}

export function kcalToKj(kcal: number): number {
  return kcal * KJ_PER_KCAL
}

/** 四舍五入到指定小数位 */
export function round(v: number, digits = 0): number {
  const f = 10 ** digits
  return Math.round(v * f) / f
}

/** 显示大卡（默认整数） */
export function fmtKcal(kcal: number): string {
  return round(kcal).toLocaleString('zh-CN')
}

/** 显示千焦（默认整数） */
export function fmtKj(kj: number): string {
  return round(kj).toLocaleString('zh-CN')
}
