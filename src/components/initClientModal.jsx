import { useState } from 'preact/hooks'
import {
  IconArrowRight,
  IconPencil,
  IconSearch,
  IconTrash,
  IconUsers,
} from '@tabler/icons-preact'
import { Button, Field, Modal } from './ui'

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export default function InitClientModal({ close, clients = [], onSelect, onDelete }) {
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', email: '' })

  const query = search.trim().toLowerCase()
  const filtered = query
    ? clients.filter((client) =>
        [client.name, client.address, client.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)),
      )
    : clients

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({ name: '', address: '', email: '' })
  }

  const startEdit = (client) => {
    setEditingId(client.id)
    setForm({
      name: client.name ?? '',
      address: client.address ?? '',
      email: client.email ?? '',
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSelect({
      id: editingId ?? undefined,
      name: form.name,
      address: form.address,
      email: form.email,
    })
  }

  return (
    <Modal
      title="Choose a client"
      subtitle="Pick someone you have invoiced before, or add a new client. New clients are saved automatically."
      onClose={close}
      size="xl"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900">
              Saved clients
            </h3>
            <span className="text-xs text-neutral-400">{clients.length}</span>
          </div>

          {clients.length > 3 && (
            <div className="relative mt-3">
              <IconSearch
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
              />
              <input
                className="input pl-9"
                type="search"
                placeholder="Search clients"
                value={search}
                onInput={(event) => setSearch(event.target.value)}
              />
            </div>
          )}

          <div className="mt-3 max-h-80 min-h-40 space-y-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="grid h-40 place-items-center rounded-xl border border-dashed border-neutral-200 px-6 text-center">
                <div>
                  <IconUsers
                    size={22}
                    className="mx-auto text-neutral-300"
                  />
                  <p className="mt-2 text-sm font-medium text-neutral-700">
                    {clients.length === 0 ? 'No saved clients yet' : 'No matches'}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {clients.length === 0
                      ? 'Add your first client on the right.'
                      : 'Try a different name or address.'}
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((client) => (
                <div
                  key={client.id}
                  className="group flex items-center gap-1 rounded-xl border border-transparent transition-colors hover:border-neutral-200 hover:bg-neutral-50"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 py-2.5 text-left"
                    onClick={() => onSelect(client)}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600">
                      {initials(client.name) || 'CL'}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-neutral-900">
                        {client.name}
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        {client.address || client.email || 'No details yet'}
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-0.5 pr-2">
                    <button
                      type="button"
                      className="icon-btn size-8 border-0 bg-transparent"
                      onClick={() => startEdit(client)}
                      aria-label={`Edit ${client.name}`}
                    >
                      <IconPencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn size-8 border-0 bg-transparent hover:text-red-600"
                      onClick={() => onDelete(client.id)}
                      aria-label={`Delete ${client.name}`}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="min-w-0 rounded-xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-neutral-900">
              {editingId ? 'Edit client' : 'New client'}
            </h3>
            {editingId && (
              <button
                type="button"
                className="cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-900"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <Field label="Client name" htmlFor="clientName">
              <input
                id="clientName"
                className="input"
                type="text"
                required
                autoComplete="off"
                placeholder="Acme Inc."
                value={form.name}
                onInput={update('name')}
              />
            </Field>

            <Field label="Address" htmlFor="clientAddress">
              <input
                id="clientAddress"
                className="input"
                type="text"
                autoComplete="off"
                placeholder="123 Main Street, City"
                value={form.address}
                onInput={update('address')}
              />
            </Field>

            <Field label="Email" hint="Optional" htmlFor="clientEmail">
              <input
                id="clientEmail"
                className="input"
                type="email"
                autoComplete="off"
                placeholder="billing@acme.com"
                value={form.email}
                onInput={update('email')}
              />
            </Field>

            <Button type="submit" icon={IconArrowRight} className="w-full">
              {editingId ? 'Save and use client' : 'Create invoice'}
            </Button>
          </form>
        </section>
      </div>
    </Modal>
  )
}
