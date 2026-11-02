import { useEffect } from 'preact/hooks'
import { IconX } from '@tabler/icons-preact'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = 'md',
}) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-neutral-950/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl ${SIZES[size]}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            className="icon-btn -mr-1 -mt-1 shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function Field({ label, hint, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {htmlFor ? (
        <label className="label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="label">{label}</span>
      )}
      {children}
      {hint && <span className="text-xs text-neutral-400">{hint}</span>}
    </div>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }

  return (
    <button
      type="button"
      className={`btn ${variants[variant]} ${size === 'sm' ? 'btn-sm' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
