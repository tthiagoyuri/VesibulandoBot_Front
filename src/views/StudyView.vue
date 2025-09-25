<template>
  <div class="study">
    <header class="study-top">
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
      <div class="sidebar-slot">
        <AppSidebar @logout="onLogout" />
      </div>

      <div class="chat-slot">
        <ChatWindow
          :messages="messages"
          :sending="sending"
          @send="handleSend"
        />
      </div>

      <div class="quick-slot">
        <QuickQuestions @pick="handleQuickPick" />
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, logout } from '../services/auth.js'
import { sendMessageToBot } from '../services/chat.js'

import AppSidebar from '../components/layout/AppSidebar.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import QuickQuestions from '../components/quick/QuickQuestions.vue'
import logoUrl from '../assets/Icone.ico'

const router = useRouter()
const route = useRoute()
const user = ref(null)
const messages = ref([]) // { from: 'bot'|'user', text: string, at: number }
const sending = ref(false)
const sidebarOpen = ref(false)
const logo = logoUrl

onMounted(async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    router.push({ name: 'Login' })
    return
  }

  user.value = currentUser
  const displayName = currentUser.name || currentUser.email || 'estudante'
  messages.value.push({
    from: 'bot',
    text: 'Ola, ' + displayName + '! Bem-vindo ao Modo Estudo. O que quer revisar hoje?',
    at: Date.now(),
  })
})

watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

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

function formatUserText(text) {
  return (text || '').trim()
}

async function handleSend(text) {
  const clean = formatUserText(text)
  if (!clean) return

  messages.value.push({ from: 'user', text: clean, at: Date.now() })
  sending.value = true

  try {
    const reply = await sendMessageToBot(clean)
    messages.value.push({ from: 'bot', text: reply, at: Date.now() })
  } catch (error) {
    console.error('Erro ao enviar mensagem para o bot', error)
    messages.value.push({
      from: 'bot',
      text: 'Nao consegui responder agora. Tente novamente em instantes.',
      at: Date.now(),
    })
  } finally {
    sending.value = false
  }
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
  height: 100vh;
  background: #0d2a3f;
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  padding: 24px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

.study-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 1300px;
  margin: 0 auto 16px;
  width: 100%;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.brand img {
  width: 36px;
  height: 36px;
}

.menu-toggle {
  appearance: none;
  border: none;
  background: #1a3850;
  color: #ffffff;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 10px;
  display: none;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.container {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 16px;
  max-width: 1300px;
  margin:  auto;
  flex: 1;
  width: 100%;
  min-height: 0;
  height: calc(100vh - 24px - 52px - 16px - 24px);
}

.sidebar-slot {
  height: 100%;
  overflow: hidden;
}

.sidebar-slot > * {
  height: 100%;
}

.chat-slot {
  height: 100%;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.chat-slot > * {
  flex: 1;
  min-height: 0;
  height: 100%;
}

.quick-slot {
  height: 100%;
  overflow: hidden;
}

.quick-slot > * {
  height: 100%;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.mobile-sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 90;
}

.mobile-sidebar-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  max-width: 85%;
  background: #102d44;
  padding: 12px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: 6px 0 18px rgba(0,0,0,0.2);
}

.mobile-sidebar-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.mobile-sidebar-header .close {
  appearance: none;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 22px;
  cursor: pointer;
  padding: 6px;
  line-height: 1;
}

.mobile-sidebar-panel :deep(.sidebar) {
  height: 100%;
  border-radius: 12px;
}

@media (max-width: 1100px) {
  .container { 
    grid-template-columns: 240px 1fr 240px; 
  }
}

@media (max-width: 900px) {
  .study {
    padding: 16px 12px 24px;
  }

  .study-top {
    align-items: center;
    max-width: 620px;
  }

  .menu-toggle {
    display: inline-flex;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 620px;
    width: 100%;
    min-height: 0;
    flex: 1;
    height: calc(100vh - 16px - 52px - 16px - 24px);
  }

  .chat-slot {
    flex: 1;
    min-height: 0;
  }

  .chat-slot > * {
    flex: 1;
    min-height: 0;
    height: 100%;
  }

  .sidebar-slot {
    display: none;
  }

  .quick-slot {
    display: none;
  }
}
</style>
