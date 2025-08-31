import { apiFetch } from './api.js'

const USE_MOCK = (import.meta.env.VITE_USE_MOCK || 'true') === 'true'

/* ===== MOCK ===== */
let mockCounter = 0
let mockChallengeId = null
const mockQuestions = [
  {
    id: 'q1',
    title: 'Qual é a fórmula para calcular a área de um triângulo?',
    options: [
      { key: 'A', text: 'A = (base × altura) ÷ 2' },
      { key: 'B', text: 'A = base × altura' },
      { key: 'C', text: 'A = (base + altura) ÷ 2' },
      { key: 'D', text: 'A = base ÷ altura' }
    ]
  },
  {
    id: 'q2',
    title: 'Qual a capital de SP?',
    options: [
      { key: 'A', text: 'Campinas' },
      { key: 'B', text: 'Santos' },
      { key: 'C', text: 'São Paulo' },
      { key: 'D', text: 'Sorocaba' }
    ]
  }
]

/* ===== API CONTRACT (exemplo) =====
startChallenge(config: {simulado,categoria,dificuldade,ano})
  -> POST /challenges/start  { ...config }
  <- { challengeId: string, question: Question }

fetchNextQuestion({challengeId})
  -> GET /challenges/:id/next
  <- { finished: boolean, question?: Question }

submitAnswer({challengeId, questionId, answer})
  -> POST /challenges/:id/answers { questionId, answer }
  <- { ok: true }

skipQuestion({challengeId, questionId})
  -> POST /challenges/:id/skip { questionId }
  <- { ok: true }
==================================== */

export async function startChallenge(config) {
  if (USE_MOCK) {
    mockChallengeId = `mock-${Date.now()}`
    mockCounter = 0
    return { challengeId: mockChallengeId, question: mockQuestions[mockCounter] }
  }
  return apiFetch('/challenges/start', { method: 'POST', body: config })
}

export async function fetchNextQuestion({ challengeId }) {
  if (USE_MOCK) {
    mockCounter++
    if (mockCounter >= mockQuestions.length) {
      return { finished: true }
    }
    return { finished: false, question: mockQuestions[mockCounter] }
  }
  return apiFetch(`/challenges/${challengeId}/next`)
}

export async function submitAnswer({ challengeId, questionId, answer }) {
  if (USE_MOCK) return { ok: true }
  return apiFetch(`/challenges/${challengeId}/answers`, {
    method: 'POST',
    body: { questionId, answer }
  })
}

export async function skipQuestion({ challengeId, questionId }) {
  if (USE_MOCK) return { ok: true }
  return apiFetch(`/challenges/${challengeId}/skip`, {
    method: 'POST',
    body: { questionId }
  })
}
