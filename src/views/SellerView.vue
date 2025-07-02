<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/util/supabase'
import Sidebar from '@/components/Sidebar.vue' // ← import

const router = useRouter()

const isSidebarCollapsed = ref(false)
const currentView = ref('dashboard')

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

const Dashboard = { /* ... */ }
const Store = { /* ... */ }
const Orders = { /* ... */ }
const Payment = { /* ... */ }
const Account = { /* ... */ }

const componentsMap = {
  dashboard: Dashboard,
  store: Store,
  orders: Orders,
  payment: Payment,
  account: Account
}

const currentComponent = computed(() => componentsMap[currentView.value])
</script>

<template>
  <div class="seller-dashboard">
    <Sidebar
      :collapsed="isSidebarCollapsed"
      :current="currentView"
      @toggle="toggleSidebar"
      @navigate="val => currentView = val"
      @logout="logout"
    />
    <main class="main-content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>


