import { useState } from 'preact/hooks'
import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-preact'
import { Button, Field, Modal } from './ui'
import {
  createRow,
  formatMoney,
  rowTotal,
  sanitizeNumber,
} from '../lib/invoice'

export default function FormDataModal({
  close,
  onSave,
  columns,
  initialRows,
  mode = 'add',
}) {
  const [rows, setRows] = useState(() =>
    initialRows?.length
      ? initialRows.map((row) => ({ id: row.id, values: { ...row.values } }))
      : [createRow()],
  )

  const editableColumns = columns.filter(
    (column) => column.visible && column.id !== 'subtotal',
  )
  const showSubtotal = columns.some(
    (column) => column.id === 'subtotal' && column.visible,
  )

  const updateValue = (rowId, column, value) => {
    const numeric = column.type === 'number' || column.type === 'currency'
    const nextValue = numeric ? sanitizeNumber(value) : value

    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? { ...row, values: { ...row.values, [column.id]: nextValue } }
          : row,
      ),
    )
  }

  const addRow = () => {
    setRows((current) => [...current, createRow()])
  }

  const removeRow = (rowId) => {
    setRows((current) => {
      if (current.length === 1) return [createRow()]
      return current.filter((row) => row.id !== rowId)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(rows.map((row) => ({ id: row.id, values: { ...row.values } })))
    close()
  }

  const inputId = (row, column) => `line-${row.id}-${column.id}`

  const renderInput = (column, row) => {
    const value = row.values[column.id] ?? ''
    const required =
      column.id === 'description' ||
      column.id === 'price' ||
      column.id === 'quantity'

    if (column.type === 'date') {
      return (
        <input
          id={inputId(row, column)}
          className="input"
          type="date"
          value={value}
          onInput={(event) => updateValue(row.id, column, event.target.value)}
        />
      )
    }

    if (column.type === 'number' || column.type === 'currency') {
      const input = (
        <input
          id={inputId(row, column)}
          className={`input ${column.type === 'currency' ? 'pl-7 text-right' : ''}`}
          type="text"
          inputMode="decimal"
          required={required}
          placeholder={column.type === 'currency' ? '0.00' : '0'}
          value={value}
          onInput={(event) => updateValue(row.id, column, event.target.value)}
        />
      )

      if (column.type === 'currency') {
        return (
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-neutral-400">
              $
            </span>
            {input}
          </div>
        )
      }

      return input
    }

    return (
      <input
        id={inputId(row, column)}
        className="input"
        type="text"
        required={required}
        placeholder={
          column.id === 'description' ? 'What are you billing for?' : 'Value'
        }
        value={value}
        onInput={(event) => updateValue(row.id, column, event.target.value)}
      />
    )
  }

  return (
    <Modal
      title={mode === 'edit' ? 'Edit line item' : 'Add line items'}
      subtitle={
        mode === 'edit'
          ? 'Update the values for this line. The subtotal is calculated automatically.'
          : 'Fill in the details below. You can add as many lines as you need.'
      }
      onClose={close}
      size="lg"
      footer={
        <>
          {mode === 'add' && (
            <Button variant="secondary" icon={IconPlus} onClick={addRow}>
              Add line
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="line-item-form" icon={IconCheck}>
            {mode === 'edit' ? 'Save line' : 'Add to invoice'}
          </Button>
        </>
      }
    >
      <form id="line-item-form" className="space-y-3" onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="rounded-xl border border-neutral-200 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="label">Line {index + 1}</span>
              {mode === 'add' && rows.length > 1 && (
                <button
                  type="button"
                  className="icon-btn size-8 border-0 bg-transparent hover:text-red-600"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove line ${index + 1}`}
                >
                  <IconTrash size={14} />
                </button>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {editableColumns.map((column) => (
                <div
                  key={column.id}
                  className={column.id === 'description' ? 'sm:col-span-2' : ''}
                >
                  <Field
                    label={column.label}
                    htmlFor={inputId(row, column)}
                  >
                    {renderInput(column, row)}
                  </Field>
                </div>
              ))}

              {showSubtotal && (
                <Field label="Subtotal">
                  <div className="input bg-neutral-50 text-right text-neutral-500">
                    {formatMoney(rowTotal(row))}
                  </div>
                </Field>
              )}
            </div>
          </div>
        ))}
      </form>
    </Modal>
  )
}
