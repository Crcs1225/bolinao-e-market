<template>
  <div class="signup-page">
    <div class="signup-card-container">
      <div class="signup-form-card">
        <div class="form-content">
          <div class="icon-title-row">
            <div class="icon-placeholder">
              <img src="https://img.icons8.com/?size=100&id=BB1qFKB8poFR&format=png&color=000000" alt="App Icon" class="app-icon" />
            </div>
            <span class="market-title">MANALIW <span class="market-sub">Market</span></span>
          </div>
          <div class="market-desc">Create your Bolinao E-Market account</div>
          <form @submit.prevent="register">
            <div class="form-group">
              <input
                type="text"
                v-model="fullName"
                placeholder="Full Name"
                required
                class="signup-input"
              />
            </div>
            <div class="form-group">
              <input
                type="email"
                v-model="email"
                placeholder="Email"
                required
                class="signup-input"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                v-model="password"
                placeholder="Password"
                required
                class="signup-input"
              />
            </div>
            <div class="form-group">
              <select v-model="accountType" required class="signup-input">
                <option value="" disabled>Select Account Type</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="terms" v-model="agree" />
              <label for="terms">
                I agree to the
                <a href="#" class="terms-link" @click.prevent="showTerms = true">Terms and Conditions</a>
              </label>
            </div>
            <button
              type="submit"
              class="signup-button"
              :disabled="!agree || loading"
            >
              {{ loading ? 'Signing up...' : 'Sign Up' }}
            </button>
          </form>

        </div>
      </div>
      <div class="already-account-card">
        <p class="already-account-text">Already have an account?</p>
        <button class="already-account-button" @click="goToLogin">Log in</button>
      </div>
    </div>

    <!-- Terms and Conditions Dialog -->
    <div v-if="showTerms" class="terms-dialog-backdrop">
      <div class="terms-dialog">
        <h3>Terms and Conditions</h3>
        <div class="terms-content">
          <p>
            Welcome to Manaliw Municipality of Bolinao E-Market. By creating an account, you agree to abide by our rules and policies. Please read all terms carefully before proceeding.
          </p>
          <ul>
            <li>Your information will be kept confidential.</li>
            <li>Do not share your password with anyone.</li>
            <li>Respect other users and vendors.</li>
            <li>Violations may result in account suspension.</li>
          </ul>
        </div>
        <button class="close-terms-btn" @click="showTerms = false">Close</button>
      </div>
    </div>
  </div>
  <ErrorDialog v-if="showError" :message="error" @close="showError = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/util/supabase'
import ErrorDialog from '@/components/ErrorMessage.vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const accountType = ref('')
const agree = ref(false)
const loading = ref(false)
const error = ref('')
const showTerms = ref(false)
const router = useRouter()
const showError = ref(false)

const register = async () => {
  error.value = ''
  showError.value = false
  if (!fullName.value || !email.value || !password.value || !accountType.value) {
    error.value = 'Please fill in all fields.'
    showError.value = true
    return
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    showError.value = true
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    showError.value = true
    return
  }
  if (!agree.value) {
    error.value = 'You must agree to the terms and conditions.'
    showError.value = true
    return
  }

  loading.value = true

  try {
    const metadata = {}
    if (fullName.value) metadata.full_name = fullName.value
    if (accountType.value) metadata.account_type = accountType.value

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          fullName: fullName.value,
          accountType: accountType.value,
        }
      }
    })

    if (signUpError) {
      error.value = signUpError.message
      showError.value = true
      return
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (signInError) {
      error.value = signInError.message;
      showError.value = true;
      return;
    }

    if (accountType.value === 'seller') {
      // Redirect to seller dashboard or setup page
      router.push('/seller/setup')
    } else {
      // Redirect to buyer dashboard
      router.push('/buyer')
    }
  } catch (e) {
    error.value = e.message || 'An unexpected error occurred.'
    showError.value = true
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Quicksand:wght@500;700&display=swap');

.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
  padding: 20px 0;
}

.signup-card-container {
  display: flex;
  gap: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border-radius: 18px;
  overflow: hidden;
  background: none;
  width: 100%;
  max-width: 800px;
  min-width: 320px;
}

.signup-form-card {
  background: #fffbe9;
  border-radius: 18px 0 0 18px;
  width: 50%;
  min-width: 320px;
  padding: 40px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-title-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  background: #ffe5b4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(255, 213, 128, 0.18);
}

.app-icon {
  max-width: 40px;
  max-height: 40px;
}

.market-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e1701a;
  text-shadow: 1px 2px 8px #fff3e0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Montserrat', 'Quicksand', cursive;
}

.market-sub {
  font-size: 1.1rem;
  color: #4f8a10;
  margin-left: 2px;
  font-family: 'Quicksand', 'Montserrat', sans-serif;
}

.market-desc {
  font-size: 1rem;
  color: #7c5e2c;
  margin-bottom: 24px;
  font-weight: 600;
  font-family: 'Quicksand', 'Montserrat', sans-serif;
}

.form-group {
  margin-bottom: 18px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signup-input,
.signup-button {
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}

.signup-input {
  padding: 12px 15px;
  border: 1.5px solid #f7b267;
  border-radius: 7px;
  font-size: 16px;
  background: #fff;
  font-family: inherit;
  transition: border-color 0.2s;
}

.signup-input:focus {
  border-color: #e1701a;
  outline: none;
}

input::placeholder, select.signup-input {
  color: #bfa76a;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}

select.signup-input {
  background-color: #fff;
  color: #4b5563;
  height: 44px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  text-align: left;
  margin-top: -6px;
  flex-direction: row;
  white-space: nowrap;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}

.signup-button {
  padding: 12px 20px;
  background: linear-gradient(90deg, #e1701a 60%, #f7b267 100%);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.18);
  transition: background 0.3s, box-shadow 0.3s;
  margin-top: 10px;
}

.signup-button:hover {
  background: linear-gradient(90deg, #f7b267 0%, #e1701a 100%);
}

.already-account-card {
  background: linear-gradient(135deg, #4f8a10 0%, #a8e063 100%);
  border-radius: 0 18px 18px 0;
  width: 50%;
  min-width: 220px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.already-account-text {
  color: #fff;
  font-size: 20px;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.already-account-button {
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 10px 30px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}

.already-account-button:hover {
  background-color: #fff;
  color: #4f8a10;
}

.terms-link {
  color: #e1701a;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}
.terms-link:hover {
  color: #b94a48;
}

.terms-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.terms-dialog {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.terms-content {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.close-terms-btn {
  background: #e1701a;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.close-terms-btn:hover {
  background: #d1591a;
}

@media (max-width: 900px) {
  .signup-page {
    padding: 24px;
    min-height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
  }
  .signup-card-container {
    flex-direction: column;
    border-radius: 18px;
    width: 100vw;
    min-width: 0;
    max-width: 100vw;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    background: none;
    padding: 0;
    gap: 0;
    margin: 0 auto;
    align-items: center;
  }
  .signup-form-card,
  .already-account-card {
    border-radius: 0;
    width: 100%;
    min-width: 0;
    max-width: 420px;
    margin: 0 auto;
    padding: 32px 10px;
    box-sizing: border-box;
  }
  .already-account-card {
    margin-top: -20px;
    border-radius: 0 0 18px 18px;
  }
  .signup-form-card {
    border-radius: 18px 18px 0 0;
  }
  .icon-title-row {
    flex-direction: row !important;    /* Place icon and title side by side */
    align-items: center !important;
    justify-content: center !important;
    gap: 12px !important;
    width: 100%;
  }
}
</style>
