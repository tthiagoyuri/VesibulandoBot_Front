<template>
  <div class="challenge">
    <div class="container">
      <!-- Sidebar -->
      <AppSidebar @logout="onLogout" />

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
              <p class="panel-sub">Simulados, foco e progresso contínuo. Mude as opções quando quiser.<p></p></p>
            </div>
            <button class="btn btn-accent" @click="openConfig">Configurar desafio</button>
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
              <!-- À direita + cor dinâmica via inline style -->
              <div class="timer" :style="{ color: timerColor }">
                <i class="dot" /> {{ timeDownMMSS }}
              </div>
            </div>

            <article class="question-card">
              <h4 class="question-title">{{ question.title }}</h4>

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

              <div class="actions-row">
                <button class="btn" @click="openConfig">Cancelar</button>
                <button class="btn btn-accent" @click="confirmAnswer">Confirmar</button>
                <button class="btn" @click="skipQuestion">Pular</button>
                <button class="btn" @click="finishChallenge">Finalizar</button>
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
              <li><span>Ano</span><b>{{ config.ano }}</b></li>
            </ul>
            <div class="summary-timer">
              <div class="clock">{{ timeUpMMSS }}</div>
            </div>
          </aside>
        </section>
      </div>
    </div>

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
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ChallengeConfigModal from '@/components/challenge/ChallengeConfigModal.vue'
import { logout as doLogout } from '@/services/auth.js'

const router = useRouter()

/* ---------- Opções ---------- */
const simulados = [
  { label: 'Simulado Misturado ENEM', value: 'enem-mix' },
  { label: 'ENEM 2022 (Completo)', value: 'enem-2022' },
  { label: 'FUVEST (Treino)', value: 'fuvest' },
  { label: 'UNICAMP (Treino)', value: 'unicamp' }
]

/* ---------- Config ---------- */
const config = reactive({
  simulado: 'enem-mix',
  categoria: 'todas',
  dificuldade: 'medio',
  ano: new Date().getFullYear(),
  simuladoLabel: simulados.find(s => s.value === 'enem-mix')?.label || 'Simulado Misturado ENEM',
  categoriaLabel: 'Todas as matérias',
  dificuldadeLabel: 'Médio'
})

const labelSimulado = computed(() =>
  config.simuladoLabel || simulados.find(s => s.value === config.simulado)?.label || '—'
)
const labelCategoria = computed(() => config.categoriaLabel || '—')
const labelDificuldade = computed(() =>
  config.dificuldadeLabel || ({ facil:'Fácil', medio:'Médio', dificil:'Difícil' }[config.dificuldade] || '—')
)

/* ---------- Modal ---------- */
const showModal = ref(false)
function openConfig() { showModal.value = true }
function applyConfig(payload) { Object.assign(config, payload) }

/* ---------- Questão (demo) ---------- */
const question = reactive({
  title: 'Qual é a fórmula para calcular a área de um triângulo?',
  options: [
    { key: 'A', text: 'A = (base × altura) ÷ 2' },
    { key: 'B', text: 'A = base × altura' },
    { key: 'C', text: 'A = (base + altura) ÷ 2' }
  ]
})
const selectedOption = ref('A')

/* ---------- Timers ---------- */
const COUNTDOWN_START = 3 * 60 // 03:00
const secondsLeft = ref(COUNTDOWN_START) // countdown
const elapsedSeconds = ref(0)           // count-up (resumo)

let countdownTick = null
let elapsedTick = null

onMounted(() => {
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

  elapsedTick = setInterval(() => {
    elapsedSeconds.value += 1
  }, 1000)
})

onBeforeUnmount(() => stopAllTimers())
function stopAllTimers() {
  if (countdownTick) { clearInterval(countdownTick); countdownTick = null }
  if (elapsedTick) { clearInterval(elapsedTick); elapsedTick = null }
}

