<template> 
  <div class="challenge">
    <!-- Top bar (mobile) -->
    <header class="challenge-top">
      <button class="menu-toggle" type="button" @click="openSidebar">
        <i class="fa-solid fa-bars"></i>
        Menu
      </button>
      <div class="brand">
        <img :src="logo" alt="VestibulandoBot" />
        <span>VestibulandoBot</span>
      </div>
    </header>

    <div class="container">
      <!-- Sidebar -->
      <div class="sidebar-slot">
        <AppSidebar @logout="onLogout" />
      </div>

      <!-- Conteúdo -->
      <div class="center">
        <!-- Cabeçalho -->
        <header class="header">
          <h1>Modo Desafio</h1>
          <p class="header-sub">Simulados, foco e progresso contínuo.</p>
        </header>

        <!-- Painel: configurar + dica -->
        <section class="panel panel-config">
          <header class="panel-top">
            <div>
              <h2>Configurar desafio</h2>
              <p class="panel-sub">Simulados, foco e progresso contínuo. Mude as opções quando quiser.</p>
            </div>
            <button class="btn btn-config" @click="openConfig">Configurar desafio</button>
          </header>

          <div class="callout">
            <div class="badge" aria-hidden="true">Dica:</div>
            <div class="callout-body">
              <p>
                Você fará questões no formato do simulado escolhido.
                Receba feedback imediato e acompanhe sua performance.
              </p>
            </div>
          </div>
        </section>

        <!-- Grid principal: questão + resumo -->
        <section class="grid-panels">
          <!-- Painel questão -->
          <div class="panel panel-question">
            <div class="panel-title">
              <div class="timer" :style="{ color: timerColor }">
                <i class="dot" /> {{ timeDownMMSS }}
              </div>
            </div>

            <article class="question-card">
              <h4 class="question-title">{{ question.title }}</h4>

              <!-- Alternativas A, B, C, D -->
              <div class="options">
                <label
                  v-for="opt in question.options"
                  :key="opt.key"
                  class="option"
                  :class="{ selected: selectedOption === opt.key }"
                >
                  <input type="radio" :value="opt.key" v-model="selectedOption" />
                  <span class="opt-key">{{ opt.key }}</span>
                  <span class="opt-text">{{ opt.text }}</span>
                </label>
              </div>

              <!-- APENAS 2 BOTÕES: Pular e Confirmar -->
              <div class="actions-row">
                <button class="btn btn-skip" @click="skipQuestion" :disabled="loading">Pular</button>
                <button class="btn btn-confirm" @click="confirmAnswer" :disabled="loading || !selectedOption">Confirmar</button>
              </div>
            </article>
          </div>

          <!-- Painel resumo -->
          <aside class="panel panel-summary">
            <h3>Resumo do desafio</h3>
            <ul class="summary-list">
              <li><span>Simulado</span><b>{{ labelSimulado }}</b></li>
              <li><span>Matéria</span><b>{{ labelCategoria }}</b></li>
              <li><span>Dificuldade</span><b>{{ labelDificuldade }}</b></li>
              <li><span>Ano</span><b>{{ labelAno }}</b></li>
            </ul>
            <div class="summary-timer">
              <div class="clock">{{ timeUpHHMMSS }}</div>
            </div>
          </aside>
        </section>

        <!-- RODAPÉ: Botão Finalizar que para o cronômetro do RESUMO -->
        <footer class="page-footer">
          <button
            class="btn btn-finish"
            @click="finalizarResumo"
            :disabled="resumoParado"
            :aria-pressed="resumoParado ? 'true' : 'false'"
          >
            {{ resumoParado ? 'Finalizado' : 'Finalizar' }}
          </button>
        </footer>
      </div>
    </div>

    <!-- Mobile sidebar -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="mobile-sidebar-overlay"
        @click="closeSidebar"
      ></div>
    </transition>

    <transition name="slide">
      <div
        v-if="sidebarOpen"
        class="mobile-sidebar-panel"
        @click.stop
      >
        <div class="mobile-sidebar-header">
          <button class="close" type="button" @click="closeSidebar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <AppSidebar @logout="handleMobileLogout" />
      </div>
    </transition>

    <!-- MODAL DE CONFIG -->
    <ChallengeConfigModal
      v-model="showModal"
      :initial="config"
      :simulados="simulados"
      @apply="applyConfig"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ChallengeConfigModal from '@/components/challenge/ChallengeConfigModal.vue'
