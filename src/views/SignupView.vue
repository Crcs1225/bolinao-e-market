<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignup">
      <div>
        <label for="fullName">Full Name</label>
        <input v-model="form.fullName" id="fullName" type="text" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input v-model="form.email" id="email" type="email" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input v-model="form.password" id="password" type="password" required />
      </div>
      <div>
        <label>Role</label>
        <select v-model="form.role" required>
          <option disabled value="">Select role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/util/supabase'


const form = ref({
  fullName: '',
  email: '',
  password: '',
  role: ''
})

const error = ref('')

const handleSignup = async () => {
  error.value = ''
  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.fullName,
          role: form.value.role
        }
      }
    })
    if (signUpError) throw signUpError
    alert('Signup successful! Please check your email to confirm your account.')
  } catch (e) {
    error.value = e.message || 'Signup failed. Please try again.'
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.signup-container h2 {
  margin-bottom: 16px;
}
.signup-container form > div {
  margin-bottom: 12px;
}
.signup-container label {
  display: block;
  margin-bottom: 4px;
}
.signup-container input,
.signup-container select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.signup-container button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.signup-container .error {
  color: #d32f2f;
  margin-top: 12px;
  text-align: center;
}
</style>
