import { useGameStore } from '@/stores/game-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimerStore } from '@/stores/timer-store'
import { useInventoryStore } from '@/stores/inventory-store'
import { PixelPanel } from '@/components/ui/PixelPanel'
import { CoffeeTracker } from '@/components/tracker/CoffeeTracker'
import { PomodoroTimer } from '@/components/timer/PomodoroTimer'
import { STAT_LABELS, STAT_COLORS } from '@/config/constants'
import type { StatName } from '@/types/game'

const STATS: StatName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function TavernPage() {
  const character = useGameStore(s => s.character)
  const quests = useQuestStore(s => s.quests)
  const projects = useQuestStore(s => s.projects)
  const pomodoroCount = useTimerStore(s => s.pomodoroCount)
  const workMinutes = useTimerStore(s => s.totalWorkMinutesToday)
  const coffeeToday = useInventoryStore(s => s.coffeeToday)
  const waterToday = useInventoryStore(s => s.waterToday)

  const completedQuests = quests.filter(q => q.status === 'done').length
  const activeQuests = quests.filter(q => q.status === 'active').length
  const workHours = Math.floor(workMinutes / 60)

  return (
    <div className="h-full overflow-y-auto p-6 pt-20 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-5xl block mb-2">🐸</span>
          <h1 className="font-pixel text-lg text-secondary pixel-text">O Sapo Caolho</h1>
          <p className="font-body text-xl text-text-dim">
            O velho sapo te observa com seu olho bom.<br />
            <span className="text-secondary">"Senta aí, aventureiro. O que vai ser hoje?"</span>
          </p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PixelPanel className="text-center">
            <span className="text-3xl block">⚔️</span>
            <p className="font-pixel text-2xl text-secondary mt-1">{completedQuests}</p>
            <p className="font-body text-sm text-text-dim">Quests Completas</p>
          </PixelPanel>
          <PixelPanel className="text-center">
            <span className="text-3xl block">🔥</span>
            <p className="font-pixel text-2xl text-primary mt-1">{activeQuests}</p>
            <p className="font-body text-sm text-text-dim">Quests Ativas</p>
          </PixelPanel>
          <PixelPanel className="text-center">
            <span className="text-3xl block">🍅</span>
            <p className="font-pixel text-2xl text-accent mt-1">{pomodoroCount}</p>
            <p className="font-body text-sm text-text-dim">Pomodoros</p>
          </PixelPanel>
          <PixelPanel className="text-center">
            <span className="text-3xl block">⏱️</span>
            <p className="font-pixel text-2xl text-mana mt-1">{workHours}h</p>
            <p className="font-body text-sm text-text-dim">Trabalho Hoje</p>
          </PixelPanel>
        </div>

        {/* Coffee corner — the tavern's specialty */}
        <PixelPanel accent>
          <CoffeeTracker />
        </PixelPanel>

        <PixelPanel title="AMPULHETA DE FOCO">
          <PomodoroTimer />
        </PixelPanel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Character stats */}
          <PixelPanel title="AVENTUREIRO">
            <div className="text-center mb-4">
              <span className="text-4xl block mb-1">🧙</span>
              <p className="font-pixel text-sm text-secondary">{character.name}</p>
              <p className="font-body text-lg text-text-dim">Nível {character.level} | {character.xp_total} XP</p>
            </div>
            <div className="space-y-2">
              {STATS.map(stat => (
                <div key={stat} className="flex items-center gap-2">
                  <span className="font-pixel text-[10px] w-10 text-right" style={{ color: STAT_COLORS[stat] }}>
                    {STAT_LABELS[stat].slice(0, 3).toUpperCase()}
                  </span>
                  <div className="flex-1 h-3 bg-bg-dark pixel-border overflow-hidden">
                    <div
                      className="h-full"
                      style={{ width: `${(character.stats[stat] / 20) * 100}%`, backgroundColor: STAT_COLORS[stat] }}
                    />
                  </div>
                  <span className="font-pixel text-[10px] w-4 text-right text-text">{character.stats[stat]}</span>
                </div>
              ))}
            </div>
          </PixelPanel>

          {/* Projects overview */}
          <PixelPanel title="MISSÕES">
            <div className="space-y-2">
              {projects.length === 0 ? (
                <p className="font-body text-lg text-text-dim text-center py-4">
                  Nenhuma missão ainda. Explore o mapa para encontrar uma!
                </p>
              ) : (
                projects.map(p => {
                  const pQuests = quests.filter(q => q.project_id === p.id)
                  const pDone = pQuests.filter(q => q.status === 'done').length
                  return (
                    <div key={p.id} className="flex items-center gap-3 bg-bg-dark pixel-border p-2">
                      <div
                        className="w-8 h-8 pixel-border flex items-center justify-center text-lg"
                        style={{ backgroundColor: p.color }}
                      >
                        🏠
                      </div>
                      <div className="flex-1">
                        <span className="font-body text-lg text-text">{p.name}</span>
                        <span className="font-body text-sm text-text-dim ml-2">
                          {pDone}/{pQuests.length}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </PixelPanel>
        </div>

        {/* Daily stats */}
        <PixelPanel title="DIÁRIO DO DIA">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-2xl block">☕</span>
              <p className="font-pixel text-xl text-secondary">{coffeeToday}</p>
              <p className="font-body text-sm text-text-dim">Poções</p>
            </div>
            <div>
              <span className="text-2xl block">💧</span>
              <p className="font-pixel text-xl text-mana">{waterToday}</p>
              <p className="font-body text-sm text-text-dim">Frascos</p>
            </div>
            <div>
              <span className="text-2xl block">❤️</span>
              <p className="font-pixel text-xl text-hp">{character.hp}/{character.hp_max}</p>
              <p className="font-body text-sm text-text-dim">HP</p>
            </div>
            <div>
              <span className="text-2xl block">💎</span>
              <p className="font-pixel text-xl text-mp">{character.mp}/{character.mp_max}</p>
              <p className="font-body text-sm text-text-dim">MP</p>
            </div>
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}
