<template>
  <div class="auth">
    <SiteHeader />
    <div class="center">
      <div class="card">
        <h1>Criar conta</h1>

        <form @submit.prevent="onSubmit">
          <input v-model.trim="name" type="text" placeholder="Seu nome" autocomplete="name" />
          <input v-model.trim="email" type="email" placeholder="seu@email.com" required autocomplete="email" />
          <input v-model="password" type="password" placeholder="sua senha" required minlength="6" autocomplete="new-password" />
          <input v-model="confirmPassword" type="password" placeholder="confirmar senha" required minlength="6" autocomplete="new-password" />

          <small v-if="confirmPassword && !passwordMatches" class="warn">
            As senhas não conferem.
          </small>

          <button type="submit" :disabled="loading || !passwordMatches">
            {{ loading ? 'Enviando...' : 'Registrar-se' }}
          </button>

          <!-- ⬇️ separador -->
          <div class="or">Ou</div>

          <!-- Botão Google com PNG -->
          <button type="button" class="google" @click="loginWithGoogle">
            <img :src="googleLogo" class="glogoimg" alt="Google" width="22" height="22" />
            Continuar com Google
          </button>

          <RouterLink class="alt" :to="{ name: 'Login' }">Já tenho conta</RouterLink>

          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="ok">Conta criada! Você já pode fazer login.</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import SiteHeader from '../components/layout/SiteHeader.vue'
import { register as apiRegister } from '@/services/auth'

// ajuste o caminho se necessário; aqui supus Register.vue em src/views
import googleLogo from '../assets/google.png'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const error = ref('')
const success = ref(false)

const passwordMatches = computed(() =>
  password.value.length >= 6 &&
  confirmPassword.value.length >= 6 &&
  password.value === confirmPassword.value
)

async function onSubmit() {
  error.value = ''
  success.value = false

  if (!passwordMatches.value) {
    error.value = 'As senhas não conferem.'
    return
  }

  loading.value = true
  try {
    await apiRegister({ email: email.value, password: password.value })
    success.value = true
    router.push({ name: 'Login', query: { registered: '1' } })
  } catch (e) {
    error.value = e.message || 'Falha ao registrar'
  } finally {
    loading.value = false
  }
}

function loginWithGoogle() {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const url = `${base}/auth/google/login`
  window.location.href = url
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
button {
  background:#16a34a; color:#fff; border:0; border-radius:8px;
  padding:10px 12px; font-weight:800; cursor:pointer;
}
button:disabled { opacity: .6; cursor: not-allowed; }

/* separador "Ou" */
.or {
  text-align: center;
  font-weight: 600;
  color: #6b7280;   /* cinza discreto */
  margin: 8px 0 4px;
}

.google {
  display:flex; align-items:center; justify-content:center; gap:8px;
  background:#fff; color:#111; border:1px solid #d0d7de; font-weight:700;
  border-radius:8px; padding:10px 12px;
}
.glogoimg { width: 22px; height: 22px; object-fit: contain; display:block; }

.alt { text-align:center; display:block; margin-top:6px; color:#0b2a4a; text-decoration:none; }
.warn { color:#b45309; font-size:.9rem; }
.error { color:#b91c1c; margin-top:6px; }
.ok { color:#166534; margin-top:6px; }
</style>
