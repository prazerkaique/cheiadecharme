import { useTimerStore } from '@/stores/timer-store'
import { PixelButton } from '@/components/ui/PixelButton'

export function PomodoroTimer() {
  const mode = useTimerStore(s => s.mode)
  const secondsLeft = useTimerStore(s => s.secondsLeft)
  const isRunning = useTimerStore(s => s.isRunning)
  const pomodoroCount = useTimerStore(s => s.pomodoroCount)
  const startTimer = useTimerStore(s => s.startTimer)
  const pauseTimer = useTimerStore(s => s.pauseTimer)
  const resumeTimer = useTimerStore(s => s.resumeTimer)
  const resetTimer = useTimerStore(s => s.resetTimer)
  const switchMode = useTimerStore(s => s.switchMode)

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const modeLabel = mode === 'work' ? 'FOCUS TIME' : mode === 'short_break' ? 'SHORT BREAK' : 'LONG BREAK'

  return (
    <div className="text-center space-y-4">
      {/* Mode tabs */}
      <div className="flex justify-center gap-2">
        {(['work', 'short_break', 'long_break'] as const).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`
              font-pixel text-[10px] px-3 py-1.5 pixel-border cursor-pointer
              ${mode === m ? 'bg-primary text-white' : 'bg-bg-dark text-text-dim'}
            `}
          >
            {m === 'work' ? 'FOCUS' : m === 'short_break' ? 'SHORT' : 'LONG'}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div>
        <p className="font-pixel text-[10px] text-text-dim mb-2">{modeLabel}</p>
        <p className={`font-pixel text-5xl pixel-text ${isRunning ? 'text-accent' : 'text-text'}`}>
          {display}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <PixelButton
            variant="accent"
            size="lg"
            onClick={() => (secondsLeft > 0 ? resumeTimer() : startTimer())}
          >
            {secondsLeft > 0 && secondsLeft < (mode === 'work' ? 1500 : 300) ? 'RESUME' : 'START'}
          </PixelButton>
        ) : (
          <PixelButton variant="secondary" size="lg" onClick={pauseTimer}>
            PAUSE
          </PixelButton>
        )}
        <PixelButton variant="ghost" size="lg" onClick={resetTimer}>
          RESET
        </PixelButton>
      </div>

      {/* Pomodoro count */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < pomodoroCount % 4 ? '' : 'opacity-30'}`}
          >
            🍅
          </span>
        ))}
        <span className="font-body text-lg text-text-dim ml-2">
          Total: {pomodoroCount}
        </span>
      </div>
    </div>
  )
}
