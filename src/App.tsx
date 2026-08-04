import { useState } from 'react'
import WeightPage from './components/WeightPage'
import FoodPage from './components/FoodPage'
import FistPage from './components/FistPage'

type Tab = 'weight' | 'food' | 'fist'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'weight', label: '体重', icon: '⚖️' },
  { key: 'food', label: '热量', icon: '🔥' },
  { key: 'fist', label: '一拳', icon: '✊' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('food')

  return (
    <div className="mx-auto flex h-full max-w-md flex-col bg-slate-900">
      <header className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold tracking-wide text-white">
          Calo<span className="text-emerald-400">Log</span>
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">卡路里日志 · 简单记录</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {tab === 'weight' && <WeightPage />}
        {tab === 'food' && <FoodPage />}
        {tab === 'fist' && <FistPage />}
      </main>

      <nav className="pb-safe border-t border-slate-800 bg-slate-900">
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                tab === t.key ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
