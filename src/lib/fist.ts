// 一拳体积估算模型
//
// 核心创意：按用户手掌大小个性化估算"一拳"的体积，再乘以食物密度得到克数，
// 最终由食物热量密度换算成大卡。
//
// 模型（经验系数，后续需真实数据校准）：
//   基准：手长 18cm ≈ 一拳 320ml（成人居中经验值）
//   缩放：体积与长度立方成正比 → V = 320 × (L / 18)^3
//   食物：克数 = 体积 × 密度(g/ml)；热量 = 克数/100 × kcalPer100g

import type { FoodItem } from './types'
import { round } from './calories'

export const REF_PALM_LENGTH = 18 // cm
export const REF_FIST_VOLUME = 320 // ml

export function fistVolumeMl(palmLengthCm: number): number {
  const r = palmLengthCm / REF_PALM_LENGTH
  return REF_FIST_VOLUME * r * r * r
}

export interface FistEstimateResult {
  volumeMl: number
  grams: number
  kcal: number
  /** 置信区间（±%），模型为经验估算，误差管理用户预期 */
  confidencePct: number
}

export function estimateFist(
  palmLengthCm: number,
  food: FoodItem,
  fists: number,
): FistEstimateResult {
  const volumeMl = fistVolumeMl(palmLengthCm) * fists
  const grams = volumeMl * food.density
  const kcal = (grams / 100) * food.kcalPer100g
  return {
    volumeMl: round(volumeMl, 1),
    grams: round(grams, 1),
    kcal: round(kcal),
    confidencePct: 30, // 经验估算，±30%
  }
}
