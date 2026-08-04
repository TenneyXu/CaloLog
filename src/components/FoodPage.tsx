import { useEffect, useMemo, useState } from 'react'
import type { FoodEntry, Meal } from '../lib/types'
import { MEAL_LABELS, MEAL_ORDER, today, uid } from '../lib/types'
import { loadFoodLogs, saveFoodLogs } from '../lib/storage'
import { kjToKcal, round, fmtKcal } from '../lib/calories'

type UnitMode = 'kcal' | 'kj'

export default function FoodPage() {
  const [logs, setLogs] = useState<FoodEntry[]>(() => loadFoodLogs())
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [unitMode, setUnitMode] = useState<UnitMode>('kcal')
  const [meal, setMeal] = useState<Meal>('breakfast')
  const [selectedDate, setSelectedDate] = useState(today())

  const dayLogs = useMemo(
    () =>
      logs
        .filter((l) => l.date === selectedDate)
        .sort((a, b) => a.createdAt - b.createdAt),
    [logs, selectedDate],
  )

  const dayKcal = useMemo(
    () => dayLogs.reduce((sum, l) => sum + l.kcal, 0),
    [dayLogs],
  )

  // 跨页面同步：一拳页等写入后重新加载
  useEffect(() => {
    const onChanged = () => setLogs(loadFoodLogs())
    window.addEventListener('calolog:changed', onChanged)
    return () => window.removeEventListener('calolog:changed', onChanged)
  }, [])

  // 实时换算预览
  const parsed = parseFloat(amount)
  const previewKcal = Number.isFinite(parsed) && parsed > 0 ? kjToKcal(parsed) : null

  function add() {
    const n = name.trim()
    const v = parseFloat(amount)
    if (!n || !Number.isFinite(v) || v <= 0) return
    const kcal = unitMode === 'kcal' ? v : kjToKcal(v)
    const entry: FoodEntry = {
      id: uid(),
      date: selectedDate,
      meal,
      name: n,
      kcal: round(kcal),
      source: 'manual',
      inputKj: unitMode === 'kj' ? v : undefined,
      createdAt: Date.now(),
    }
    const next = [...logs, entry]
    setLogs(next)
    saveFoodLogs(next)
    setName('')
    setAmount('')
  }

  function remove(id: string) {
    const next = logs.filter((l) => l.id !== id)
    setLogs(next)
    saveFoodLogs(next)
  }

  return (
    <div className="space-y-4">
      {/* 今日合计 */}
      <section className="rounded-2xl bg-slate-800/60 p-4 text-center">
        <p className="text-xs text-slate-400">{selectedDate} 摄入</p>
        <p className="mt-1 text-4xl font-bold text-emerald-400">
          {fmtKcal(dayKcal)}
        </p>
        <p className="text-xs text-slate-500">大卡（kcal）</p>
      </section>

      {/* 添加记录 */}
      <section className="rounded-2xl bg-slate-800/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg bg-slate-700/60 px-2 py-1.5 text-xs text-slate-300 focus:outline-none"
          />
          <div className="ml-auto flex gap-1 rounded-lg bg-slate-700/60 p-1">
            {(['kcal', 'kj'] as UnitMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setUnitMode(m)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  unitMode === m ? 'bg-emerald-500 text-slate-900' : 'text-slate-400'
                }`}
              >
                {m === 'kcal' ? '大卡' : '千焦'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="食物名称（如：一碗米饭）"
            className="min-w-0 flex-1 rounded-lg bg-slate-700/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <div className="relative w-28 shrink-0">
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={unitMode === 'kcal' ? '大卡' : '千焦'}
              className="w-full rounded-lg bg-slate-700/60 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-500">
              {unitMode}
            </span>
          </div>
        </div>

        {previewKcal !== null && unitMode === 'kj' && (
          <p className="mt-2 text-xs text-emerald-400">
            ≈ {fmtKcal(previewKcal)} 大卡
          </p>
        )}

        <div className="mt-3 flex gap-2">
          {MEAL_ORDER.map((m) => (
            <button
              key={m}
              onClick={() => setMeal(m)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                meal === m ? 'bg-slate-600 text-white' : 'bg-slate-700/60 text-slate-400'
              }`}
            >
              {MEAL_LABELS[m]}
            </button>
          ))}
          <button
            onClick={add}
            className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-slate-900"
          >
            添加
          </button>
        </div>
      </section>

      {/* 当日明细 */}
      <section className="rounded-2xl bg-slate-800/60 p-4">
        <h2 className="mb-2 text-xs font-semibold text-slate-400">当日明细</h2>
        {dayLogs.length === 0 ? (
          <p className="py-3 text-center text-xs text-slate-500">今天还没有记录</p>
        ) : (
          <ul className="divide-y divide-slate-700/50">
            {dayLogs.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{l.name}</p>
                  <p className="text-xs text-slate-500">
                    {MEAL_LABELS[l.meal]}
                    {l.estimate && ' · ✊ 一拳估算'}
                    {l.inputKj !== undefined && ` · 原始 ${round(l.inputKj)} kJ`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-400">
                    {fmtKcal(l.kcal)} kcal
                  </span>
                  <button
                    onClick={() => remove(l.id)}
                    className="text-xs text-slate-600 hover:text-rose-400"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
