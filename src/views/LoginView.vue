<template>
  <div class="login-page">
    <div class="login-card-container">
      <div class="login-form-card">
        <div class="form-content">
          <div class="icon-title-row">
            <div class="icon-placeholder">
              <img src="https://img.icons8.com/?size=100&id=BB1qFKB8poFR&format=png&color=000000" alt="App Icon" class="app-icon" />
            </div>
            <span class="market-title">MANALIW <span class="market-sub">Market</span></span>
          </div>
          <div class="market-desc">Welcome to Bolinao E-Market</div>
          <form @submit.prevent="login">
            <div class="form-group">
              <input type="email" v-model="username" placeholder="Email" required />
            </div>
            <div class="form-group">
              <input type="password" v-model="password" placeholder="Password" required />
            </div>
            <button type="submit" class="login-button">Log in</button>
            <a href="#" class="forgot-password">Forgot your password?</a>
          </form>
        </div>
      </div>
      <div class="signup-card">
        <p class="signup-text">Don't have an account?</p>
        <button class="signup-button" @click="goToSignup">Sign up</button>
      </div>
    </div>
  </div>
  <ErrorDialog v-if="showError" :message="error" @close="showError = false" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/util/supabase';
import ErrorDialog from '@/components/ErrorMessage.vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const showError = ref(false);

const login = async () => {
  error.value = '';
  if (!username.value || !password.value) {
    error.value = 'Please enter your email and password.';
    showError.value = true;
    return;
  }
  const { error: loginError, data } = await supabase.auth.signInWithPassword({
    email: username.value,
    password: password.value,
  });
  if (loginError) {
    error.value = loginError.message;
    showError.value = true;
    return;
  }
  // Redirect based on user role if needed
  const user = data.user;
  const accountType = user?.user_metadata?.accountType; // ✅ correct key

  if (accountType === 'seller') {
    router.push('/seller');
  } else {
    router.push('/buyer');
  }
};
const goToSignup = () => {
  router.push('/signup');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Quicksand:wght@500;700&display=swap');

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}

.login-card-container {
  display: flex;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border-radius: 18px;
  overflow: hidden;
}

.login-form-card {
  background: #fffbe9;
  border-radius: 18px 0 0 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 48px 40px 40px 40px;
  width: 370px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-title-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffe5b4;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 213, 128, 0.18);
}

.app-icon {
  max-width: 40px;
  max-height: 40px;
}

.market-title {
  font-family: 'Montserrat', 'Quicksand', cursive;
  font-size: 2rem;
  color: #e1701a;
  letter-spacing: 2px;
  text-shadow: 1px 2px 8px #fff3e0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 700;
}

.market-sub {
  font-family: 'Quicksand', 'Montserrat', sans-serif;
  font-size: 1.1rem;
  color: #4f8a10;
  font-weight: 700;
  letter-spacing: 1px;
  margin-left: 2px;
}

.market-desc {
  font-size: 1rem;
  color: #7c5e2c;
  margin-bottom: 28px;
  margin-top: 2px;
  font-family: 'Quicksand', 'Montserrat', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  max-width: 280px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1.5px solid #f7b267;
  border-radius: 7px;
  font-size: 17px;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}

input:focus {
  border-color: #e1701a;
  outline: none;
}

input::placeholder {
  color: #bfa76a;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}

.login-button {
  width: 100%;
  max-width: 280px;
  padding: 12px 20px;
  background: linear-gradient(90deg, #e1701a 60%, #f7b267 100%);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 17px;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.18);
  transition: background 0.3s, box-shadow 0.3s;
  margin-bottom: 15px;
}

.login-button:hover {
  background: linear-gradient(90deg, #f7b267 0%, #e1701a 100%);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.28);
}

.forgot-password {
  display: block;
  color: #bfa76a;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 0px;
  margin-top: 5px;
  transition: color 0.2s;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}

.forgot-password:hover {
  color: #e1701a;
  text-decoration: underline;
}

.signup-card {
  background: linear-gradient(135deg, #4f8a10 0%, #a8e063 100%);
  border-radius: 0 18px 18px 0;
  padding: 48px 40px 40px 40px;
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: -30px;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.signup-text {
  color: #fff;
  font-size: 20px;
  margin-bottom: 20px;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.signup-button {
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 10px 30px;
  font-size: 16px;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.signup-button:hover {
  background-color: #fff;
  color: #4f8a10;
}

@media (max-width: 900px) {
  .login-page {
    padding: 24px;
    min-height: 100vh;
    width: 100vw;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
  }
  .login-card-container {
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
  .login-form-card,
  .signup-card {
    border-radius: 0;
    width: 100%;
    min-width: 0;
    max-width: 420px;
    margin: 0 auto;
    padding: 32px 10px;
    box-sizing: border-box;
  }
  .signup-card {
    margin-top: -20px;
    border-radius: 0 0 18px 18px;
  }
  .login-form-card {
    border-radius: 18px 18px 0 0;
  }
  .icon-title-row {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 12px !important;
    width: 100%;
  }
}
</style>
