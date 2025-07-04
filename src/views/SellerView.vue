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


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/util/supabase'
import Sidebar from '@/components/Sidebar.vue'

import Dashboard from './seller/Dashboard.vue'
import Store from './seller/Store.vue'
import Orders from './seller/Orders.vue'
import Payment from './seller/Payment.vue'
import Account from './seller/Account.vue'

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

const componentsMap = {
  dashboard: Dashboard,
  store: Store,
  orders: Orders,
  payment: Payment,
  account: Account
}

const currentComponent = computed(() => componentsMap[currentView.value])
</script>

<style>
.seller-dashboard {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1 1 0;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
}

/* Responsive for mobile */
@media (max-width: 900px) {
  .seller-dashboard {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  .sidebar {
    width: 100vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    height: auto !important;
    min-height: unset !important;
    border-radius: 0 0 18px 18px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
    position: static !important;
    z-index: 2;
  }
  .main-content {
    padding: 1.2rem 0.5rem;
    height: auto;
    min-height: 70vh;
    background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
  }
}
</style>
