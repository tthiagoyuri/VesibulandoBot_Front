<!-- App.vue -->
<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
/* NÃO use scoped aqui */
html, body, #app { height: 100%; margin: 0; }

body {
  /* o mesmo fundo que você usava no wrapper */
  background: linear-gradient(180deg, #082544 0%, #0e3358 40%, #13406b 100%);
}
</style>
