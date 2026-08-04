import { useEffect, useMemo, useState } from 'react'
import type { FoodEntry, HandProfile, Meal } from '../lib/types'
import { MEAL_LABELS, MEAL_ORDER, today, uid } from '../lib/types'
import {
  loadFoodLogs,
  loadHandProfile,
  saveFoodLogs,
  saveHandProfile,
} from '../lib/storage'
import { estimateFist, fistVolumeMl } from '../lib/fist'
import { FOOD_LIBRARY } from '../lib/foods'
import { fmtKcal, round } from '../lib/calories'

export default function FistPage() {
  const [hand, setHand] = useState<HandProfile | null>(() => loadHandProfile())
  const [lengthInput, setLengthInput] = useState('')
  const [foodId, setFoodId] = useState(FOOD_LIBRARY[0].id)
  const [fists, setFists] = useState(1)
  const [showMealPicker, setShowMealPicker] = useState(false)

  const food = useMemo(
    () => FOOD_LIBRARY.find((f) => f.id === foodId) ?? FOOD_LIBRARY[0],
    [foodId],
  )

  const volumeMl = hand ? fistVolumeMl(hand.palmLengthCm) : null
  const result = hand ? estimateFist(hand.palmLengthCm, food, fists) : null

  const categories = useMemo(
    () => [...new Set(FOOD_LIBRARY.map((f) => f.category))],
    [],
  )

  function saveHand() {
    const v = parseFloat(lengthInput)
    if (!Number.isFinite(v) || v <= 0 || v > 40) return
    const p: HandProfile = {
      palmLengthCm: round(v, 1),
      measureMethod: 'manual',
      updatedAt: Date.now(),
    }
    setHand(p)
    saveHandProfile(p)
    setLengthInput('')
  }

  function addToLog(meal: Meal) {
    if (!hand || !result) return
    const entry: FoodEntry = {
      id: uid(),
      date: today(),
      meal,
      name: `${fists} 拳 ${food.name}`,
      kcal: result.kcal,
      source: 'fist',
      estimate: {
        fistVolumeMl: round(volumeMl!, 1),
        foodId: food.id,
        foodName: food.name,
        grams: result.grams,
        density: food.density,
        kcalPer100g: food.kcalPer100g,
      },
      createdAt: Date.now(),
    }
    const logs = loadFoodLogs()
    const next = [...logs, entry]
    saveFoodLogs(next)
    setShowMealPicker(false)
    window.dispatchEvent(new Event('calolog:changed'))
  }

  useEffect(() => {
    const onChanged = () => {
      // 页面刷新时同步外部修改（本组件无列表，暂无操作）
    }
    window.addEventListener('calolog:changed', onChanged)
    return () => window.removeEventListener('calolog:changed', onChanged)
  }, [])

  return (
    <div className="space-y-4">
      {/* 手长设置 */}
      <section className="rounded-2xl bg-slate-800/60 p-4">
        <h2 className="mb-2 text-sm font-semibold text-white">我的拳头 👊</h2>
        {hand ? (
          <div>
            <p className="text-sm text-slate-300">
              手长 <span className="font-bold text-emerald-400">{hand.palmLengthCm} cm</span>
              {' '}→ 一拳约{' '}
              <span className="font-bold text-white">{round(volumeMl!)} ml</span>
            </p>
            <button
              onClick={() => setHand(null)}
              className="mt-2 text-xs text-slate-500 underline"
            >
              重新设置
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-xs text-slate-400">
              用尺子量手掌长度（腕线 → 中指指尖），只需一次
            </p>
            <div className="flex gap-2">
              <input
                inputMode="decimal"
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                placeholder="手掌长度（cm）"
                className="min-w-0 flex-1 rounded-lg bg-slate-700/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                onClick={saveHand}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900"
              >
                保存
              </button>
            </div>
          </div>
        )}
      </section>

      {!hand ? (
        <p className="rounded-2xl bg-slate-800/40 p-4 text-center text-xs text-slate-500">
          设置手长后即可开始一拳估算
        </p>
      ) : (
        <>
          {/* 食物选择 */}
          <section className="rounded-2xl bg-slate-800/60 p-4">
            <h2 className="mb-2 text-sm font-semibold text-white">吃什么？</h2>
            {categories.map((cat) => (
              <div key={cat} className="mb-2">
                <p className="mb-1 text-xs text-slate-500">{cat}</p>
                <div className="flex flex-wrap gap-1.5">
                  {FOOD_LIBRARY.filter((f) => f.category === cat).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFoodId(f.id)}
                      className={`rounded-full px-3 py-1 text-xs transition-colors ${
                        foodId === f.id
                          ? 'bg-emerald-500 text-slate-900'
                          : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 几拳输入 + 结果 */}
          <section className="rounded-2xl bg-slate-800/60 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">吃了几拳？</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFists((v) => Math.max(0.5, round(v - 0.5, 1)))}
                  className="h-8 w-8 rounded-lg bg-slate-700 text-lg text-white"
                >
                  −
                </button>
                <span className="w-10 text-center text-xl font-bold text-white">
                  {fists}
                </span>
                <button
                  onClick={() => setFists((v) => round(v + 0.5, 1))}
                  className="h-8 w-8 rounded-lg bg-slate-700 text-lg text-white"
                >
                  +
                </button>
              </div>
            </div>

            {result && (
              <div className="mt-3 rounded-xl bg-slate-700/40 p-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">
                      ≈ {fmtKcal(result.kcal)}
                      <span className="ml-1 text-sm text-slate-400">大卡</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {fists} 拳 {food.name} ≈ {round(result.grams)}g
                      {' · '}体积 {round(result.volumeMl)}ml
                    </p>
                  </div>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
                    估算 ±{result.confidencePct}%
                  </span>
                </div>
                <button
                  onClick={() => setShowMealPicker(true)}
                  className="mt-3 w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-900"
                >
                  ➕ 加入今日日志
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {/* 餐次选择弹层 */}
      {showMealPicker && (
        <div
          className="fixed inset-0 z-10 flex items-end justify-center bg-black/60"
          onClick={() => setShowMealPicker(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-slate-800 p-4 pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-center text-sm text-slate-300">记到哪一餐？</p>
            <div className="flex gap-2">
              {MEAL_ORDER.map((m) => (
                <button
                  key={m}
                  onClick={() => addToLog(m)}
                  className="flex-1 rounded-lg bg-slate-700 py-2.5 text-sm text-white"
                >
                  {MEAL_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
