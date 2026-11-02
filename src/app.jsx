import { useEffect, useState } from 'preact/hooks'
import {
  IconArrowRight,
  IconFileInvoice,
  IconPlus,
  IconUsers,
} from '@tabler/icons-preact'
import InitForm from './components/initForm.jsx'
import BubbleUser from './components/bubbleUser.jsx'
import InvoiceTemplate from './components/invoiceTemplate.jsx'
import InitClientModal from './components/initClientModal.jsx'
import { Button } from './components/ui.jsx'
import { DEFAULT_COLUMNS } from './lib/invoice.js'
import {
  loadClients,
  loadColumns,
  loadUserData,
  saveClients,
  saveColumns,
  saveUserData,
  upsertClient,
} from './lib/storage.js'

export function App() {
  const [hydrated, setHydrated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [clients, setClients] = useState([])
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [currentClient, setCurrentClient] = useState(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)

  useEffect(() => {
    setUserData(loadUserData())
    setClients(loadClients())
    setColumns(loadColumns() ?? DEFAULT_COLUMNS.map((column) => ({ ...column })))
    setHydrated(true)
  }, [])

  const handleSaveUser = (data) => {
    saveUserData(data)
    setUserData(data)
    setShowUserForm(false)
  }

  const saveClientAndCreate = (client) => {
    const result = upsertClient(clients, client)
    saveClients(result.clients)
    setClients(result.clients)
    setCurrentClient(result.client)
    setShowClientModal(false)
  }

  const deleteClient = (clientId) => {
    const next = clients.filter((client) => client.id !== clientId)
    saveClients(next)
    setClients(next)
  }

  const updateColumns = (nextColumns) => {
    setColumns(nextColumns)
    saveColumns(nextColumns)
  }

  const startNewInvoice = () => {
    if (!userData) {
      setShowUserForm(true)
      return
    }

    setCurrentClient(null)
    setShowClientModal(true)
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-900 text-white">
              <IconFileInvoice size={20} />
            </span>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-neutral-900">
                Invoice Creator
              </h1>
              <p className="text-xs text-neutral-500">
                Simple invoices, clearly made.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userData ? (
              <>
                <BubbleUser
                  userName={userData.userName}
                  userData={userData}
                  onSave={handleSaveUser}
                />
                <Button icon={IconPlus} onClick={startNewInvoice}>
                  New invoice
                </Button>
              </>
            ) : (
              <Button
                icon={IconArrowRight}
                onClick={() => setShowUserForm(true)}
              >
                Get started
              </Button>
            )}
          </div>
        </header>

        {!hydrated ? (
          <div className="min-h-[40vh]" />
        ) : !userData ? (
          <section className="card mx-auto max-w-2xl p-10 text-center sm:p-16">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-700">
              <IconFileInvoice size={24} />
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
              Set up your business details
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500">
              Add your name, company and contact details once. Every invoice you
              create will use them automatically.
            </p>
            <Button
              className="mt-8"
              icon={IconArrowRight}
              onClick={() => setShowUserForm(true)}
            >
              Add business details
            </Button>
          </section>
        ) : !currentClient ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="card flex flex-col justify-between p-8 sm:p-10">
              <div>
                <p className="label">Ready when you are</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
                  Create a new invoice
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
                  Pick a saved client or add a new one. Your invoice is generated
                  instantly and stays editable.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Button icon={IconPlus} onClick={startNewInvoice}>
                  New invoice
                </Button>
                <Button
                  variant="secondary"
                  icon={IconUsers}
                  onClick={() => setShowClientModal(true)}
                >
                  Choose client
                </Button>
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Saved clients
                </h3>
                <span className="text-xs text-neutral-400">
                  {clients.length}
                </span>
              </div>

              {clients.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-neutral-200 p-6 text-center">
                  <IconUsers size={20} className="mx-auto text-neutral-300" />
                  <p className="mt-2 text-sm text-neutral-500">
                    Clients you invoice will appear here for quick access.
                  </p>
                </div>
              ) : (
                <ul className="mt-3 divide-y divide-neutral-100">
                  {clients.slice(0, 5).map((client) => (
                    <li key={client.id}>
                      <button
                        type="button"
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left"
                        onClick={() => saveClientAndCreate(client)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-neutral-900">
                            {client.name}
                          </span>
                          <span className="block truncate text-xs text-neutral-500">
                            {client.address || client.email || 'No details yet'}
                          </span>
                        </span>
                        <IconArrowRight
                          size={16}
                          className="shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-900"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {clients.length > 0 && (
                <button
                  type="button"
                  className="mt-4 cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  onClick={() => setShowClientModal(true)}
                >
                  {clients.length > 5
                    ? `View all ${clients.length} clients`
                    : 'Open client list'}
                </button>
              )}
            </section>
          </div>
        ) : (
          <InvoiceTemplate
            client={currentClient}
            userData={userData}
            columns={columns}
            onColumnsChange={updateColumns}
            onChangeClient={() => setShowClientModal(true)}
          />
        )}
      </div>

      {showUserForm && (
        <InitForm
          initialData={userData}
          onSave={handleSaveUser}
          close={() => setShowUserForm(false)}
          isSetup={!userData}
        />
      )}

      {showClientModal && (
        <InitClientModal
          clients={clients}
          onSelect={saveClientAndCreate}
          onDelete={deleteClient}
          close={() => setShowClientModal(false)}
        />
      )}
    </main>
  )
}
