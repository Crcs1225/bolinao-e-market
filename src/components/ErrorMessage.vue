<template>
  <div class="error-dialog">
    <span class="error-icon">!</span>
    <span class="error-text">{{ message }}</span>
    <button class="close-btn" @click="$emit('close')" aria-label="Close">&times;</button>
  </div>
</template>

<script setup>
defineProps(['message']);
</script>

<style scoped>
.error-dialog {
  position: fixed;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #fffbe9;
  color: #b94a48;
  border: 1.5px solid #f7b267;
  border-radius: 10px;
  box-shadow: 0 4px 16px #e1701a22;
  padding: 0.8rem 2.2rem 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 220px;
  max-width: 90vw;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
  font-size: 1rem;
  z-index: 999;
}

.error-icon {
  background: #e1701a;
  color: #fff;
  border-radius: 50%;
  width: 1.7em;
  height: 1.7em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1em;
  box-shadow: 0 2px 8px #e1701a22;
}

.error-text {
  flex: 1;
  word-break: break-word;
}

.close-btn {
  background: none;
  border: none;
  color: #e1701a;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0 0.3rem;
  line-height: 1;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #b94a48;
}
</style>
