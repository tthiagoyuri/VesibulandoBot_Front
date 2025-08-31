// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    credentials: 'include',               // <- ESSENCIAL para cookies
    body: body ? JSON.stringify(body) : undefined,
  })

  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`)
  }
  return data
}
