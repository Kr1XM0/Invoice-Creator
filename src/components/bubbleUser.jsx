import { useState } from 'preact/hooks'
import InitForm from './initForm'

export default function BubbleUser({ userName = '', userData, onSave }) {
  const [open, setOpen] = useState(false)
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1.5 pr-4 pl-1.5 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        onClick={() => setOpen(true)}
        aria-label="Open business details"
      >
        <span className="grid size-8 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
          {initials || 'IN'}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-32 truncate text-xs font-medium text-neutral-900">
            {userName || 'Business details'}
          </span>
          <span className="block text-[11px] text-neutral-500">
            Business details
          </span>
        </span>
      </button>

      {open && (
        <InitForm
          initialData={userData}
          onSave={onSave}
          close={() => setOpen(false)}
        />
      )}
    </>
  )
}