function formatMMSS(t) {
  const m = Math.floor(t / 60).toString().padStart(2, '0')
  const s = (t % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const timeDownMMSS = computed(() => formatMMSS(secondsLeft.value))
const timeUpMMSS   = computed(() => formatMMSS(elapsedSeconds.value))

// Cor via inline style (vence qualquer CSS conflitante)
const timerColor = computed(() => {
  // ≤ 50s -> vermelho; ≤ 110s (01:50) -> amarelo; senão -> verde
  if (secondsLeft.value <= 50) return '#ef4444' // red-500
  if (secondsLeft.value <= 110) return '#f59e0b' // amber-500
  return '#22c55e' // green-500
})

/* ---------- Navegação ---------- */
function startNewQuestion() {
  router.push({
    path: '/challenge/questions/1',
    query: {
      simulado: config.simulado,
      categoria: config.categoria,
      dificuldade: config.dificuldade,
      ano: String(config.ano)
    }
  })
}
function confirmAnswer() { startNewQuestion() }
function skipQuestion()   { startNewQuestion() }
function finishChallenge(){ stopAllTimers(); router.push({ name: 'Performance' }) }

/* ---------- Logout ---------- */
function onLogout() {
  doLogout()
  stopAllTimers()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
/* ===== Paleta ===== */
:root, :host {
  --c-primary:#1E3A5F;
  --c-accent:#4ADE80;
  --c-bg:#F9FAFB;
  --c-surface:#FFFFFF;
  --c-text:#1F2937;
  --c-high:#FBBF24;
  --bd-soft:rgba(30,58,95,.12);
  --bd-strong:rgba(30,58,95,.18);
  --shadow:0 10px 30px rgba(30,58,95,.10);
}

/* ===== Layout base ===== */
.challenge{ height:100dvh; background:#0d2a3f; background-size:400% 400%; animation:gradientAnimation 15s ease infinite; padding:24px; box-sizing:border-box; overflow-x:hidden; }
.container{ display:grid; grid-template-columns:280px 1fr; gap:16px; max-width:1300px; margin:0 auto; height:calc(100% - 16px); }
.center{ display:grid; grid-auto-rows:auto auto 1fr; min-width:0; }

/* Cabeçalho / painel / etc. */
.header h1{ color:#fff; margin:0; font-size:28px; line-height:1.2; }
.header-sub{ margin:4px 0 0 0; color:#cfe8ff; }
.panel{ background:var(--c-surface); border:1px solid var(--bd-soft); border-radius:16px; box-shadow:var(--shadow); }
.panel-config{ padding:16px; margin-top:12px; }
.panel-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; color:#ECFDF5; }
.panel-top h2{ margin:0; color:var(--c-text); }
.panel-sub{ margin:4px 0 0 0; color:#6b7280; }
.btn{ --bg:#F1F5F9; --fg:var(--c-text); --bd:var(--bd-strong); background:var(--bg); color:var(--fg); border:1px solid var(--bd); padding:10px 14px; border-radius:999px; font-weight:700; cursor:pointer; }
.btn-accent{ --bg:var(--c-accent); --fg:#0B3B2B; --bd:transparent; border:1px solid transparent; }

.grid-panels{ display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-top:16px; min-width:0; }
.panel-question{ padding:16px; }
.panel-title{
  display:flex; align-items:center; margin-bottom:8px;
}
.panel-title .timer{ margin-left:auto; } /* empurra o timer para a direita */

/* Timer (sem cor fixa; usa inline style) */
.timer{
  font-weight:700; display:flex; align-items:center; gap:6px;
}
.dot{ width:10px; height:10px; background:currentColor; border-radius:50%; display:inline-block; }

.question-card{ background:#fff; border:1px solid var(--bd-soft); border-radius:12px; padding:16px; }
.question-title{ margin:0 0 12px 0; color:#111827; }

.options{ display:grid; gap:10px; }
.option{ display:flex; align-items:center; gap:10px; border:1px solid var(--bd-soft); border-radius:10px; padding:10px 12px; background:#F8FAFC; cursor:pointer; }
.option input{ display:none; }
.option.selected{ border-color:var(--c-accent); background:#ECFDF5; }
.opt-key{ width:28px; height:28px; border-radius:50%; display:grid; place-items:center; background:#e5e7eb; font-weight:800; color:#111827; }
.option.selected .opt-key{ background:var(--c-accent); color:#0B3B2B; }
.opt-text{ color:#111827; }

.actions-row{ display:flex; gap:10px; justify-content:flex-end; margin-top:14px; flex-wrap:wrap; }

.panel-summary{ padding:16px; color:#000; background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.12); }
.panel-summary h3{ margin:0 0 12px 0; color:#fff; }
.summary-list{ list-style:none; margin:0; padding:0; display:grid; gap:8px; }
.summary-list li{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; background:rgba(255,255,255,.08); border-radius:10px; }
.summary-list li span{ color:#cfe8ff; }
.summary-list li b{ color:#fff; }

.summary-timer{ margin-top:16px; background:#fff; border-radius:12px; border:1px solid var(--bd-soft); display:grid; place-items:center; padding:24px; }
.clock{ font-size:42px; font-weight:800; color:var(--c-primary); }

@media (max-width:1100px){ .container{ grid-template-columns:240px 1fr; } }
@media (max-width:900px){ .container{ grid-template-columns:1fr; } .grid-panels{ grid-template-columns:1fr; } }

@keyframes gradientAnimation{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
.panel-config .callout{
  background:#FFFBEB !important;                  /* amarelo claro */
  border:1px solid rgba(251,191,36,.5) !important;/* borda amarela */
  border-radius:12px;
  padding:14px;
}

.panel-config .callout .badge{
  background:#FBBF24 !important;  /* pílula amarela */
  color:#92400E !important;
  border-radius:999px;
  padding:6px 10px;
  font-weight:800;
  font-size:12px;
  display:inline-flex;
  align-items:center;
}

.panel-config .callout .callout-body{
  color:#92400E !important;       /* texto marrom */
}

/* garante espaçamento/estética */
.panel-config .callout .callout-body p{ margin:0; }
</style>
