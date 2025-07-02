<template>
  <div class="buyer-landing">
    <h1>Welcome, Buyer!</h1>

    <!-- Newly Arrived Section -->
    <section class="newly-arrived">
      <h2>Newly Arrived</h2>
      <div class="items-grid">
        <div v-for="item in newlyArrived" :key="item.id" class="item-card">
          <img :src="item.image" :alt="item.name" />
          <h3>{{ item.name }}</h3>
          <p>{{ item.category }}</p>
          <p>${{ item.price }}</p>
        </div>
      </div>
    </section>

    <!-- Sort By Category Section -->
    <section class="categories">
      <h2>Shop by Category</h2>
      <div class="category-list">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
      <div class="items-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
        >
          <img :src="item.image" :alt="item.name" />
          <h3>{{ item.name }}</h3>
          <p>{{ item.category }}</p>
          <p>${{ item.price }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample data
const items = ref([
  { id: 1, name: 'Fresh Salmon', category: 'Seafood', price: 15.99, image: 'https://via.placeholder.com/120?text=Salmon', isNew: true },
  { id: 2, name: 'Organic Carrots', category: 'Vegetables', price: 3.49, image: 'https://via.placeholder.com/120?text=Carrots', isNew: true },
  { id: 3, name: 'Chicken Breast', category: 'Poultry', price: 7.99, image: 'https://via.placeholder.com/120?text=Chicken', isNew: false },
  { id: 4, name: 'White Rice', category: 'Rice', price: 2.99, image: 'https://via.placeholder.com/120?text=Rice', isNew: false },
  { id: 5, name: 'Beef Steak', category: 'Meat', price: 12.99, image: 'https://via.placeholder.com/120?text=Beef', isNew: true },
  { id: 6, name: 'Chef Knife', category: 'Equipments', price: 25.00, image: 'https://via.placeholder.com/120?text=Knife', isNew: false },
  { id: 7, name: 'T-Shirt', category: 'Clothes', price: 10.00, image: 'https://via.placeholder.com/120?text=T-Shirt', isNew: false },
  { id: 8, name: 'Shrimp', category: 'Seafood', price: 9.99, image: 'https://via.placeholder.com/120?text=Shrimp', isNew: false },
  { id: 9, name: 'Broccoli', category: 'Vegetables', price: 2.49, image: 'https://via.placeholder.com/120?text=Broccoli', isNew: false },
  { id: 10, name: 'Eggs', category: 'Poultry', price: 4.99, image: 'https://via.placeholder.com/120?text=Eggs', isNew: true },
  // Add more items as needed
])

const categories = [
  'All',
  'Seafood',
  'Vegetables',
  'Meat',
  'Rice',
  'Equipments',
  'Clothes',
  'Poultry',
  'More'
]

const selectedCategory = ref('All')

const newlyArrived = computed(() =>
  items.value.filter(item => item.isNew)
)

const filteredItems = computed(() => {
  if (selectedCategory.value === 'All') return items.value
  if (selectedCategory.value === 'More') {
    // Show items not in the main categories
    const mainCats = categories.slice(1, -1)
    return items.value.filter(item => !mainCats.includes(item.category))
  }
  return items.value.filter(item => item.category === selectedCategory.value)
})
</script>

<style scoped>
.buyer-landing {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
}
section {
  margin-bottom: 2.5rem;
}
.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.item-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  width: 180px;
  text-align: center;
  box-shadow: 0 2px 8px #0001;
}
.item-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border-radius: 6px;
}
.category-list {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.category-list button {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 20px;
  background: #f0f0f0;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}
.category-list button.active,
.category-list button:hover {
  background: #007bff;
  color: #fff;
}
</style>
