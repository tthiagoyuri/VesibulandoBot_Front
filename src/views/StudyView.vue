<template>
  <div class="study">
    <div class="container">
      <!-- Coluna Esquerda -->
      <AppSidebar
        @logout="onLogout"
      />

      <!-- Área Central (Chat) -->
      <ChatWindow
        :messages="messages"
        :sending="sending"
        @send="handleSend"
      />

      <!-- Coluna Direita (Perguntas rápidas) -->
      <QuickQuestions @pick="handleQuickPick" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../services/auth.js'
import { sendMessageToBot } from '../services/chat.js'

import AppSidebar from '../components/layout/AppSidebar.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import QuickQuestions from '../components/quick/QuickQuestions.vue'

const router = useRouter()
const user = ref(getCurrentUser())
const messages = ref([]) // { from: 'bot'|'user', text: string, at: number }
const sending = ref(false)

onMounted(() => {
  if (!user.value) {
    router.push({ name: 'Login' })
    return
  }
  // Mensagem de boas-vindas
  messages.value.push({
    from: 'bot',
    text: `Olá, ${user.value.name}! Bem-vindo ao Modo Estudo. O que quer revisar hoje?`,
    at: Date.now(),
  })
})

function formatUserText(text) {
  return (text || '').trim()
}

async function handleSend(text) {
  const clean = formatUserText(text)
  if (!clean) return

  messages.value.push({ from: 'user', text: clean, at: Date.now() })
  sending.value = true

  const reply = await sendMessageToBot(clean)
  messages.value.push({ from: 'bot', text: reply, at: Date.now() })
  sending.value = false
}

function handleQuickPick(text) {
  handleSend(text)
}

function onLogout() {
  logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.study {
  height: 100dvh;              
  background: #0d2a3f;
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 24px;            
  box-sizing: border-box;
}

.container {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 16px;
  max-width: 1300px;
  margin: 0 auto;
  height: calc(100% - 16px); 
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 1100px) {
  .container { grid-template-columns: 240px 1fr 240px; }
}
@media (max-width: 900px) {
  .container { grid-template-columns: 1fr; }
}
</style>
