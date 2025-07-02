<template>
  <aside :class="['sidebar', { collapsed }]">
    <div class="collapse-container" :class="{ center: collapsed }">
      <button class="collapse-btn" @click="$emit('toggle')">
        <span v-if="collapsed">➡️</span>
        <span v-else>☰</span>
      </button>
    </div>

    <nav>
      <ul>
        <li
          v-for="item in navItems"
          :key="item.key"
          :class="{ active: current === item.key }"
          @click="$emit('navigate', item.key)"
        >
          <span>{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="$emit('logout')">
        <span>🚪</span>
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
defineOptions({ name: 'AppSidebar' })

defineProps({
  collapsed: Boolean,
  current: String
})

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'store', label: 'Store', icon: '🏬' },
  { key: 'orders', label: 'Orders', icon: '📦' },
  { key: 'payment', label: 'Payment', icon: '💰' },
  { key: 'account', label: 'Account Settings', icon: '⚙️' }
]
</script>

<style scoped>
.sidebar {
  background: #fffbe9;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 18px 0 0 18px;
  width: 220px;
  min-width: 80px;
  height: 100vh;              /* Take full viewport height */
  min-height: 100vh;
  max-height: 100vh;          /* Prevent growing beyond screen */
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  padding: 24px 0;
  position: sticky;           /* Stay fixed on scroll if parent allows */
  top: 0;
  overflow: hidden;           /* Prevent sidebar from scrolling */
}

.sidebar.collapsed {
  width: 70px;
  border-radius: 18px;
}

.collapse-container {
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 20px;
}
.collapse-container.center {
  justify-content: center;
}

.collapse-btn {
  background: none;
  border: none;
  color: #e1701a;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

nav {
  padding: 0 8px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 14px 16px;
  cursor: pointer;
  font-size: 1.08rem;
  color: #7c5e2c;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.18s, color 0.18s;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}

nav li.active,
nav li:hover {
  background: #f7b267;
  color: #e1701a;
}

nav li span:first-child {
  font-size: 1.3rem;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.logout-btn {
  background: #e1701a;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #b94a48;
}

@media (max-width: 900px) {
  .sidebar {
    width: 100vw;
    max-width: 420px;
    max-height: 100vh;
    height: 100vh;
    border-radius: 18px;
    margin: 0 auto;
    overflow: hidden;
  }

  .sidebar.collapsed {
    width: 70px;
  }

  .collapse-container {
    justify-content: center !important;
  }
}
</style>
