<template>
  <div class="challenge">
    <div class="container">
      <AppSidebar @logout="onLogout" />

      <div class="center">
        <!-- Topbar sem ícone -->
        <header class="topbar">
          <div class="brand">
            <div class="brand-text">
              <h1>Modo Desafio</h1>
              <p class="subtitle">Simulados, foco e progresso contínuo.</p>
            </div>
          </div>
        </header>

        <main class="content">
          <section class="panel">
            <header class="panel-header with-action">
              <div>
                <h2>Configurar Desafio</h2>
                <p>Escolha o simulado e a categoria para começar sua prática.</p>
              </div>
              <button class="btn" @click="openConfig">Configurar Desafio</button>
            </header>

            <!-- Resumo -->
            <div class="chips">
              <span class="chip">Simulado: {{ labelSimulado }}</span>
              <span class="chip">Matéria: {{ labelCategoria }}</span>
              <span class="chip">Dificuldade: {{ labelDificuldade }}</span>
              <span class="chip">Ano: {{ config.ano }}</span>
            </div>

            <div class="callout">
              <div class="badge" aria-hidden="true">💡 Dica</div>
              <div class="callout-body">
                <h3>Pronto para o desafio?</h3>
                <p>Você fará questões no formato do simulado escolhido. Receba feedback imediato e acompanhe sua performance.</p>
              </div>
            </div>

            <div class="actions">
              <button class="btn btn-primary" @click="startNewQuestion">
                Iniciar Nova Questão
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- MODAL -->
    <ChallengeConfigModal
      v-model="showModal"
      :initial="config"
      :simulados="simulados"
      :categoriasPorSimulado="categoriasPorSimulado"
      @apply="applyConfig"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ChallengeConfigModal from '@/components/challenge/ChallengeConfigModal.vue'
import { logout as doLogout } from '@/services/auth.js'

const router = useRouter()

/* Opções */
const simulados = [
  { label: 'Simulado Misturado ENEM', value: 'enem-mix' },
  { label: 'ENEM 2022 (Completo)', value: 'enem-2022' },
  { label: 'FUVEST (Treino)', value: 'fuvest' },
  { label: 'UNICAMP (Treino)', value: 'unicamp' },
]
const categoriasBase = [
  { label: 'Todas as matérias', value: 'todas' },
  { label: 'Matemática', value: 'matematica' },
  { label: 'Linguagens', value: 'linguagens' },
  { label: 'Ciências da Natureza', value: 'natureza' },
  { label: 'Ciências Humanas', value: 'humanas' },
]
const categoriasPorSimulado = computed(() => ({
  'enem-mix': categoriasBase,
  'enem-2022': [
    { label: 'Todas as matérias', value: 'todas' },
    { label: '1º dia (Linguagens e Humanas)', value: '1dia' },
    { label: '2º dia (Natureza e Matemática)', value: '2dia' },
  ],
  'fuvest': [
    { label: 'Primeira fase', value: 'fase1' },
    { label: 'Segunda fase', value: 'fase2' },
  ],
  'unicamp': [
    { label: 'Prova 1', value: 'p1' },
    { label: 'Prova 2', value: 'p2' },
  ],
  default: categoriasBase,
}))

/* Configuração atual */
const config = reactive({
  simulado: 'enem-mix',
  categoria: 'todas',
  dificuldade: 'medio',
  ano: new Date().getFullYear(),
})

/* Labels reativos (evita erros silenciosos) */
const labelSimulado = computed(
  () => simulados.find(s => s.value === config.simulado)?.label || '—'
)
const labelCategoria = computed(() => {
  const list = categoriasPorSimulado.value[config.simulado] || categoriasBase
  return list.find(c => c.value === config.categoria)?.label || '—'
})
const labelDificuldade = computed(
  () => ({ facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' }[config.dificuldade] || '—'
))

/* Modal */
const showModal = ref(false)
function openConfig() { showModal.value = true }
function applyConfig(payload) { Object.assign(config, payload) }

/* Navegação */
function startNewQuestion() {
  router.push({
    path: '/challenge/questions/1',
    query: {
      simulado: config.simulado,
      categoria: config.categoria,
      dificuldade: config.dificuldade,
      ano: String(config.ano),
    },
  })
}

/* Logout */
function onLogout() {
  doLogout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
:root,
:host {
  --c-primary: #1E3A5F; --c-accent: #4ADE80; --c-bg: #F9FAFB; --c-surface: #FFFFFF; --c-text: #1F2937; --c-high: #FBBF24;
  --bd-soft: rgba(30,58,95,.12); --bd-strong: rgba(30,58,95,.18); --shadow: 0 10px 30px rgba(30,58,95,.10);
  --focus: 0 0 0 3px rgba(74,222,128,.45);
}

/* Sem scroll horizontal */
.challenge { height: 100dvh; background:#0d2a3f; background-size:400% 400%; animation:gradientAnimation 15s ease infinite;
  padding:24px; box-sizing:border-box; overflow-x:hidden; }
.container { display:grid; grid-template-columns:280px 1fr; gap:16px; max-width:1300px; width:100%; margin:0 auto; height:calc(100% - 16px); }
.center { display:grid; grid-template-rows:auto 1fr; min-width:0; }

.topbar { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--c-surface); border:1px solid var(--bd-soft); border-radius:12px; }
.brand { display:flex; align-items:center; gap:12px; }
.brand-text h1 { margin:0; font-size:22px; line-height:1.2; color:var(--c-primary); }
.subtitle { margin:2px 0 0 0; color:#475569; font-size:13px; }

.content { padding:16px 0; overflow:auto; overflow-x:hidden; }
.panel { width:100%; background:var(--c-surface); border:1px solid var(--bd-soft); border-radius:16px; padding:20px; box-shadow:var(--shadow); box-sizing:border-box; }
.panel-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.panel-header h2 { margin:0 0 4px 0; font-size:20px; color:var(--c-primary); }
.panel-header p { margin:0; color:#4B5563; font-size:14px; }

.chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.chip { background:#F1F5F9; border:1px solid var(--bd-soft); color:var(--c-text); padding:6px 10px; border-radius:999px; font-size:12px; }

.callout { display:grid; grid-template-columns:auto 1fr; gap:12px; align-items:start; margin-top:16px; padding:14px; border-radius:12px; background:#FFFBEB; border:1px solid rgba(251,191,36,.5); box-sizing:border-box; }
.badge { align-self:start; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700; color:#92400E; background:var(--c-high); }
.callout-body h3 { margin:0 0 6px 0; color:#78350F; font-size:16px; }
.callout-body p { margin:0; color:#92400E; font-size:14px; }

.actions { display:flex; justify-content:flex-end; gap:12px; margin-top:18px; }
.btn { --btn-bg:#F1F5F9; --btn-fg:var(--c-text); --btn-bd:var(--bd-strong);
  display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px;
  border:1px solid var(--btn-bd); background:var(--btn-bg); color:var(--btn-fg); font-weight:600; font-size:14px; cursor:pointer;
}
.btn:focus-visible { box-shadow: var(--focus); }
.btn-primary { --btn-bg:var(--c-accent); --btn-fg:#0B3B2B; --btn-bd:transparent; border:1px solid transparent; }

@keyframes gradientAnimation { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@media (max-width:1100px) { .container { grid-template-columns:240px 1fr; } }
@media (max-width:900px) { .container { grid-template-columns:1fr; } }
</style>
