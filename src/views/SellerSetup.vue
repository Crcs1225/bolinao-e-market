<template>
  <div class="seller-setup">
    <div class="setup-card">
      <div class="form-content">
        <h2 class="setup-title">Set Up Your Store</h2>

        <!-- Step 1: Store Info -->
        <div v-if="step === 1">
          <h3 class="step-header">Store Details</h3>
          <input v-model="storeName" placeholder="Store Name" class="signup-input" required />
          <textarea v-model="description" placeholder="Store Description" class="signup-input" />
          <label class="upload-label">Upload Store Image
            <input type="file" @change="uploadImage" class="file-input" />
          </label>
        </div>

        <!-- Step 2: Payment Methods -->
        <div v-else-if="step === 2">
          <h3 class="step-header">Payment Method</h3>
          <div class="payment-options">
            <div
              v-for="method in paymentChoices"
              :key="method.key"
              :class="['payment-tile', selectedPayments.includes(method.key) ? 'selected' : '']"
              @click="togglePayment(method.key)"
            >
              {{ method.label }}
            </div>
          </div>
          <div v-if="selectedPayments.includes('gcash')">
            <input v-model="gcashNumber" placeholder="GCash Number" class="signup-input" />
          </div>
          <div v-if="selectedPayments.includes('cod')">
            <p class="cod-desc">COD is available for buyers during delivery.</p>
          </div>
          <div v-if="selectedPayments.includes('store')">
            <p class="cod-desc">Customers can pay directly at your store location.</p>
          </div>
        </div>

        <!-- Step 3: Products -->
        <div v-else-if="step === 3">
          <h3 class="step-header">Items</h3>
          <p>Add Initial Products (1 to 3)</p>
          <div v-for="(product, index) in products" :key="index" class="product-input-outer">
            <div class="product-input-group">
              <input v-model="product.name" placeholder="Product Name" class="signup-input" />
              <input v-model="product.description" placeholder="Description" class="signup-input" />
              <input type="number" v-model.number="product.price" placeholder="Price" class="signup-input" />
              <input type="file" @change="e => handleProductImage(e, index)" class="file-input" />
              <button
                type="button"
                class="delete-btn"
                @click="removeProduct(index)"
                v-if="products.length > 1"
              >
                Delete
              </button>
            </div>
          </div>
          <button type="button" @click="addProduct" :disabled="products.length >= 3" class="add-btn">
            + Add Another Product
          </button>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
          <button @click="prevStep" v-if="step > 1" class="back-btn">Back</button>
          <button v-if="step < 3" @click="nextStep" class="next-btn">Next</button>
          <button v-if="step === 3" @click="submitStore" class="signup-button">Finish Setup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/util/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const step = ref(1);

const storeName = ref('');
const description = ref('');
const storeImage = ref(null);

const paymentChoices = [
  { key: 'gcash', label: 'GCash' },
  { key: 'cod', label: 'Cash on Delivery' },
  { key: 'store', label: 'Pay at Store' },
];
const selectedPayments = ref([]);
const gcashNumber = ref('');

const products = ref([{ name: '', description: '', price: 0, image: null }]);

const addProduct = () => {
  if (products.value.length < 3) {
    products.value.push({ name: '', description: '', price: 0, image: null });
  }
};

const removeProduct = (index) => {
  products.value.splice(index, 1);
};

const togglePayment = (key) => {
  if (selectedPayments.value.includes(key)) {
    selectedPayments.value = selectedPayments.value.filter(k => k !== key);
  } else {
    selectedPayments.value.push(key);
  }
};

const uploadImage = (e) => {
  storeImage.value = e.target.files[0];
};

const handleProductImage = (e, index) => {
  products.value[index].image = e.target.files[0];
};

const uploadImageToStorage = async (file, pathPrefix = 'store-images') => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const { error } = await supabase.storage.from('uploads').upload(filePath, file);
  if (error) throw error;
  return supabase.storage.from('uploads').getPublicUrl(filePath).data.publicUrl;
};

