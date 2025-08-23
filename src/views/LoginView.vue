<template>
  <div class="login-view"> 
    <div class="card">
      <h1>Entrar</h1>

      <LoginForm
        :loading="loading"
        :error="error"
        @submit="onSubmit"
      />

      
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../services/auth.js'
import LoginForm from '../components/forms/LoginForm.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')

async function onSubmit({ email, password }) {
  loading.value = true
  error.value = ''
  try {
    await login({ email, password })
    const redirect = route.query.redirect || { name: 'Home' }
    router.push(redirect)
  } catch (err) {
    error.value = err?.message || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: grid;
  place-items: center;

  /* Fundo com gradiente animado */
  background: linear-gradient(-45deg, #001aff, #00eeff, #00ff15, #5c6300, #ff0000);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;

  padding: 1rem;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.card {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  border-left: #fbff05 9px solid;
}
h1 {
  margin: 0 0 16px;
  text-align: center;
  color: #222;
}

</style>
