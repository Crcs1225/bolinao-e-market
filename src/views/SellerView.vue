<template>
  <div class="seller-dashboard">
    <!-- Sidebar -->
    <aside :class="['sidebar', { collapsed: isSidebarCollapsed }]">
      <button class="collapse-btn" @click="toggleSidebar">
        <span v-if="isSidebarCollapsed">&#9776;</span>
        <span v-else>&#10005;</span>
      </button>
      <nav>
        <ul>
          <li :class="{ active: currentView === 'dashboard' }" @click="currentView = 'dashboard'">
            <span>📊</span>
            <span v-if="!isSidebarCollapsed">Dashboard</span>
          </li>
          <li :class="{ active: currentView === 'store' }" @click="currentView = 'store'">
            <span>🏬</span>
            <span v-if="!isSidebarCollapsed">Store</span>
          </li>
          <li :class="{ active: currentView === 'orders' }" @click="currentView = 'orders'">
            <span>📦</span>
            <span v-if="!isSidebarCollapsed">Orders</span>
          </li>
          <li :class="{ active: currentView === 'payment' }" @click="currentView = 'payment'">
            <span>💰</span>
            <span v-if="!isSidebarCollapsed">Payment</span>
          </li>
          <li :class="{ active: currentView === 'account' }" @click="currentView = 'account'">
            <span>⚙️</span>
            <span v-if="!isSidebarCollapsed">Account Settings</span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sidebar state
const isSidebarCollapsed = ref(false)
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// Navigation state
const currentView = ref('dashboard')

// Components for each section
const Dashboard = {
  template: `
    <section>
      <h2>Dashboard Analytics</h2>
      <div class="analytics">
        <div>Earnings: <strong>₱12,500</strong></div>
        <div>Orders: <strong>120</strong></div>
        <div>Pending: <strong>5</strong></div>
      </div>
    </section>
  `
}

const Store = {
  template: `
    <section>
      <h2>Store Management</h2>
      <button>Add Item</button>
      <ul>
        <li>
          <span>Item 1</span>
          <button>Edit</button>
          <button>Delete</button>
        </li>
        <li>
          <span>Item 2</span>
          <button>Edit</button>
          <button>Delete</button>
        </li>
      </ul>
    </section>
  `
}

const Orders = {
  template: `
    <section>
      <h2>Orders Tracking</h2>
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Status</th>
            <th>Pickup Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1001</td>
            <td>Reserved</td>
            <td>10:00 AM</td>
          </tr>
          <tr>
            <td>#1002</td>
            <td>Pickup</td>
            <td>11:30 AM</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
}

const Payment = {
  template: `
    <section>
      <h2>Payment & Earnings</h2>
      <div>
        <p>Earnings: <strong>₱12,500</strong></p>
        <h3>Available Payment Methods</h3>
        <ul>
          <li>GCash</li>
          <li>Maya</li>
          <li>In-store/Physical</li>
          <li>Cash on Delivery</li>
        </ul>
        <h3>Pending Payments</h3>
        <ul>
          <li>Order #1003 - ₱500 - Processing</li>
        </ul>
      </div>
    </section>
  `
}

const Account = {
  template: `
    <section>
      <h2>Account Settings</h2>
      <button>Delete Account</button>
      <button>Change Password</button>
      <button>Edit Profile</button>
      <div>
        <label>Store Name: <input type="text" value="My Store" /></label>
        <label>Store Details: <textarea>Best store in town!</textarea></label>
        <label>Store Photo: <input type="file" /></label>
      </div>
    </section>
  `
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

<style scoped>
.seller-dashboard {
  display: flex;
  height: 100vh;
  background: #f8f9fa;
}
.sidebar {
  width: 220px;
  background: #22223b;
  color: #fff;
  transition: width 0.2s;
  padding-top: 1rem;
  position: relative;
}
.sidebar.collapsed {
  width: 60px;
}
.collapse-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0 0;
}
.sidebar nav ul li {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.sidebar nav ul li.active,
.sidebar nav ul li:hover {
  background: #4a4e69;
  border-left: 4px solid #9a8c98;
}
.sidebar nav ul li span:first-child {
  margin-right: 1rem;
  font-size: 1.2rem;
}
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
.analytics {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}
.analytics > div {
  background: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #fff;
}
th, td {
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-align: left;
}
button {
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  background: #4a4e69;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #9a8c98;
}
label {
  display: block;
  margin: 1rem 0 0.5rem 0;
}
input[type="text"], textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
