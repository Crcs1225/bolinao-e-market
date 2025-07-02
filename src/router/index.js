import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import BuyerView from '../views/BuyerView.vue'
import SellerView from '../views/SellerView.vue'
import { supabase } from '../util/supabase'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  { path: '/buyer', name: 'Buyer', component: BuyerView },
  { path: '/seller', name: 'Seller', component: SellerView },
  { path: '/:catchAll(.*)', redirect: '/login' }, // catch all unknown routes
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser()
  // If not logged in, always redirect to login except on /login or /signup
  if (!user && to.name !== 'Login' && to.name !== 'Signup') {
    return next({ name: 'Login' })
  }
  // If logged in and trying to access login/signup, redirect to correct dashboard
  if (user && (to.name === 'Login' || to.name === 'Signup')) {
    // Example: check user metadata for account type
    const accountType = user.user_metadata?.account_type
    if (accountType === 'seller') {
      return next({ name: 'Seller' })
    } else {
      return next({ name: 'Buyer' })
    }
  }
  // If logged in and going to root, redirect to correct dashboard
  if (user && to.path === '/') {
    const accountType = user.user_metadata?.account_type
    if (accountType === 'seller') {
      return next({ name: 'Seller' })
    } else {
      return next({ name: 'Buyer' })
    }
  }
  next()
})

export default router
