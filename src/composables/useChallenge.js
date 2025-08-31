import { ref } from 'vue'
import { startChallenge, fetchNextQuestion, submitAnswer, skipQuestion } from '@/services/challenge.js'

export function useChallenge() {
  const challengeId = ref(null)
  const question = ref(null)
  const selectedOption = ref(null)
  const index = ref(0)
  const finished = ref(false)
  const loading = ref(false)
  const error = ref(null)

  async function start(config) {
    loading.value = true
    error.value = null
    try {
      const res = await startChallenge(config)
      challengeId.value = res.challengeId
      question.value = res.question ?? null
      selectedOption.value = null
      index.value = question.value ? 1 : 0
      finished.value = !question.value
    } catch (e) {
      error.value = e.message || 'Falha ao iniciar desafio'
    } finally {
      loading.value = false
    }
  }

  async function next() {
    if (!challengeId.value) return
    loading.value = true
    error.value = null
    try {
      const res = await fetchNextQuestion({ challengeId: challengeId.value })
      if (res.finished) {
        finished.value = true
        question.value = null
      } else {
        question.value = res.question
        selectedOption.value = null
        index.value += 1
      }
    } catch (e) {
      error.value = e.message || 'Falha ao buscar próxima questão'
    } finally {
      loading.value = false
    }
  }

  async function confirm() {
    if (!question.value) return
    await submitAnswer({
      challengeId: challengeId.value,
      questionId: question.value.id,
      answer: selectedOption.value
    })
    await next()
  }

  async function skip() {
    if (!question.value) return
    await skipQuestion({
      challengeId: challengeId.value,
      questionId: question.value.id
    })
    await next()
  }

  return {
    // state
    challengeId, question, selectedOption, index, finished, loading, error,
    // actions
    start, confirm, skip, next
  }
}
