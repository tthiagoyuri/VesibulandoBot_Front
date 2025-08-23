<template>
  <aside class="quick">
    <h3>Perguntas rápidas</h3>
    <div class="list">
      <button
        v-for="(q, i) in questions"
        :key="i"
        class="item"
        @click="$emit('pick', q)"
      >
        {{ q }}
      </button>
    </div>
  </aside>
</template>

<script setup>
const questions = [
  'Explique fotossíntese em 3 passos.',
  'Como calcular a média ponderada?',
  'Qual a diferença entre mitose e meiose?',
  'Dicas para redação nota 1000.',
  'Resumo da Revolução Francesa.',
  'Como converter km/h para m/s?'
]
</script>

<style scoped>
.quick {
  background: #ffffffd9;
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  min-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto 1fr;
}
h3 { margin: 0 0 12px; }
.list {
  display: grid;
  gap: 8px;
}
.item {
  text-align: left;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background .2s, transform .02s;
}
.item:hover { background: #e5e7eb; }
.item:active { transform: translateY(1px); }
</style>
