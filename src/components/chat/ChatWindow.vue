<template>
  <section class="chat">
    <header class="chat-header">
      <h2>Chat</h2>
      <span class="status" :class="{ online: !sending }">
        {{ sending ? 'Enviando...' : 'Pronto' }}
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
      />
      <button type="submit" :disabled="sending || !draft">Enviar</button>
    </form>
  </section>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  sending: { type: Boolean, default: false }
})
const emit = defineEmits(['send'])

const draft = ref('')
const listEl = ref(null)

function submit() {
  const text = draft.value
  if (!text) return
  emit('send', text)
  draft.value = ''
}

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
</script>

<style scoped>
.chat {
  background: #ffffffd9;
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: calc(100vh - 48px);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 10px;
  border-bottom: 1px solid #e5e7eb;
}
.status { font-size: 12px; color: #6b7280; }
.status.online { color: #10b981; }

.messages {
  overflow-y: auto;
  padding: 12px 6px;
  display: grid;
  gap: 10px;
}

.msg {
  display: flex;
}
.msg.user { justify-content: flex-end; }
.msg.bot { justify-content: flex-start; }

.bubble {
  max-width: 70%;
  background: #f3f4f6;
  border-radius: 14px;
  padding: 10px 12px;
  position: relative;
}
.msg.user .bubble {
  background: #42b983;
  color: white;
}
.text { margin: 0 0 6px; white-space: pre-wrap; word-break: break-word; }
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
  background: #111827;
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}
button:disabled { opacity: .6; cursor: not-allowed; }
</style>
