import { useInventoryStore } from '@/stores/inventory-store'
import { useTimerStore } from '@/stores/timer-store'
import { useNavigate, useLocation } from 'react-router-dom'

export function BottomBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const coffeeToday = useInventoryStore(s => s.coffeeToday)
  const waterToday = useInventoryStore(s => s.waterToday)
  const pomodoroCount = useTimerStore(s => s.pomodoroCount)
  const workMinutes = useTimerStore(s => s.totalWorkMinutesToday)

  const workHours = Math.floor(workMinutes / 60)
  const workMins = workMinutes % 60

  const isHome = location.pathname === '/'

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-bg-dark/90 pixel-border flex items-center justify-between px-4 py-2">
      {/* Left: Daily counters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-body text-lg">
          <span>☕</span>
          <span className="text-secondary">{coffeeToday}</span>
        </div>
        <div className="flex items-center gap-1.5 font-body text-lg">
          <span>💧</span>
          <span className="text-mana">{waterToday}</span>
        </div>
        <div className="flex items-center gap-1.5 font-body text-lg">
          <span>🍅</span>
          <span className="text-primary">{pomodoroCount}</span>
        </div>
        <div className="flex items-center gap-1.5 font-body text-lg">
          <span>⏱️</span>
          <span className="text-text-dim">
            {workHours}h{workMins.toString().padStart(2, '0')}m
          </span>
        </div>
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-2">
        {!isHome && (
          <button
            onClick={() => navigate('/')}
            className="font-pixel text-[10px] text-text-dim hover:text-secondary cursor-pointer px-3 py-1 pixel-border bg-bg-panel"
          >
            MAP
          </button>
        )}
      </div>
    </div>
  )
}
