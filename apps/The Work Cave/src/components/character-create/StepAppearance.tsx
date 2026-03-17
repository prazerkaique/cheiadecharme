import { SKIN_COLORS, HAIR_COLORS, OUTFIT_COLORS } from '@/config/character'
import type { Appearance } from '@/types/character'

interface StepAppearanceProps {
  appearance: Appearance
  onChange: (appearance: Appearance) => void
}

function ColorSwatch({
  hex,
  label,
  selected,
  onClick,
}: {
  hex: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 rounded-full cursor-pointer transition-all
        ${selected ? 'pixel-border-accent scale-110' : 'pixel-border hover:scale-105'}
      `}
      style={{ backgroundColor: hex }}
      title={label}
    />
  )
}

export function StepAppearance({ appearance, onChange }: StepAppearanceProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-body text-xl text-text-dim text-center leading-relaxed">
        Até os maiores guerreiros cuidam da própria imagem.<br />
        <span className="text-secondary">Molde sua forma, aventureiro.</span>
      </p>

      {/* Skin color */}
      <div>
        <p className="font-pixel text-[10px] text-secondary mb-2">COR DE PELE</p>
        <div className="flex flex-wrap gap-3">
          {SKIN_COLORS.map(c => (
            <ColorSwatch
              key={c.hex}
              hex={c.hex}
              label={c.label}
              selected={appearance.skinColor === c.hex}
              onClick={() => onChange({ ...appearance, skinColor: c.hex })}
            />
          ))}
        </div>
      </div>

      {/* Hair color */}
      <div>
        <p className="font-pixel text-[10px] text-secondary mb-2">COR DO CABELO</p>
        <div className="flex flex-wrap gap-3">
          {HAIR_COLORS.map(c => (
            <ColorSwatch
              key={c.hex}
              hex={c.hex}
              label={c.label}
              selected={appearance.hairColor === c.hex}
              onClick={() => onChange({ ...appearance, hairColor: c.hex })}
            />
          ))}
        </div>
      </div>

      {/* Outfit color */}
      <div>
        <p className="font-pixel text-[10px] text-secondary mb-2">COR DA ROUPA</p>
        <div className="flex flex-wrap gap-3">
          {OUTFIT_COLORS.map(c => (
            <ColorSwatch
              key={c.hex}
              hex={c.hex}
              label={c.label}
              selected={appearance.outfitColor === c.hex}
              onClick={() => onChange({ ...appearance, outfitColor: c.hex })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
