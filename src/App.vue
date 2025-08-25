<template>
  <div class="route-wrapper">
    <RouterView v-slot="{ Component, route }">
      <Suspense>
        <template #default>
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </template>

        <!-- Mostra enquanto a próxima rota carrega -->
        <template #fallback>
          <div class="page-fallback">
          <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
          </div>
        </template>

      </Suspense>
    </RouterView>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'

</script>

<style>
/* fundo persistente para TODAS as páginas (evita branco) */
html, body, #app { height: 100%; margin: 0; }
.route-wrapper {
  min-height: 100dvh;
  position: relative;
  overflow: hidden;

  /* escolha um fundo padrão ou o mesmo gradiente do app */
  background: linear-gradient(180deg, #082544 0%, #0e3358 40%, #13406b 100%);
}

/* transição rápida e suave */
.page-enter-from { opacity: 0; transform: translateY(6px); }
.page-leave-to   { opacity: 0; transform: translateY(-6px); }
.page-enter-active,
.page-leave-active { transition: all 180ms ease; }

/* loader */
.page-fallback {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: transparent; /* mantém o fundo acima */
}
.spinner {
  width: 32px; height: 32px; border-radius: 50%;
  border: 3px solid #d9e0e8; border-top-color: #10b981;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .page-enter-active, .page-leave-active { transition: opacity 120ms linear; }
  .page-enter-from, .page-leave-to { transform: none; }
}


.page-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: white; /* deixa o ícone branco */
  font-size: 2rem; /* ajusta tamanho */
}

</style>
