<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo">🎓</div>
      <div class="title">VestibulandoBot</div>
    </div>

    <div class="user">
      <div class="avatar">{{ initials }}</div>
      <div class="name">{{ user?.name || 'Usuário' }}</div>
      <div class="email">{{ user?.email }}</div>
    </div>

    <nav class="nav">
      <RouterLink class="link" :to="{ name: 'Study' }">Modo Estudo</RouterLink>
      <RouterLink class="link" :to="{ name: 'Challenge' }">Modo Desafio</RouterLink>
      <RouterLink class="link" :to="{ name: 'Performance' }">Performance</RouterLink>
      <RouterLink class="link" :to="{ name: 'Admin' }">Administração</RouterLink>
    </nav>

    <button class="logout" @click="$emit('logout')">Sair</button>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  user: { type: Object, default: null }
})

const initials = computed(() => {
  if (!props.user?.name) return 'VB'
  const parts = props.user.name.split(/[.\s_-]+/)
  const ini = parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
  return ini || 'VB'
})
</script>

<style scoped>
.sidebar {
  background: #ffffffd9;
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 16px;
  min-height: calc(100vh - 48px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo { font-size: 28px; }
.title { font-weight: 800; letter-spacing: .3px; }

.user {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #42b983;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.name { font-weight: 700; }
.email { font-size: 12px; color: #6b7280; }

.nav { display: grid; gap: 8px; }
.link {
  display: block;
  background: #f3f4f6;
  color: #111827;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  transition: background .2s;
}
.link:hover { background: #e5e7eb; }

.logout {
  background: #ef4444;
  color: #fff;
  border: 0;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
</style>
