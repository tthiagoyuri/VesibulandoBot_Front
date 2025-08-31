const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api/v1').replace(/\/$/, '')

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    credentials: 'include',
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (!res.ok) {
    let msg = 'Erro na requisição'
    try { const j = await res.json(); msg = j.error || msg } catch {}
    throw new Error(msg)
  }
  return res.status === 204 ? null : res.json()
}

let _sessionLoaded = false
let _user = null

export async function getCurrentUser(force = false) {
  if (!_sessionLoaded || force) {
    try { _user = await apiFetch('/auth/me') } catch { _user = null }
    _sessionLoaded = true
  }
  return _user
}

export async function register({ email, password }) {
  return apiFetch('/auth/register', { method: 'POST', body: { email, senha: password } })
}
export async function login({ email, password }) {
  const u = await apiFetch('/auth/login', { method: 'POST', body: { email, senha: password } })
  _user = u; _sessionLoaded = true
  return u
}
export async function logout() {
  await apiFetch('/auth/logout', { method: 'POST' })
  _user = null; _sessionLoaded = false
}
export async function setPassword({ password, confirm }) {
  return apiFetch('/auth/password/set', { method: 'POST', body: { senha: password, confirmacao: confirm } })
}
