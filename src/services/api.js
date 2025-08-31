// Util simples com fetch (sem dependências)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })

  // Tenta parsear; se 204 no content, evita erro
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data
}
