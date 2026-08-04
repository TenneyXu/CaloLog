// CaloLog 数据模型（V1 本地版）

export type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface BodyLog {
  id: string
  date: string // YYYY-MM-DD
  type: 'weight' | 'bodyFat' | 'glucose'
  value: number
  note?: string
  createdAt: number
}

export interface FistEstimate {
  fistVolumeMl: number
  foodId: string
  foodName: string
  grams: number
  density: number // g/ml
  kcalPer100g: number // kcal/100g
}

export interface FoodEntry {
  id: string
  date: string // YYYY-MM-DD
  meal: Meal
  name: string
  kcal: number // 统一以大卡存储
  source: 'manual' | 'fist' | 'favorite'
  inputKj?: number // 如果用户按 kJ 输入，保留原始值
  estimate?: FistEstimate
  createdAt: number
}

export interface HandProfile {
  palmLengthCm: number
  measureMethod: 'manual' | 'touch'
  updatedAt: number
}

export interface FoodItem {
  id: string
  name: string
  density: number // g/ml
  kcalPer100g: number // kcal/100g
  category: string
}

export const MEAL_LABELS: Record<Meal, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
}

export const MEAL_ORDER: Meal[] = ['breakfast', 'lunch', 'dinner', 'snack']

export function today(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