import { logout as doLogout } from '@/services/auth.js'
import logoUrl from '../assets/Icone.ico'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)
const logo = logoUrl

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

function handleMobileLogout() {
  closeSidebar()
  onLogout()
}

/* ======================= API ======================= */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`)
  return data
}

async function apiStartChallenge(cfg) {
  // POST /challenges/start -> { challengeId, question }
  return apiFetch('/challenges/start', { method: 'POST', body: cfg })
}
async function apiNextQuestion(challengeId) {
  // GET /challenges/:id/next -> { finished, question? }
  return apiFetch(`/challenges/${challengeId}/next`)
}
async function apiSubmitAnswer({ challengeId, questionId, answer }) {
  // POST /challenges/:id/answers
  return apiFetch(`/challenges/${challengeId}/answers`, {
    method: 'POST',
    body: { questionId, answer }
  })
}
async function apiSkipQuestion({ challengeId, questionId }) {
  // POST /challenges/:id/skip
  return apiFetch(`/challenges/${challengeId}/skip`, {
    method: 'POST',
    body: { questionId }
  })
}

/* ---------- Opções ---------- */
const simulados = [
  { label: 'Simulado Misturado ENEM', value: 'enem-mix' },
  { label: 'ENEM 2022 (Completo)', value: 'enem-2022' },
  { label: 'FUVEST (Treino)', value: 'fuvest' },
  { label: 'UNICAMP (Treino)', value: 'unicamp' }
]

/* ---------- Estado: configurado? ---------- */
const isConfigured = ref(false)

/* ---------- Config ---------- */
const config = reactive({
  // default só para o modal; resumo mostra — até configurar
  simulado: 'enem-mix',
  categoria: 'todas',
  dificuldade: 'medio',
  ano: new Date().getFullYear(),
  simuladoLabel: simulados.find(s => s.value === 'enem-mix')?.label || 'Simulado Misturado ENEM',
  categoriaLabel: 'Todas as matérias',
  dificuldadeLabel: 'Médio'
})

/* ---------- Labels do Resumo ---------- */
const labelSimulado = computed(() =>
  isConfigured.value
    ? (config.simuladoLabel || simulados.find(s => s.value === config.simulado)?.label || '—')
    : '—'
)
const labelCategoria = computed(() => (isConfigured.value ? (config.categoriaLabel || '—') : '—'))
const labelDificuldade = computed(() =>
  isConfigured.value
    ? (config.dificuldadeLabel || ({ facil:'Fácil', medio:'Médio', dificil:'Difícil' }[config.dificuldade] || '—'))
    : '—'
)
const labelAno = computed(() => (isConfigured.value ? (config.ano ?? '—') : '—'))

/* ---------- Modal ---------- */
const showModal = ref(false)
function openConfig() { showModal.value = true }
async function applyConfig(payload) {
  Object.assign(config, payload)
  showModal.value = false

  // marca como configurado e timers
  isConfigured.value = true
  resetResumo()
  resetCountdown()
  iniciarResumo()
  iniciarCountdown()

  // inicia o desafio no backend e carrega a primeira questão
  await startChallenge()
}

/* ============== Estado do desafio (backend) ============== */
const challengeId = ref(null)
const loading = ref(false)
const finished = ref(false)
const error = ref(null)

// question precisa existir no template; começa vazio
const question = reactive({ id: null, title: '', options: [] })
const selectedOption = ref(null)

function setQuestion(q) {
  question.id = q?.id ?? null
  question.title = q?.title ?? ''
  question.options = Array.isArray(q?.options) ? q.options : []
  selectedOption.value = null
}

async function startChallenge() {
  loading.value = true; error.value = null
  try {
    const res = await apiStartChallenge({
      simulado: config.simulado,
      categoria: config.categoria,
      dificuldade: config.dificuldade,
      ano: config.ano
    })
    challengeId.value = res.challengeId
    finished.value = !res.question
    setQuestion(res.question)
  } catch (e) {
    error.value = e.message || 'Falha ao iniciar desafio'
    setQuestion(null)
  } finally {
    loading.value = false
  }
}

async function startNewQuestion() {
  // agora busca a próxima questão (não navega)
  if (!challengeId.value) return
  loading.value = true; error.value = null
  try {
    const res = await apiNextQuestion(challengeId.value)
    if (res.finished) {
      finished.value = true
      setQuestion(null)
    } else {
      setQuestion(res.question)
    }
  } catch (e) {
    error.value = e.message || 'Falha ao buscar próxima questão'
  } finally {
    loading.value = false
  }
}

async function confirmAnswer() {
  if (!challengeId.value || !question.id || !selectedOption.value) return
  loading.value = true; error.value = null
  try {
    await apiSubmitAnswer({
      challengeId: challengeId.value,
      questionId: question.id,
      answer: selectedOption.value
    })
    await startNewQuestion()
  } catch (e) {
    error.value = e.message || 'Falha ao enviar resposta'
  } finally {
    loading.value = false
  }
}

async function skipQuestion() {
  if (!challengeId.value || !question.id) return
  loading.value = true; error.value = null
  try {
    await apiSkipQuestion({
      challengeId: challengeId.value,
      questionId: question.id
    })
    await startNewQuestion()
  } catch (e) {
    error.value = e.message || 'Falha ao pular questão'
  } finally {
    loading.value = false
  }
}

/* ---------- Timers ---------- */
// Countdown (questão) — inicia no "Iniciar"
const COUNTDOWN_START = 3 * 60
const secondsLeft = ref(COUNTDOWN_START)

// Count-up (Resumo) — inicia no "Iniciar"
const elapsedSeconds = ref(0)

let countdownTick = null
let elapsedTick = null

onBeforeUnmount(() => stopAllTimers())

/* ---- RESUMO (count-up) ---- */
const resumoParado = ref(true)
function iniciarResumo() {
  if (elapsedTick) { clearInterval(elapsedTick); elapsedTick = null }
  elapsedTick = setInterval(() => { elapsedSeconds.value += 1 }, 1000)
  resumoParado.value = false
}
function pararResumo() {
  if (elapsedTick) { clearInterval(elapsedTick); elapsedTick = null }
  resumoParado.value = true
}
function resetResumo() { pararResumo(); elapsedSeconds.value = 0 }

/* ---- COUNTDOWN (questão) ---- */
function iniciarCountdown() {
  if (countdownTick) { clearInterval(countdownTick); countdownTick = null }
  countdownTick = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value -= 1
      if (secondsLeft.value <= 0) {
        secondsLeft.value = 0
        clearInterval(countdownTick)
        countdownTick = null
      }
    }
  }, 1000)
}
function pararCountdown() { if (countdownTick) { clearInterval(countdownTick); countdownTick = null } }
function resetCountdown() { pararCountdown(); secondsLeft.value = COUNTDOWN_START }

/* ---- Utils ---- */
function stopAllTimers() { pararCountdown(); pararResumo() }
function formatMMSS(t){ const m = Math.floor(t/60).toString().padStart(2,'0'); const s=(t%60).toString().padStart(2,'0'); return `${m}:${s}` }
function formatHHMMSS(t){ const h=Math.floor(t/3600).toString().padStart(2,'0'); const m=Math.floor((t%3600)/60).toString().padStart(2,'0'); const s=(t%60).toString().padStart(2,'0'); return `${h}:${m}:${s}` }

const timeDownMMSS  = computed(() => formatMMSS(secondsLeft.value))       // countdown (MM:SS)
const timeUpHHMMSS  = computed(() => formatHHMMSS(elapsedSeconds.value))  // count-up (HH:MM:SS)

const timerColor = computed(() => {
  if (secondsLeft.value <= 50) return '#ef4444'
  if (secondsLeft.value <= 110) return '#f59e0b'
  return '#22c55e'
})

/* ---------- Ações (antigas rotas removidas) ---------- */
// startNewQuestion(), confirmAnswer() e skipQuestion() já integram com a API

/* Rodapé: para apenas o cronômetro do RESUMO */
function finalizarResumo() { pararResumo() }

/* ---------- Logout ---------- */
function onLogout() {
  doLogout()
  stopAllTimers()
  router.push({ name: 'Login' })
}

// Fecha o menu mobile ao navegar entre rotas
watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
/* ===== Paleta ===== */
:root, :host {
  --c-primary:#1E3A5F;
  --c-accent:#4ADE80;
  --c-bg:#0E2A3E;
  --c-surface:#FFFFFF;
  --c-text:#1F2937;
  --c-high:#FBBF24;
  --bd-soft:rgba(30,58,95,.12);
  --bd-strong:rgba(30,58,95,.18);
  --shadow:0 10px 30px rgba(30,58,95,.10);

  --c-green:#16A34A;
  --c-green-hover:#15803D;
  --c-gold:#D4AF37;
  --c-gold-soft:#FFF7DB;

  --confirm-text:#064E3B; /* texto do botão Confirmar */
}

/* ===== Layout base ===== */
.challenge{
  min-height:100vh;
  height:100vh;
  background:#0d2a3f;
  background-size:400% 400%;
  animation:gradientAnimation 15s ease infinite;
  padding:24px;
  box-sizing:border-box;
  position:relative;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.challenge-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  max-width:1300px;
  margin:0 auto 12px auto;
}
.brand{
  display:flex;
  align-items:center;
  gap:10px;
  color:#ffffff;
  font-weight:700;
  letter-spacing:0.4px;
  font-size:18px;
}
.brand img{ width:36px; height:36px; object-fit:contain; }
.menu-toggle{
  appearance:none; border:none; background:rgba(26,56,80,0.9); color:#ffffff;
  font-weight:600; padding:10px 14px; border-radius:10px; display:none; align-items:center;
  gap:8px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.1); backdrop-filter:blur(10px);
}

.container{ display:grid; grid-template-columns:minmax(240px,280px) 1fr; gap:16px; max-width:1300px; margin:0 auto; flex:1; width:100%; min-height:0; overflow:hidden; }
.sidebar-slot{ height:100%; min-height:0; overflow:hidden; display:flex; flex-direction:column; }
.sidebar-slot > *{ flex:1; min-height:0; height:100%; }
.center{ display:grid; grid-auto-rows:auto auto 1fr auto; min-width:0; } /* rodapé vira última linha */

.header{ padding:12px 16px 0 16px; }
.header h1{ color:#fff; margin:0; font-size:28px; line-height:1.2; }
.header-sub{ margin:4px 0 0 0; color:#cfe8ff; }
.panel{ background:var(--c-surface); border:1px solid var(--bd-soft); border-radius:16px; box-shadow:var(--shadow); }
.panel-config{ padding:16px; margin-top:12px; }
.panel-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px;color: #F1F5F9; }
.panel-top h2{ margin:0; color:var(--c-text); }
.panel-sub{ margin:4px 0 0 0; color:#6b7280; }

/* ===== Botões ===== */
.btn{ --bg:#F1F5F9; --fg:var(--c-text); --bd:var(--bd-strong);
  background:var(--bg); color:var(--fg); border:1px solid var(--bd);
  padding:10px 14px; border-radius:999px; font-weight:700; cursor:pointer; }

.btn-config{
  background-color:#00aa3e; color:#fff; border:none;
  padding:12px 18px; border-radius:999px; font-weight:800;
  box-shadow:0 8px 20px rgba(22,163,74,.25); transition:all .2s ease;
}
.btn-config:hover{ background-color:#00471a; transform:translateY(-1px); box-shadow:0 10px 24px rgba(22,163,74,.30); }
.btn-config:active{ transform:translateY(0); }

/* ===== Grid ===== */
.grid-panels{ display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-top:16px; min-width:0; }
.panel-question{ padding:16px; }
.panel-title{ display:flex; align-items:center; margin-bottom:8px; }
.panel-title .timer{ margin-left:auto; }

/* ===== Timer ===== */
.timer{ font-weight:700; display:flex; align-items:center; gap:6px; }
.dot{ width:10px; height:10px; background:currentColor; border-radius:50%; display:inline-block; }

/* ===== Questão / opções ===== */
.question-card{ background:#fff; border:1px solid var(--bd-soft); border-radius:12px; padding:16px; }
.question-title{ margin:0 0 12px 0; color:#111827; }

.options{ display:grid; gap:10px; }
.option{
  display:flex; align-items:center; gap:10px;
  border:1px solid var(--bd-soft); border-radius:10px;
  padding:12px 14px; background:#FFFFFF; cursor:pointer;
  transition:border-color .2s ease, box-shadow .2s ease, background .2s ease;
}
.option input{ display:none; }

.opt-key{
  width:32px; height:32px; border-radius:50%;
  display:grid; place-items:center; background:#e5e7eb;
  font-weight:800; color:#111827;
}
.option.selected{
  border-color:var(--c-gold);
  background:var(--c-gold-soft);
  box-shadow:0 0 0 3px rgba(212,175,55,.18);
}
.option.selected .opt-key{
  background:#FFF1BF; color:#c9a33a; border:2px solid var(--c-gold);
}
.opt-text{ color:#111827; }

/* Ações (apenas 2 botões) */
.actions-row{
  display:flex; gap:10px; justify-content:flex-end; margin-top:14px; flex-wrap:wrap;
}

/* ===== Resumo ===== */
.panel-summary{ padding:16px; color:#000; background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.12); }
.panel-summary h3{ margin:0 0 12px 0; color:#fff; }
.summary-list{ list-style:none; margin:0; padding:0; display:grid; gap:8px; }
.summary-list li{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; background:rgba(255,255,255,.08); border-radius:10px; }
.summary-list li span{ color:#cfe8ff; }
.summary-list li b{ color:#fff; }

.summary-timer{ margin-top:16px; background:#fff; border-radius:12px; border:1px solid var(--bd-soft); display:grid; place-items:center; padding:24px; }
.clock{ font-size:42px; font-weight:800; color:#1E3A5F; }

/* ===== Rodapé da página ===== */
.page-footer{
  margin-top:16px;
  display:flex;
  justify-content:flex-end;
}
.btn-finish{
  background:#1f2937; color:#fff; border:none;
  padding:12px 18px; border-radius:12px; font-weight:800;
  box-shadow:0 6px 18px rgba(0,0,0,.15);
}
.btn-finish:hover{ background:#111827; }
.btn-finish:disabled{ opacity:.6; cursor:not-allowed; }

/* === Dica (callout) === */
.panel-config .callout{
  margin-top:16px;  
  background:#FFFBEB !important;
  border:1px solid rgba(251,191,36,.5) !important;
  border-radius:12px;
  padding:14px;
}
.panel-config .callout .badge{
  background:#FBBF24 !important;
  color:#92400E !important;
  border-radius:999px;
  padding:6px 10px;
  font-weight:800; font-size:12px; display:inline-flex; align-items:center;
}
.panel-config .callout .callout-body{ color:#92400E !important; }
.panel-config .callout .callout-body p{ margin:0; }

/* Botão Confirmar */
.btn-confirm{
  background: rgb(111, 233, 111);
  color: var(--confirm-text);
  border: 2px solid #006e06;
  box-shadow: 0 6px 18px rgba(45,212,191,.18);
  transition: background-color .2s ease, border-color .2s ease, transform .08s ease, box-shadow .2s ease;
}
.btn-confirm:hover{
  background: rgb(0, 138, 0);
  border-color: #006e06;
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(45,212,191,.25);
}
.btn-confirm:active{ transform: translateY(0); box-shadow: 0 4px 12px rgba(45,212,191,.25); }
.btn-confirm:focus-visible{ outline: 3px solid rgba(45,212,191,.45); outline-offset: 2px; }

/* Botão Pular (hover cinza) */
.btn-skip{
  transition: background-color .2s ease, border-color .2s ease, transform .08s ease, box-shadow .2s ease;
}
.btn-skip:hover{ background:#E5E7EB; border-color: rgba(30,58,95,.28); }
.btn-skip:active{ background:#D1D5DB; }

@media (max-width:1100px){ .container{ grid-template-columns:240px 1fr; } }
@media (max-width:900px){
  .challenge{ padding:12px; height:100vh; overflow:hidden; }
  .challenge-top{
    align-items:center; max-width:none; margin-bottom:12px;
    display:grid; grid-template-columns:auto 1fr auto; /* left: menu, right: brand */
    width:100%;
  }
  .menu-toggle{ display:inline-flex; }
  /* On mobile: brand to the right edge, menu left */
  .challenge-top .brand{ grid-column:3; justify-self:end; }
  .challenge-top .menu-toggle{ grid-column:1; justify-self:start; }

  .container{
    display:flex;
    flex-direction:column;
    gap:12px;
    max-width:none;
    width:100%;
    height:calc(100vh - 24px - 52px - 12px);
    min-height:0;
  }
  .sidebar-slot{ display:none; }
  .grid-panels{ grid-template-columns:1fr; }
}

@media (max-width:480px){
  .challenge{ padding:8px; }
  .challenge-top{ margin-bottom:8px; }
  .brand{ font-size:16px; }
  .brand img{ width:32px; height:32px; }
  .container{ gap:8px; height:calc(100vh - 16px - 48px - 8px); }
}

/* Mobile sidebar overlay/panel */
.fade-enter-active,.fade-leave-active{ transition:opacity 0.2s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
.slide-enter-active,.slide-leave-active{ transition:transform 0.25s ease; }
.slide-enter-from,.slide-leave-to{ transform:translateX(-100%); }
.mobile-sidebar-overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:90; }
.mobile-sidebar-panel{
  position:fixed; top:0; bottom:0; left:0; width:min(300px,85vw);
  background:rgba(16,45,68,0.95); backdrop-filter:blur(10px); padding:12px; z-index:100;
  display:flex; flex-direction:column; box-shadow:6px 0 18px rgba(0,0,0,0.2);
}
.mobile-sidebar-header{ display:flex; justify-content:flex-end; margin-bottom:8px; flex-shrink:0; }
.mobile-sidebar-header .close{ appearance:none; border:none; background:transparent; color:#ffffff; font-size:22px; cursor:pointer; padding:6px; line-height:1; }
.mobile-sidebar-panel :deep(.sidebar){ flex:1; border-radius:12px; min-height:0; }

/* Overrides para caber 100% da viewport no desktop */
.center{ display:grid; grid-template-rows:auto auto 1fr auto; min-width:0; min-height:0; height:100%; background:rgba(207, 207, 207, 0.589); border:1px solid rgba(255,255,255,.12); border-radius:16px; overflow:hidden; }
.grid-panels{ height:100%; min-height:0; overflow:hidden; }
.panel-question{ display:flex; flex-direction:column; min-height:0; }
.question-card{ flex:1; min-height:0; overflow:auto; }
.panel-summary{ min-height:0; overflow:auto; }
* { box-sizing:border-box; }
html, body { overflow-x:hidden; }

@keyframes gradientAnimation{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
</style>
