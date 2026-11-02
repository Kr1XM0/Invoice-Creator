import { useState } from 'preact/hooks'
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconLock,
  IconPlus,
  IconRotate,
  IconTrash,
} from '@tabler/icons-preact'
import { Button, Modal } from './ui'
import { DEFAULT_COLUMNS } from '../lib/invoice'
import { uid } from '../lib/storage'

const TYPE_LABELS = {
  text: 'Text',
  date: 'Date',
  number: 'Number',
  currency: 'Currency',
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
        checked ? 'bg-neutral-900' : 'bg-neutral-200'
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function ColumnsModal({ columns, onChange, close }) {
  const [label, setLabel] = useState('')
  const [type, setType] = useState('text')

  const toggle = (id) => {
    onChange(
      columns.map((column) =>
        column.id === id ? { ...column, visible: !column.visible } : column,
      ),
    )
  }

  const remove = (id) => {
    onChange(columns.filter((column) => column.id !== id))
  }

  const move = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= columns.length) return
    const next = [...columns]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onChange(next)
  }

  const addColumn = () => {
    const name = label.trim()
    if (!name) return

    onChange([
      ...columns,
      {
        id: `custom-${uid()}`,
        label: name,
        type,
        visible: true,
        builtIn: false,
        locked: false,
      },
    ])
    setLabel('')
    setType('text')
  }

  const reset = () => {
    onChange(DEFAULT_COLUMNS.map((column) => ({ ...column })))
  }

  return (
    <Modal
      title="Invoice columns"
      subtitle="Choose what appears on the invoice. Add custom columns for project names, PO numbers, tax, hours, or notes."
      onClose={close}
      size="lg"
      footer={
        <>
          <Button variant="ghost" icon={IconRotate} onClick={reset}>
            Reset
          </Button>
          <div className="flex-1" />
          <Button icon={IconCheck} onClick={close}>
            Done
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5"
          >
            <div className="flex flex-col">
              <button
                type="button"
                className="cursor-pointer rounded p-0.5 text-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-25"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${column.label} up`}
              >
                <IconArrowUp size={12} />
              </button>
              <button
                type="button"
                className="cursor-pointer rounded p-0.5 text-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-25"
                onClick={() => move(index, 1)}
                disabled={index === columns.length - 1}
                aria-label={`Move ${column.label} down`}
              >
                <IconArrowDown size={12} />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-medium text-neutral-900">
                  {column.label}
                </span>
                <span className="badge">
                  {column.builtIn ? 'Built-in' : 'Custom'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-400">
                {TYPE_LABELS[column.type] ?? 'Text'}
              </p>
            </div>

            {!column.builtIn && (
              <button
                type="button"
                className="icon-btn size-8 border-0 bg-transparent hover:text-red-600"
                onClick={() => remove(column.id)}
                aria-label={`Remove ${column.label}`}
              >
                <IconTrash size={14} />
              </button>
            )}

            {column.locked ? (
              <span className="flex shrink-0 items-center gap-1 text-[11px] text-neutral-400">
                <IconLock size={12} />
                Required
              </span>
            ) : (
              <Toggle
                checked={column.visible}
                onChange={() => toggle(column.id)}
                label={`${column.visible ? 'Hide' : 'Show'} ${column.label}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-neutral-200 p-4">
        <p className="text-sm font-medium text-neutral-900">
          Add a custom column
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Examples: Project, PO number, Tax, Hours, Category, Notes.
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className="input"
            type="text"
            placeholder="Column name"
            value={label}
            onInput={(event) => setLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addColumn()
              }
            }}
          />
          <select
            className="input sm:w-36"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="currency">Currency</option>
            <option value="date">Date</option>
          </select>
          <Button icon={IconPlus} onClick={addColumn} disabled={!label.trim()}>
            Add
          </Button>
        </div>
      </div>
    </Modal>
  )
}
