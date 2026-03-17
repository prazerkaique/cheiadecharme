import { CoffeeTracker } from '@/components/tracker/CoffeeTracker'
import { PomodoroTimer } from '@/components/timer/PomodoroTimer'
import { PixelPanel } from '@/components/ui/PixelPanel'

export function CoffeeShopPage() {
  return (
    <div className="h-full overflow-y-auto p-6 pt-20 pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <PixelPanel accent>
          <CoffeeTracker />
        </PixelPanel>

        <PixelPanel title="FOCUS TIMER">
          <PomodoroTimer />
        </PixelPanel>
      </div>
    </div>
  )
}
