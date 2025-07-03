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

// Only reset timer if user is logged in
const resetTimer = () => {
  clearTimeout(timeout)
  if (supabase.auth.getSession && supabase.auth.getSession().data?.session) {
    timeout = setTimeout(logoutDueToInactivity, 15 * 60 * 1000)
  }
}

const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

// Watch for auth state changes
let unsub
onMounted(() => {
  // Listen for activity only if logged in
  unsub = supabase.auth.onAuthStateChange((event, session) => {
    clearTimeout(timeout)
    if (session) {
      activityEvents.forEach(event =>
        window.addEventListener(event, resetTimer)
      )
      resetTimer()
    } else {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      )
      clearTimeout(timeout)
    }
  })
  // Initial check
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      activityEvents.forEach(event =>
        window.addEventListener(event, resetTimer)
      )
      resetTimer()
    }
  })
})

onUnmounted(() => {
  clearTimeout(timeout)
  activityEvents.forEach(event =>
    window.removeEventListener(event, resetTimer)
  )
  if (unsub) unsub.data?.subscription.unsubscribe()
})
</script>

<style>
</style>
