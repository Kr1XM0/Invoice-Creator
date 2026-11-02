import { useRef, useState } from 'preact/hooks'
import html2canvas from 'html2canvas'
import {
  IconColumns,
  IconDownload,
  IconEye,
  IconFileInvoice,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUsers,
} from '@tabler/icons-preact'
import { Button } from './ui'
import ColumnsModal from './columnsModal'
import FormDataModal from './FormDataModal'
import {
  cellValue,
  columnAlign,
  columnWidth,
  formatLongDate,
  formatMoney,
  invoiceTotal,
} from '../lib/invoice'

export default function InvoiceTemplate({
  client,
  userData,
  columns,
  onColumnsChange,
  onChangeClient,
}) {
  const sheetRef = useRef(null)
  const [rows, setRows] = useState(() => [])
  const [editMode, setEditMode] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [showFormModal, setShowFormModal] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [invoiceNumber] = useState(
    () =>
      `INV-${new Date().getFullYear()}-${String(
        Math.floor(1000 + Math.random() * 9000),
      )}`,
  )
  const [issueDate] = useState(() => new Date())

  const visibleColumns = columns.filter((column) => column.visible)
  const total = invoiceTotal(rows)
  const showEditControls = editMode && !isExporting

  const openAddRow = () => {
    setEditingRow(null)
    setShowFormModal(true)
  }

  const openEditRow = (row) => {
    setEditingRow(row)
    setShowFormModal(true)
  }

  const handleSaveRows = (savedRows) => {
    if (editingRow) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingRow.id
            ? { ...savedRows[0], id: editingRow.id }
            : row,
        ),
      )
      setEditingRow(null)
      return
    }

    setRows((current) => [...current, ...savedRows])
  }

  const deleteRow = (rowId) => {
    setRows((current) => current.filter((row) => row.id !== rowId))
  }

  const downloadInvoice = async () => {
    if (!sheetRef.current || isExporting) return

    setIsExporting(true)
    setExportError('')

    try {
      if (document.fonts?.ready) await document.fonts.ready
      await new Promise((resolve) => setTimeout(resolve, 60))

      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const link = document.createElement('a')
      const slug = client.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      link.download = `invoice-${slug || 'client'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error(error)
      setExportError('Could not export the invoice. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label">Draft invoice</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            Invoice for {client.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Edit line items, tune the columns, then download as PNG.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={IconUsers} onClick={onChangeClient}>
            Client
          </Button>
          <Button
            variant="secondary"
            icon={IconColumns}
            onClick={() => setShowColumns(true)}
          >
            Columns
          </Button>
          <Button
            variant="secondary"
            icon={editMode ? IconEye : IconPencil}
            onClick={() => setEditMode((value) => !value)}
          >
            {editMode ? 'Preview' : 'Edit'}
          </Button>
          <Button
            icon={IconDownload}
            onClick={downloadInvoice}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting…' : 'Download'}
          </Button>
        </div>
      </div>

      {exportError && (
        <p className="text-xs font-medium text-red-600">{exportError}</p>
      )}

      <div className="overflow-x-auto pb-2">
        <article
          ref={sheetRef}
          className="mx-auto min-w-170 max-w-4xl rounded-2xl border border-neutral-200 bg-white p-10 text-neutral-900 sm:p-12"
        >
          <header className="flex items-start justify-between gap-8 border-b border-neutral-200 pb-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-900 text-white">
                  <IconFileInvoice size={16} />
                </span>
                <span className="min-w-0 wrap-break-words text-sm font-semibold tracking-tight">
                  {userData.companyName}
                </span>
              </div>

              <div className="mt-5 space-y-1 text-sm text-neutral-500">
                {userData.workDirection && (
                  <p className="whitespace-pre-line">
                    {userData.workDirection}
                  </p>
                )}
                {userData.emailAddress && <p>{userData.emailAddress}</p>}
                {userData.phoneNumber && <p>{userData.phoneNumber}</p>}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] font-medium tracking-[0.3em] text-neutral-400 uppercase">
                Invoice
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight">
                {invoiceNumber}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                {formatLongDate(issueDate)}
              </p>
            </div>
          </header>

          <div className="grid gap-8 border-b border-neutral-100 py-8 sm:grid-cols-2">
            <div>
              <p className="label">Bill to</p>
              <p className="mt-3 text-base font-medium">{client.name}</p>
              {client.address && (
                <p className="mt-1 text-sm whitespace-pre-line text-neutral-500">
                  {client.address}
                </p>
              )}
              {client.email && (
                <p className="mt-1 text-sm text-neutral-500">{client.email}</p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="label">Payment details</p>
              <p className="mt-3 text-base font-medium">
                {userData.companyName}
              </p>
              {userData.userName && (
                <p className="mt-1 text-sm text-neutral-500">
                  {userData.userName}
                </p>
              )}
              {userData.phoneNumber && (
                <p className="mt-1 text-sm text-neutral-500">
                  {userData.phoneNumber}
                </p>
              )}
              {userData.emailAddress && (
                <p className="mt-1 text-sm text-neutral-500">
                  {userData.emailAddress}
                </p>
              )}
            </div>
          </div>

          <div className="py-8">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      style={{ width: columnWidth(column) }}
                      className={`pb-3 text-[11px] font-medium tracking-wider text-neutral-400 uppercase ${columnAlign(column)}`}
                    >
                      {column.label}
                    </th>
                  ))}
                  {showEditControls && <th className="w-16 pb-3" />}
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 && showEditControls ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="py-10 text-center text-sm text-neutral-400"
                    >
                      No line items yet. Add your first line item below.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      {visibleColumns.map((column) => (
                        <td
                          key={column.id}
                          style={{ width: columnWidth(column) }}
                          className={`py-4 align-top wrap-break-words ${columnAlign(column)} ${
                            column.id === 'description'
                              ? 'font-medium text-neutral-900'
                              : 'text-neutral-600'
                          }`}
                        >
                          {cellValue(column, row)}
                        </td>
                      ))}

                      {showEditControls && (
                        <td className="w-16 py-4 text-right align-top">
                          <div className="flex justify-end gap-0.5">
                            <button
                              type="button"
                              className="icon-btn size-8 border-0 bg-transparent"
                              onClick={() => openEditRow(row)}
                              aria-label="Edit line item"
                            >
                              <IconPencil size={14} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn size-8 border-0 bg-transparent hover:text-red-600"
                              onClick={() => deleteRow(row.id)}
                              aria-label="Delete line item"
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {showEditControls && (
              <button
                type="button"
                onClick={openAddRow}
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-3.5 text-sm font-medium text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900"
              >
                <IconPlus size={16} />
                Add line item
              </button>
            )}
          </div>

          <footer className="border-t border-neutral-200 pt-6">
            <div className="ml-auto w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Subtotal</span>
                <span>{formatMoney(total)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>

            <p className="mt-8 text-xs text-neutral-400">
              Thank you for your business.
            </p>
          </footer>
        </article>
      </div>

      {showFormModal && (
        <FormDataModal
          columns={columns}
          initialRows={editingRow ? [editingRow] : undefined}
          mode={editingRow ? 'edit' : 'add'}
          onSave={handleSaveRows}
          close={() => {
            setShowFormModal(false)
            setEditingRow(null)
          }}
        />
      )}

      {showColumns && (
        <ColumnsModal
          columns={columns}
          onChange={onColumnsChange}
          close={() => setShowColumns(false)}
        />
      )}
    </div>
  )
}
