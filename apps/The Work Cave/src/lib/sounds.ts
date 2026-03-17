import { Howl } from 'howler'

const sounds: Record<string, Howl> = {}

export type SoundId =
  | 'step'
  | 'quest_complete'
  | 'level_up'
  | 'click'
  | 'open'
  | 'close'
  | 'achievement'
  | 'coffee'
  | 'water'
  | 'pomodoro_start'
  | 'pomodoro_end'
  | 'boss_appear'

const SOUND_PATHS: Record<SoundId, string> = {
  step: '/sounds/step.wav',
  quest_complete: '/sounds/quest-complete.wav',
  level_up: '/sounds/level-up.wav',
  click: '/sounds/click.wav',
  open: '/sounds/open.wav',
  close: '/sounds/close.wav',
  achievement: '/sounds/achievement.wav',
  coffee: '/sounds/coffee.wav',
  water: '/sounds/water.wav',
  pomodoro_start: '/sounds/pomodoro-start.wav',
  pomodoro_end: '/sounds/pomodoro-end.wav',
  boss_appear: '/sounds/boss-appear.wav',
}

export function playSound(id: SoundId, volume = 0.5): void {
  if (!sounds[id]) {
    const path = SOUND_PATHS[id]
    if (!path) return
    sounds[id] = new Howl({ src: [path], volume })
  }
  sounds[id]!.volume(volume)
  sounds[id]!.play()
}

export function setSoundEnabled(_enabled: boolean): void {
  Howler.mute(!_enabled)
}
