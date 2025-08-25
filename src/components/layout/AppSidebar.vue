<template>
  <aside class="sidebar">
    <div class="brand">
      <i class="fa-solid fa-graduation-cap logo"></i>
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
  background: #1a3850;
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 16px;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo { 
  font-size: 28px; 
  color: #ffffff;
}
.title { 
  font-weight: 800; 
  letter-spacing: .3px; 
  color: #ffffff;
}

.user {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
  text-align: center;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #079685;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
  margin: 0 auto;
}
.name { 
  font-weight: 700;
}
.email { 
  font-size: 12px; 
  color: #6b7280; 
}

.nav { 
  display: grid; 
  gap: 12px;
}

.link {
  display: flex;                /* Flex para centralizar */
  align-items: center;          /* Centraliza vertical */
  justify-content: center;      /* Centraliza horizontal */
  background: #f3f4f6;
  color: #111827;
  padding: 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s, transform 0.1s;
}

/* Hover bonito */
.link:hover {
  background-color: #079685;
  color: #fff;
}

/* Efeito clique */
.link:active {
  transform: scale(0.97);
}

/* Quando ativo pela rota */
.link.router-link-exact-active {
  background-color: #079685;
  color: #fff;
  font-weight: bold;
}

.logout {
  background: #ef4444;
  color: #fff;
  border: 0;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}
.logout:hover {
  background-color: #ff0000;
}
</style>