const nextStep = () => {
  if (step.value < 3) step.value++;
};
const prevStep = () => {
  if (step.value > 1) step.value--;
};

const submitStore = async () => {
  try {
    // ✅ Validate required fields before submitting
    if (!storeName.value.trim()) {
      alert('Store name is required.');
      step.value = 1;
      return;
    }

    if (selectedPayments.value.length === 0) {
      alert('Please select at least one payment method.');
      step.value = 2;
      return;
    }

    if (selectedPayments.value.includes('gcash') && !gcashNumber.value.trim()) {
      alert('Please enter your GCash number.');
      step.value = 2;
      return;
    }

    const validProducts = products.value.filter(p => p.name.trim() && p.price > 0);
    if (validProducts.length === 0) {
      alert('Please add at least 1 valid product with name and price.');
      step.value = 3;
      return;
    }

    // ✅ FIXED: use getSession instead of getUser
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user || sessionError) {
      throw new Error('User is not authenticated');
    }

    let storeImageUrl = '';
    if (storeImage.value) {
      storeImageUrl = await uploadImageToStorage(storeImage.value, 'store-images');
    }

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert([{
        user_id: user.id,
        name: storeName.value,
        description: description.value,
        image_url: storeImageUrl,
        payment_methods: selectedPayments.value,
        delivery_available: false,
        delivery_rate: 0,
        gcash_number: selectedPayments.value.includes('gcash') ? gcashNumber.value : null,
      }])
      .select()
      .single();

    if (storeError) throw storeError;

    for (const p of validProducts) {
      let productImageUrl = '';
      if (p.image) {
        productImageUrl = await uploadImageToStorage(p.image, 'product-images');
      }

      await supabase.from('products').insert([{
        store_id: store.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: productImageUrl,
      }]);
    }

    router.push('/seller');
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

</script>

<style scoped>
.seller-setup {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f9d29d 0%, #ffd6e0 100%);
}
.setup-card {
  background: #fffbe9;
  padding: 2.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
}
.setup-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #e1701a;
  font-family: 'Montserrat', 'Quicksand', Arial, sans-serif;
  letter-spacing: 1px;
}
.step-header {
  font-weight: 700;
  margin-bottom: 1rem;
  color: #6366f1;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
.signup-input,
textarea.signup-input {
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 1rem;
  border-radius: 7px;
  border: 1.5px solid #f7b267;
  font-size: 16px;
  background: #fff;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
  transition: border-color 0.2s;
  box-sizing: border-box;
  resize: none;
}
.signup-input:focus,
textarea.signup-input:focus {
  border-color: #e1701a;
  outline: none;
}
input::placeholder,
textarea::placeholder {
  color: #bfa76a;
  font-family: 'Quicksand', 'Montserrat', Arial, sans-serif;
}


.file-input {
  margin-top: 0.5rem;
}
.upload-label {
  display: block;
  margin-bottom: 1rem;
  color: #7c5e2c;
  font-weight: 600;
}
.payment-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.payment-tile {
  border: 1.5px solid #f7b267;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: #fff;
  color: #e1701a;
  font-weight: 600;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.payment-tile.selected {
  background-color: #e1701a;
  color: white;
  border-color: #e1701a;
}
.cod-desc {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
}
.product-input-outer {
  background: #fff;
  border: 1.5px solid #e0e7ff;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px #6366f11a;
}
.product-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.add-btn {
  background: #f7b267;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  cursor: pointer;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.add-btn:disabled {
  background: #ffe5b4;
  color: #bfa76a;
  cursor: not-allowed;
}

.delete-btn {
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  align-self: flex-end;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #b94a48;
}
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}
.next-btn,
.back-btn,
.signup-button {
  background: #e1701a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: background 0.2s;
}
.next-btn:hover,
.back-btn:hover,
.signup-button:hover {
  background: #b94a48;
}
</style>
