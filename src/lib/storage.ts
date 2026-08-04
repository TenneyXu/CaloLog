// localStorage 持久化封装（V1 本地存储）

import type { BodyLog, FoodEntry, HandProfile } from './types'

const KEY = {
  body: 'calolog:bodyLogs',
  food: 'calolog:foodLogs',
  hand: 'calolog:handProfile',
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    // 通知其他页面组件重新加载（跨 Tab 同步）
    window.dispatchEvent(new Event('calolog:changed'))
  } catch {
    // 存储满或不可用时静默失败（本地版可接受）
  }
}

export function loadBodyLogs(): BodyLog[] {
  return read<BodyLog[]>(KEY.body, [])
}

export function saveBodyLogs(logs: BodyLog[]): void {
  write(KEY.body, logs)
}

export function loadFoodLogs(): FoodEntry[] {
  return read<FoodEntry[]>(KEY.food, [])
}

export function saveFoodLogs(logs: FoodEntry[]): void {
  write(KEY.food, logs)
}

export function loadHandProfile(): HandProfile | null {
  return read<HandProfile | null>(KEY.hand, null)
}

export function saveHandProfile(p: HandProfile): void {
  write(KEY.hand, p)
}
