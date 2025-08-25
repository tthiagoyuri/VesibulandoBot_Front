<template>
  <section class="chat">
    <header class="chat-header">
      <h2>Chat</h2>
      <span class="status" :class="status">
        <!-- Ícone aparece só quando digitando -->
        <i v-if="status === 'digitando'" class="fa-solid fa-comment-dots"></i>
        {{ label }}
      </span>
    </header>

    <div class="messages" ref="listEl">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="msg"
        :class="m.from"
      >
        <div class="bubble">
          <p class="text">{{ m.text }}</p>
          <span class="time">{{ formatTime(m.at) }}</span>
        </div>
      </div>
    </div>

    <form class="composer" @submit.prevent="submit">
      <input
        v-model.trim="draft"
        type="text"
        placeholder="Digite sua pergunta..."
        :disabled="sending"
        @input="onTyping"
      />
      <button type="submit" :disabled="sending || !draft">Enviar</button>
    </form>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  sending: { type: Boolean, default: false }
})
const emit = defineEmits(['send'])

const draft = ref('')
const listEl = ref(null)
const status = ref('enviado') // 'digitando' | 'enviando' | 'enviado'

function submit() {
  if (!draft.value) return
  emit('send', draft.value)
  draft.value = ''
  status.value = 'enviando'
}

function onTyping() {
  status.value = draft.value ? 'digitando' : 'enviado'
}

watch(() => props.sending, (val) => {
  if (val) {
    status.value = 'enviando'
  } else if (!draft.value) {
    status.value = 'enviado'
  }
})

watch(() => props.messages.length, async () => {
  await nextTick()
  autoScroll()
})

function autoScroll() {
  const el = listEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function two(n) { return n.toString().padStart(2, '0') }
function formatTime(ts) {
  const d = new Date(ts)
  return `${two(d.getHours())}:${two(d.getMinutes())}`
}

const label = computed(() => {
  switch (status.value) {
    case 'digitando': return 'Digitando'
    case 'enviando': return 'Enviando...'
    default: return 'Enviado'
  }
})
</script>

<style scoped>
.chat {
  background: #e5eaf1;
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: calc(100vh - 48px);
  height: 100%;
  min-height: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 10px;
  border-bottom: 1px solid #909192;
}
.status {
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
}
.status.digitando {
  color: #2563eb; /* azul para digitando */
}
.status.enviando {
  color: #f59e0b; /* laranja para enviando */
}
.status.enviado {
  color: #10b981; /* verde para enviado */
}

.messages {
  overflow-y: auto;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.msg {
  display: flex;
  width: auto;
  max-width: 80%;
}

.msg.user {
  align-self: flex-end;
}

.msg.bot {
  align-self: flex-start; 
}

.bubble {
  display: inline-block;
  background: #f3f4f6;
  border-radius: 14px;
  padding: 10px 12px;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 80%; 
}
.msg.user .bubble {
  background:#069483;
  color: white;
}
.text { 
    margin: 0 0 6px; white-space: pre-wrap; word-break: break-word; 
}
.time {
  font-size: 11px;
  opacity: .8;
  display: block;
  text-align: right;
}

.composer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}
input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}
button {
  background: #1c3d56;
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}
button:disabled { opacity: .6; cursor: not-allowed; }
</style>
