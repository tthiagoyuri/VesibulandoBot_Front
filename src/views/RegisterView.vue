<template>
  <div class="auth">
    <SiteHeader />
    <div class="center">
      <div class="card">
        <h1>Criar conta</h1>
        <form @submit.prevent="register">
          <input v-model="name" type="text" placeholder="Seu nome" required />
          <input v-model="email" type="email" placeholder="seu@email.com" required />
          <input v-model="password" type="password" placeholder="sua senha" required />
          <button type="submit">Registrar-se</button>
          <RouterLink class="alt" :to="{ name: 'Login' }">Já tenho conta</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import SiteHeader from '../components/layout/SiteHeader.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

function register() {
  // aqui você chamaria sua API; por enquanto só redireciono para login
  router.push({ name: 'Login', query: { registered: '1' } })
}
</script>

<style scoped>
.auth { min-height: 100vh; background: #0e3358; color: #fff; }
.center { min-height: calc(100vh - 60px); display: grid; place-items: center; padding: 20px; }
.card {
  background: #fff; color: #111;
  border-radius: 12px; padding: 22px; width: 100%; max-width: 420px;
  box-shadow: 0 8px 30px rgba(0,0,0,.2);
}
h1 { text-align: center; margin: 0 0 16px; }
form { display: grid; gap: 10px; }
input { padding: 10px 12px; border:1px solid #d0d7de; border-radius: 8px; }
button { background:#16a34a; color:#fff; border:0; border-radius:8px; padding:10px 12px; font-weight:800; cursor:pointer; }
.alt { text-align:center; display:block; margin-top:6px; color:#0b2a4a; text-decoration:none; }
</style>
