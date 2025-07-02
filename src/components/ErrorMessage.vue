<template>
  <div v-if="show" class="error-dialog-backdrop">
    <div class="error-dialog">
      <div class="error-title">Error</div>
      <div class="error-message">{{ message }}</div>
      <button class="close-btn" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
});
</script>

<style scoped>
.error-dialog-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.error-dialog {
  background: #fffbe9;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  padding: 32px 24px 20px 24px;
  min-width: 260px;
  max-width: 90vw;
  text-align: center;
}
.error-title {
  font-size: 1.3rem;
  color: #e1701a;
  font-weight: bold;
  margin-bottom: 12px;
}
.error-message {
  color: #b94a48;
  margin-bottom: 18px;
  font-size: 1rem;
}
.close-btn {
  background: #e1701a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: #b94a48;
}
</style>
