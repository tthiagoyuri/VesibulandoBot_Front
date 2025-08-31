// src/services/challenge.js
import { apiFetch } from './api.js'

export async function getNextQuestion() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/desafio/proxima`, {
    method: 'GET',
    credentials: 'include',
  })
  if (res.status === 204) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const q = await res.json()
  return {
    id: q.id,
    title: q.pergunta,
    year: q.ano,
    options: Object.entries(q.alternativas).map(([key, text]) => ({ key, text })),
  }
}

export function submitAnswer({ questionId, answer }) {
  return apiFetch('/desafio/responder', {
    method: 'POST',
    body: { questao_id: Number(questionId), resposta: String(answer).toUpperCase() },
  })
}
