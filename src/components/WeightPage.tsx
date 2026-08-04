import { useEffect, useMemo, useState } from 'react'
import type { BodyLog } from '../lib/types'
import { loadBodyLogs, saveBodyLogs } from '../lib/storage'
import { today, uid } from '../lib/types'
import { round } from '../lib/calories'

type BodyType = 'weight' | 'bodyFat' | 'glucose'

const TYPE_META: { key: BodyType; label: string; unit: string; color: string }[] = [
  { key: 'weight', label: '体重', unit: 'kg', color: 'text-sky-400' },
  { key: 'bodyFat', label: '体脂率', unit: '%', color: 'text-amber-400' },
  { key: 'glucose', label: '血糖', unit: 'mmol/L', color: 'text-rose-400' },
]

function TrendChart({ logs }: { logs: BodyLog[] }) {
  const weightLogs = useMemo(
    () =>
      logs
        .filter((l) => l.type === 'weight')
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14),
    [logs],
  )

  if (weightLogs.length < 2) {
    return (
      <p className="py-6 text-center text-xs text-slate-500">
        记录至少 2 次体重后显示趋势
      </p>
    )
  }

  const values = weightLogs.map((l) => l.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const W = 300
  const H = 90
  const pts = weightLogs.map((l, i) => {
    const x = (i / (weightLogs.length - 1)) * W
    const y = H - ((l.value - min) / span) * (H - 12) - 6
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return (
    <div className="mt-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => {
          const [x, y] = p.split(',').map(Number)
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#0ea5e9" />
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{weightLogs[0].date.slice(5)}</span>
        <span>{weightLogs[weightLogs.length - 1].date.slice(5)}</span>
      </div>
    </div>
  )
}

export default function WeightPage() {
  const [logs, setLogs] = useState<BodyLog[]>(() => loadBodyLogs())
  const [type, setType] = useState<BodyType>('weight')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(today())
  const [note, setNote] = useState('')

  const sorted = useMemo(
    () => [...logs].sort((a, b) => b.createdAt - a.createdAt),
    [logs],
  )
  const latest = sorted[0]
  const meta = TYPE_META.find((m) => m.key === type)!

  // 跨页面同步：数据变更后重新加载
  useEffect(() => {
    const onChanged = () => setLogs(loadBodyLogs())
    window.addEventListener('calolog:changed', onChanged)
    return () => window.removeEventListener('calolog:changed', onChanged)
  }, [])

  function add() {
    const v = parseFloat(value)
    if (!Number.isFinite(v) || v <= 0) return
    const entry: BodyLog = {
      id: uid(),
      date,
      type,
      value: round(v, 1),
      note: note.trim() || undefined,
      createdAt: Date.now(),
    }
    const next = [...logs, entry]
    setLogs(next)
    saveBodyLogs(next)
    setValue('')
    setNote('')
  }

  function remove(id: string) {
    const next = logs.filter((l) => l.id !== id)
    setLogs(next)
    saveBodyLogs(next)
  }

  return (
    <div className="space-y-4">
      {/* 最近一次 */}
      <section className="rounded-2xl bg-slate-800/60 p-4">
        <p className="text-xs text-slate-400">最近一次</p>
        {latest ? (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{latest.value}</span>
            <span className="text-sm text-slate-400">
              {TYPE_META.find((m) => m.key === latest.type)?.unit}
              {' · '}
              {latest.date}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-sm text-slate-500">还没有记录</p>
        )}
        <TrendChart logs={logs} />
      </section>

      {/* 添加表单 */}
      <section className="rounded-2xl bg-slate-800/60 p-4">
        <div className="mb-3 flex gap-2">
          {TYPE_META.map((m) => (
            <button
              key={m.key}
              onClick={() => setType(m.key)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                type === m.key
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-700/60 text-slate-400'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`数值（${meta.unit}）`}
            className="min-w-0 flex-1 rounded-lg bg-slate-700/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg bg-slate-700/60 px-2 py-2 text-sm text-slate-300 focus:outline-none"
          />
          <button
            onClick={add}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            添加
          </button>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="备注（可选）"
          className="mt-2 w-full rounded-lg bg-slate-700/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
      </section>

      {/* 历史列表 */}
      <section className="rounded-2xl bg-slate-800/60 p-4">
        <h2 className="mb-2 text-xs font-semibold text-slate-400">历史记录</h2>
        {sorted.length === 0 ? (
          <p className="py-3 text-center text-xs text-slate-500">暂无记录</p>
        ) : (
          <ul className="divide-y divide-slate-700/50">
            {sorted.slice(0, 30).map((l) => {
              const m = TYPE_META.find((x) => x.key === l.type)!
              return (
                <li key={l.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={m.color}>{m.label}</span>
                    <span className="font-medium text-white">
                      {l.value}
                      <span className="ml-0.5 text-xs text-slate-400">{m.unit}</span>
                    </span>
                    {l.note && (
                      <span className="max-w-32 truncate text-xs text-slate-500">
                        {l.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{l.date}</span>
                    <button
                      onClick={() => remove(l.id)}
                      className="text-xs text-slate-600 hover:text-rose-400"
                    >
                      删除
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
