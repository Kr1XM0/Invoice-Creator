import { uid } from './storage'

export const DEFAULT_COLUMNS = [
  {
    id: 'description',
    label: 'Description',
    type: 'text',
    visible: true,
    builtIn: true,
    locked: true,
  },
  {
    id: 'date',
    label: 'Date',
    type: 'date',
    visible: true,
    builtIn: true,
    locked: false,
  },
  {
    id: 'quantity',
    label: 'Qty',
    type: 'number',
    visible: true,
    builtIn: true,
    locked: false,
  },
  {
    id: 'price',
    label: 'Price',
    type: 'currency',
    visible: true,
    builtIn: true,
    locked: true,
  },
  {
    id: 'subtotal',
    label: 'Subtotal',
    type: 'currency',
    visible: true,
    builtIn: true,
    locked: false,
  },
]

export function createRow(values = {}) {
  return {
    id: uid(),
    values: {
      description: '',
      date: '',
      quantity: '1',
      price: '',
      ...values,
    },
  }
}

export function rowTotal(row) {
  const quantity = Number.parseFloat(row.values.quantity)
  const price = Number.parseFloat(row.values.price)
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1
  const safePrice = Number.isFinite(price) ? price : 0
  return safeQuantity * safePrice
}

export function invoiceTotal(rows) {
  return rows.reduce((total, row) => total + rowTotal(row), 0)
}

export function sanitizeNumber(value) {
  return value
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*?)\..*/g, '$1')
}

export function formatMoney(value) {
  const number = Number(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(number) ? number : 0)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatLongDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function columnAlign(column) {
  if (column.id === 'quantity') return 'text-center'
  if (column.type === 'currency' || column.type === 'number') return 'text-right'
  return 'text-left'
}

export function columnWidth(column) {
  switch (column.id) {
    case 'description':
      return '34%'
    case 'date':
      return '14%'
    case 'quantity':
      return '8%'
    case 'price':
      return '15%'
    case 'subtotal':
      return '15%'
    default:
      return '14%'
  }
}

export function cellValue(column, row) {
  const value = row.values[column.id]

  if (column.id === 'subtotal') return formatMoney(rowTotal(row))
  if (column.type === 'currency') return formatMoney(value)
  if (column.type === 'date') return formatDate(value)
  if (column.type === 'number') return value || '—'

  return value || '—'
}
