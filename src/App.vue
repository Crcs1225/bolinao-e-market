<template>
  <div class="app-container">
    <!-- Error Message -->
    <ErrorMessage v-if="error" :message="error" @close="error = ''" />

    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/util/supabase'
import ErrorMessage from '@/components/ErrorMessage.vue'

const router = useRouter()
const error = ref('')

let timeout

const logoutDueToInactivity = async () => {
  await supabase.auth.signOut()
  error.value = 'You were logged out due to 15 minutes of inactivity.'
  router.push('/login')
}

const resetTimer = () => {
  clearTimeout(timeout)
  timeout = setTimeout(logoutDueToInactivity, 15 * 60 * 1000) // 15 minutes
}

const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

onMounted(() => {
  activityEvents.forEach(event =>
    window.addEventListener(event, resetTimer)
  )
  resetTimer() // Start the timer initially
})

onUnmounted(() => {
  clearTimeout(timeout)
  activityEvents.forEach(event =>
    window.removeEventListener(event, resetTimer)
  )
})
</script>

<style>
.app-container {
  /* Your styles here */
}

.main-content {
  /* Your styles here */
}
</style>
