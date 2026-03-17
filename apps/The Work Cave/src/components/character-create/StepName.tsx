import { PixelInput } from '@/components/ui/PixelInput'

interface StepNameProps {
  name: string
  onChange: (name: string) => void
}

export function StepName({ name, onChange }: StepNameProps) {
  const isValid = name.trim().length >= 2 && name.trim().length <= 20

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-body text-xl text-text-dim text-center leading-relaxed">
        Todo aventureiro carrega um nome.<br />
        <span className="text-secondary">O seu ecoará pelos salões da Work Cave...</span>
      </p>

      <div className="w-full max-w-xs">
        <PixelInput
          label="INSCREVA SEU NOME"
          value={name}
          onChange={e => onChange(e.target.value)}
          placeholder="Escreva aqui, aventureiro..."
          maxLength={20}
          autoFocus
        />
      </div>

      <p className={`font-body text-sm ${isValid ? 'text-accent' : 'text-text-dim'}`}>
        {name.trim().length}/20 runas {name.trim().length > 0 && name.trim().length < 2 && '(mínimo 2)'}
      </p>
    </div>
  )
}
