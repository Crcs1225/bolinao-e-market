import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import BuyerView from '@/views/BuyerView.vue'
import SellerView from '@/views/SellerView.vue'
import { supabase } from '../util/supabase'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  { path: '/buyer', name: 'Buyer', component: BuyerView },
  { path: '/seller', name: 'Seller', component: SellerView },
  {path: '/seller/setup', name: 'SellerSetup', component: () => import('@/views/SellerSetup.vue')},
  { path: '/:catchAll(.*)', redirect: '/login' }, // catch all unknown routes
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user && to.name !== 'Login' && to.name !== 'Signup') {
    return next({ name: 'Login' });
  }

  if (user && (to.name === 'Login' || to.name === 'Signup')) {
    const accountType =
      user.user_metadata?.accountType || user.user_metadata?.account_type;
    if (accountType === 'seller') {
      return next({ name: 'Seller' });
    } else {
      return next({ name: 'Buyer' });
    }
  }

  if (user && to.path === '/') {
    const accountType =
      user.user_metadata?.accountType || user.user_metadata?.account_type;
    if (accountType === 'seller') {
      return next({ name: 'Seller' });
    } else {
      return next({ name: 'Buyer' });
    }
  }

  next();
});


export default router
