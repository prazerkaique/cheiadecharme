import { useUIStore } from '@/stores/ui-store'
import type { Toast as ToastType } from '@/stores/ui-store'

const TYPE_STYLES: Record<ToastType['type'], string> = {
  success: 'border-accent',
  info: 'border-mana',
  warning: 'border-secondary',
  achievement: 'border-rarity-epic',
  xp: 'border-xp',
  level_up: 'border-primary',
}

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore(s => s.removeToast)

  return (
    <div
      className={`
        toast-enter bg-bg-panel pixel-border p-3 flex items-center gap-3
        cursor-pointer border-l-4 ${TYPE_STYLES[toast.type]}
      `}
      onClick={() => removeToast(toast.id)}
    >
      {toast.icon && <span className="text-2xl">{toast.icon}</span>}
      <span className="font-body text-lg">{toast.message}</span>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useUIStore(s => s.toasts)

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
