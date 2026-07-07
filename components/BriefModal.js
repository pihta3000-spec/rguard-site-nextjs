import BriefForm from './BriefForm'

export default function BriefModal({ open, onClose }) {
  if (!open) return null

  const close = () => onClose?.()

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,12,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={close}
    >
      <div
        className="w-full max-w-xl relative max-h-[90vh] overflow-y-auto"
        style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(10,10,20,0.98)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)' }} />
        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs">// Бриф на сотрудничество</div>
            <button onClick={close} className="font-mono-terminal text-zinc-500 hover:text-red-400 transition-all cursor-pointer text-lg leading-none" aria-label="Закрыть">x</button>
          </div>
          <BriefForm onCancel={close} onSubmitted={close} />
        </div>
      </div>
    </div>
  )
}
