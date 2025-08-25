<template>
  <header class="site-header">
    <div class="inner">
      <RouterLink class="brand" :to="{ name: 'Landing' }">
        <i class="fa-solid fa-graduation-cap"></i>
        <span>VestibulandoBot</span>
      </RouterLink>

      <nav class="actions">
        <RouterLink class="btn ghost" :to="{ name: 'Register' }">Registrar-se</RouterLink>
        <RouterLink class="btn solid" :to="{ name: 'Login' }">Login</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #0b2a4a;
  color: #fff;
  box-shadow: 0 4px 18px rgba(0,0,0,.15);
}
.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex; align-items: center; gap: 10px;
  color: #fff; text-decoration: none; font-weight: 800; letter-spacing: .2px;
}
.brand i { font-size: 20px; }
.actions { display: flex; gap: 10px; }
.btn {
  text-decoration: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 700;
}
.btn.ghost { color:#fff; border:1px solid #fff; }
.btn.ghost:hover { background: rgba(255,255,255,.12); }
.btn.solid { background:#16a34a; color:#fff; }
.btn.solid:hover { filter: brightness(0.95); }
</style>
