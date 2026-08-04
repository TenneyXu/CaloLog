// 内置常见食物库（V1 初始版）
// 数据为常见估算值：密度 g/ml + 热量 kcal/100g（可食部分）
// 后续可扩充至 20–50 个，或接入数据库/扫码

import type { FoodItem } from './types'

export const FOOD_LIBRARY: FoodItem[] = [
  // —— 主食 ——
  { id: 'mantou', name: '馒头', density: 0.5, kcalPer100g: 223, category: '主食' },
  { id: 'rice', name: '米饭（熟）', density: 0.85, kcalPer100g: 116, category: '主食' },
  { id: 'noodle', name: '面条（熟）', density: 0.7, kcalPer100g: 110, category: '主食' },
  { id: 'bread', name: '面包（切片）', density: 0.3, kcalPer100g: 265, category: '主食' },
  { id: 'bun', name: '包子', density: 0.55, kcalPer100g: 227, category: '主食' },
  { id: 'dumpling', name: '饺子', density: 0.9, kcalPer100g: 200, category: '主食' },
  { id: 'congee', name: '白粥', density: 1.0, kcalPer100g: 47, category: '主食' },
  { id: 'potato', name: '土豆', density: 1.0, kcalPer100g: 77, category: '主食' },
  { id: 'sweetpotato', name: '红薯', density: 0.9, kcalPer100g: 90, category: '主食' },

  // —— 蛋白质 ——
  { id: 'egg', name: '鸡蛋（煮）', density: 1.1, kcalPer100g: 143, category: '蛋白质' },
  { id: 'chicken', name: '鸡胸肉', density: 1.05, kcalPer100g: 133, category: '蛋白质' },
  { id: 'beef', name: '瘦牛肉', density: 1.05, kcalPer100g: 143, category: '蛋白质' },
  { id: 'pork', name: '瘦猪肉', density: 1.0, kcalPer100g: 143, category: '蛋白质' },
  { id: 'fish', name: '鱼肉（清蒸）', density: 1.0, kcalPer100g: 105, category: '蛋白质' },
  { id: 'shrimp', name: '虾仁', density: 1.0, kcalPer100g: 99, category: '蛋白质' },
  { id: 'tofu', name: '豆腐', density: 1.0, kcalPer100g: 76, category: '蛋白质' },
  { id: 'milk', name: '牛奶（全脂）', density: 1.03, kcalPer100g: 60, category: '蛋白质' },

  // —— 蔬菜水果 ——
  { id: 'broccoli', name: '西兰花', density: 0.7, kcalPer100g: 34, category: '蔬果' },
  { id: 'tomato', name: '番茄', density: 0.95, kcalPer100g: 18, category: '蔬果' },
  { id: 'cucumber', name: '黄瓜', density: 0.9, kcalPer100g: 15, category: '蔬果' },
  { id: 'apple', name: '苹果', density: 0.75, kcalPer100g: 52, category: '蔬果' },
  { id: 'banana', name: '香蕉', density: 0.9, kcalPer100g: 89, category: '蔬果' },
  { id: 'orange', name: '橙子', density: 0.8, kcalPer100g: 47, category: '蔬果' },
  { id: 'grape', name: '葡萄', density: 1.0, kcalPer100g: 69, category: '蔬果' },
  { id: 'watermelon', name: '西瓜', density: 0.95, kcalPer100g: 30, category: '蔬果' },

  // —— 零食饮品 ——
  { id: 'cola', name: '可乐', density: 1.04, kcalPer100g: 42, category: '零食饮品' },
  { id: 'chips', name: '薯片', density: 0.4, kcalPer100g: 530, category: '零食饮品' },
  { id: 'chocolate', name: '巧克力', density: 1.2, kcalPer100g: 550, category: '零食饮品' },
  { id: 'peanut', name: '花生（炒）', density: 0.6, kcalPer100g: 570, category: '零食饮品' },
  { id: 'icecream', name: '冰淇淋', density: 0.9, kcalPer100g: 207, category: '零食饮品' },
]

export function foodById(id: string): FoodItem | undefined {
  return FOOD_LIBRARY.find((f) => f.id === id)
}
