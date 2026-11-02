const USER_KEY = 'userData'
const CLIENTS_KEY = 'savedClients'
const COLUMNS_KEY = 'invoiceColumns'

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode, quota, etc.).
  }
}

export const loadUserData = () => readJSON(USER_KEY, null)
export const saveUserData = (data) => writeJSON(USER_KEY, data)

export function loadClients() {
  const clients = readJSON(CLIENTS_KEY, [])
  return Array.isArray(clients) ? clients : []
}

export const saveClients = (clients) => writeJSON(CLIENTS_KEY, clients)

export function loadColumns() {
  const columns = readJSON(COLUMNS_KEY, null)
  return Array.isArray(columns) && columns.length > 0 ? columns : null
}

export const saveColumns = (columns) => writeJSON(COLUMNS_KEY, columns)

const sameClient = (a, b) =>
  a.name.trim().toLowerCase() === b.name.trim().toLowerCase() &&
  (a.address ?? '').trim().toLowerCase() === (b.address ?? '').trim().toLowerCase()

/**
 * Adds a client or updates the matching one. Returns both the new list and the
 * resolved client (with its stable id) so callers can open it immediately.
 */
export function upsertClient(clients, client) {
  const normalized = {
    id: client.id || uid(),
    name: (client.name ?? '').trim(),
    address: (client.address ?? '').trim(),
    email: (client.email ?? '').trim(),
  }

  const existing = clients.find(
    (item) => item.id === normalized.id || sameClient(item, normalized),
  )

  if (existing) {
    const updated = { ...existing, ...normalized, id: existing.id }
    return {
      clients: clients.map((item) => (item.id === existing.id ? updated : item)),
      client: updated,
    }
  }

  return { clients: [normalized, ...clients], client: normalized }
}
