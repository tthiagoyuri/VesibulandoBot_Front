<template>
  <div class="auth">
    <div class="center">
      <div class="card">
        <h1>Criar senha</h1>

        <form @submit.prevent="onSubmit">
          <input v-model="password" type="password" placeholder="Nova senha" minlength="6" required />
          <input v-model="confirm" type="password" placeholder="Confirmar senha" minlength="6" required />
          <small v-if="confirm && !matches" class="warn">As senhas não conferem.</small>

          <button type="submit" :disabled="loading || !matches">
            {{ loading ? 'Enviando...' : 'Salvar' }}
          </button>

          <p v-if="ok" class="ok">Senha criada! Redirecionando…</p>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { setPassword, getCurrentUser } from '@/services/auth'

const router = useRouter()
const route = useRoute()

const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const ok = ref(false)

// ajuste o tempo que quer exibir a mensagem (em ms)
const REDIRECT_DELAY_MS = 1600

const matches = computed(() => password.value.length >= 6 && password.value === confirm.value)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function onSubmit() {
  error.value = ''
  ok.value = false

  if (!matches.value) {
    error.value = 'As senhas não conferem.'
    return
  }

  loading.value = true
  try {
    await setPassword({ password: password.value, confirm: confirm.value })
    ok.value = true
    loading.value = false

    // atualiza dados do usuário (has_password = true)
    await getCurrentUser(true)

    // espera um tempinho para o usuário ler a mensagem
    await sleep(REDIRECT_DELAY_MS)

    // destino: usa ?r=... se veio, senão vai para Home
    const next = route.query?.r ? { path: String(route.query.r) } : { name: 'Home' }
    router.replace(next)
  } catch (e) {
    error.value = e.message || 'Não foi possível salvar.'
    loading.value = false
  }
}
</script>

<style scoped>
.auth { min-height: 100vh; background: #0e3358; color: #fff; }
.center { min-height: 100vh; display: grid; place-items: center; padding: 20px; }
.card { background:#fff; color:#111; border-radius:12px; padding:22px; width:100%; max-width:420px; box-shadow:0 8px 30px rgba(0,0,0,.2) }
form { display:grid; gap:10px }
input { padding:10px 12px; border:1px solid #d0d7de; border-radius:8px }
button { background:#16a34a; color:#fff; border:0; border-radius:8px; padding:10px 12px; font-weight:800; cursor:pointer }
button:disabled { opacity:.6; cursor:not-allowed }
.warn { color:#b45309 }
.error { color:#b91c1c }
.ok { color:#166534 }
</style>
