// src/services/api.js

// 1) Tenta usar VITE_API_BASE_URL. Pode ser:
//    - relativo: "/api/v1"
//    - absoluto: "http://localhost:8000/api/v1"
const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim();

// 2) Se não houver, monta absoluto com protocol/host/port/prefix (fallback legado)
const protocol = import.meta.env.VITE_API_PROTOCOL || 'http';
const host     = import.meta.env.VITE_API_HOST     || '127.0.0.1';
const port     = import.meta.env.VITE_API_PORT     || '8000';
const prefix   = (import.meta.env.VITE_API_PREFIX  || '/api/v1').replace(/\/$/, '');

// 3) Normaliza BASE_URL
let BASE_URL = '';
if (RAW_BASE) {
  // relativo ou absoluto, apenas tira barra final
  BASE_URL = RAW_BASE.replace(/\/$/, '');
} else {
  BASE_URL = `${protocol}://${host}:${port}${prefix}`;
}

/**
 * Chamada fetch padrão da API.
 * - Usa credenciais (cookies) se existirem
 * - Define Content-Type apenas quando há body
 * - Lança erro com mensagem amigável do backend quando possível
 */
export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const cleanBase = BASE_URL;                           // ex.: "/api/v1" ou "http://x:8000/api/v1"
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${cleanBase}${cleanPath}`;

  const hasBody = body !== undefined && body !== null && !['GET', 'HEAD'].includes(method);
  const finalHeaders = hasBody
    ? { 'Content-Type': 'application/json', ...headers }
    : { ...headers };

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    credentials: 'include', // mantém sessão se usar cookies
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
