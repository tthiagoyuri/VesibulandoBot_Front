<template>
  <teleport to="body">
    <div v-if="modelValue" class="overlay" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="cfg-title">
        <header class="modal-header">
          <h2 id="cfg-title">Configurar Desafio</h2>
          <button class="icon-btn" @click="close" aria-label="Fechar">✕</button>
        </header>

        <section class="modal-body">
          <div class="grid">
            <!-- Simulado -->
            <div class="field">
              <label for="m-simulado">Simulado</label>
              <select id="m-simulado" v-model="local.simulado">
                <option v-for="opt in simulados" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <!-- Matéria / Categoria -->
            <div class="field">
              <label for="m-categoria">Matéria / Categoria</label>
              <select id="m-categoria" v-model="local.categoria">
                <option v-for="opt in categorias" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <!-- Dificuldade -->
            <div class="field">
              <label for="m-dif">Nível de dificuldade</label>
              <select id="m-dif" v-model="local.dificuldade">
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <!-- Ano da prova -->
            <div class="field">
              <label for="m-ano">Ano da prova</label>
              <select id="m-ano" v-model="local.ano">
                <option v-for="y in anos" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>
        </section>

        <footer class="modal-footer">
          <button class="btn" @click="close">Cancelar</button>
          <button class="btn btn-primary" @click="apply">Salvar</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  initial: {
    type: Object,
    default: () => ({
      simulado: 'enem-mix',
      categoria: 'todas',
      dificuldade: 'medio',
      ano: new Date().getFullYear()
    })
  },
  // Em templates o ref é desenv. automaticamente; então aqui chega como objeto
  simulados: { type: Array, required: true },
  categoriasPorSimulado: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue', 'apply'])

/* ----- Estado local ----- */
const local = reactive({
  simulado: props.initial.simulado,
  categoria: props.initial.categoria,
  dificuldade: props.initial.dificuldade,
  ano: props.initial.ano
})

/* ----- Categorias disponíveis p/ o simulado selecionado ----- */
const categorias = computed(() => {
  const map = props.categoriasPorSimulado || {}
  return map[local.simulado] || map.default || []
})

/* ----- Helpers ----- */
function ensureCategoriaValida() {
  if (!categorias.value.length) return
  if (!categorias.value.find(c => c.value === local.categoria)) {
    local.categoria = categorias.value[0].value
  }
}
function resetFromInitial() {
  Object.assign(local, props.initial || {})
  ensureCategoriaValida()
}

/* ----- Watches ----- */
// Quando abrir a modal (ou mudar initial no pai), sincroniza o estado
watch(() => props.modelValue, (open) => {
  if (open) resetFromInitial()
})
watch(() => props.initial, () => resetFromInitial(), { deep: true })

// Se o simulado mudar, garante categoria válida
watch(() => local.simulado, () => ensureCategoriaValida())

/* ----- Anos ----- */
const currentYear = new Date().getFullYear()
const anos = computed(() => {
  const arr = []
  for (let y = currentYear; y >= 2015; y--) arr.push(y)
  return arr
})

/* ----- Ações ----- */
function close() { emit('update:modelValue', false) }
function apply() { emit('apply', { ...local }); close() }
</script>

<style scoped>
:root,
:host {
  --c-primary:#1E3A5F; --c-accent:#4ADE80; --c-bg:#F9FAFB; --c-surface:#FFFFFF; --c-text:#1F2937;
  --bd-soft:rgba(30,58,95,.12); --bd-strong:rgba(30,58,95,.18); --focus:0 0 0 3px rgba(74,222,128,.45);
}

.overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.55);
  display: grid; place-items: center; padding: 24px; z-index: 1000;
  overflow-y: auto; overflow-x: hidden;
}
.modal {
  width: min(760px, 100%); background: var(--c-surface);
  border: 1px solid var(--bd-soft); border-radius: 16px;
  box-shadow: 0 30px 80px rgba(2,6,23,.35); color: var(--c-text);
}
.modal-header {
  display:flex; justify-content:space-between; align-items:center;
  padding:16px 18px; border-bottom:1px solid var(--bd-soft);
}
.modal-header h2 { margin:0; color:var(--c-primary); font-size:20px; }
.icon-btn {
  border:1px solid var(--bd-soft); background:#F3F4F6; color:#111827;
  border-radius:8px; padding:6px 10px; cursor:pointer;
}
.icon-btn:hover { background:#E5E7EB; }

.modal-body { padding:16px 18px; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.field { display:grid; gap:8px; }
.field label { font-size:13px; color:#475569; }
select {
  appearance:none; width:100%; padding:12px 14px; border-radius:12px;
  border:1px solid var(--bd-strong); background:#F8FAFC; color: var(--c-text);
  font-size:14px; outline:none;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--c-primary) 50%),
    linear-gradient(135deg, var(--c-primary) 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(1em + 2px),
                      calc(100% - 13px) calc(1em + 2px);
  background-size: 6px 6px, 6px 6px; background-repeat: no-repeat;
  transition: border-color .2s, box-shadow .2s, background .2s;
}
select:hover { border-color: var(--c-primary); background:#FFFFFF; }
select:focus { box-shadow: var(--focus); border-color: var(--c-accent); }

.modal-footer {
  display:flex; justify-content:flex-end; gap:12px;
  padding:16px 18px; border-top:1px solid var(--bd-soft);
}
.btn {
  --btn-bg:#F1F5F9; --btn-fg:var(--c-text); --btn-bd:var(--bd-strong);
  border:1px solid var(--btn-bd); background:var(--btn-bg); color:var(--btn-fg);
  border-radius:12px; padding:10px 14px; font-weight:600; cursor:pointer;
}
.btn:focus-visible { box-shadow: var(--focus); }
.btn-primary { --btn-bg:var(--c-accent); --btn-fg:#0B3B2B; --btn-bd:transparent; border:1px solid transparent; }

@media (max-width: 720px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
