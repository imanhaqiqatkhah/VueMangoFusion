<template>
  <div class="col-6 col-md-4 col-lg-3 col-xl-3">
    <div class="card h-100 border-0 shadow-sm rounded-4 card-hover">
      <div class="position-relative overflow-hidden">
        <img
          :src="CONFIG_IMAGE_URL + menuItem.image"
          class="card-img-top rounded-top-4 w-100 object-fit-cover image-zoom"
          style="height: 200px"
          alt="تصویر محصول"
        />
        <!-- View Details Button -->
        <div class="position-absolute top-0 end-0 m-2">
          <button
            class="btn btn-light btn-sm rounded shadow-sm d-flex align-items-center gap-2 backdrop-blur-sm bg-opacity-75 button-hover"
            title="مشاهده ویژگی"
            style="backdrop-filter: blur(4px)"
            @click="emit('showDetails', menuItem)"
          >
            <i class="bi bi-eye text-dark"></i><span class="text-dark small">مشخصات</span>
          </button>
        </div>
      </div>
      <div class="card-body p-3 p-sm-4">
        <!-- Title and Price -->
        <div class="d-flex justify-content-between align-items-end mb-2">
          <h5 class="card-title mb-0 small fw-semibold text-truncate pe-2">{{ menuItem.name }}</h5>
          <div class="d-flex align-items-center me-2">
            <span class="fw-semibold text-dark price-animate"
              >{{ (menuItem.price / 10).toFixed(3) }} تومان</span
            >
          </div>
        </div>
        <!-- Description -->
        <p class="card-text text-body-secondary small mb-2 text-truncate d-none d-sm-block">
          {{ menuItem.description }}
        </p>
        <div class="mb-2">
          <Rating :rating="menuItem.rating" :item-id="menuItem.id" :readonly="true" />
        </div>
        <!-- Tags -->
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div
            class="d-flex align-items-center btn btn-outline-secondary disabled px-2 py-1 small tag-hover"
            v-if="menuItem.specialTag"
          >
            <i class="bi bi-star"></i>&nbsp;
            <span class="small text-body-secondary">{{ menuItem.specialTag }}</span>
          </div>
          <div
            class="d-flex align-items-center btn btn-outline-secondary disabled px-2 py-1 small tag-hover"
          >
            <i class="bi bi-tag-fill"></i>&nbsp;
            <span class="small text-body-secondary text-uppercase">{{ menuItem.category }}</span>
          </div>
        </div>
        <!-- Cart Controls -->
        <div class="d-flex align-items-center justify-content-between">
          <button
            class="btn btn-warning w-100 rounded py-2 add-to-cart-btn"
            @click="addToCart"
            :disabled="isProcessing"
            v-if="!isInCart"
          >
            <span class="spinner-border spinner-border-sm ms-2" v-if="isProcessing"></span>
            <span class="small"><i class="bi bi-cart-plus"></i>&nbsp; افزودن به سبد خرید</span>
          </button>

          <div dir="ltr" class="input-group input-group-sm w-100 cart-controls" v-else>
            <button
              class="btn btn-outline-secondary quantity-btn"
              type="button"
              @click="decreaseQuantity"
            >
              <i class="bi bi-dash"></i>
            </button>
            <input
              type="text"
              class="form-control text-center px-2 quantity-input"
              readonly
              :value="itemQuantity"
              style="max-width: 50px"
            /><button
              class="btn btn-outline-secondary quantity-btn"
              type="button"
              @click="increaseQuantity"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CONFIG_IMAGE_URL } from '@/constants/config'
import { useCartStore } from '@/stores/cartStore'
import { computed, ref } from 'vue'
import Rating from '../shared/Rating.vue'
const cartStore = useCartStore()
const isProcessing = ref(false)
const emit = defineEmits(['showDetails'])
const props = defineProps({
  menuItem: Object,
})

const cartItem = computed(() => cartStore.cartItems.find((item) => item.id === props.menuItem.id))
const isInCart = computed(() => !!cartItem.value)
const itemQuantity = computed(() => cartItem.value?.quantity || 0)

const addToCart = () => {
  isProcessing.value = true
  setTimeout(() => {
    cartStore.addToCart(props.menuItem)
    isProcessing.value = false
  }, 300)
}

const increaseQuantity = () => {
  cartStore.updateQuantity(props.menuItem.id, itemQuantity.value + 1)
}

const decreaseQuantity = () => {
  if (itemQuantity.value > 1) {
    cartStore.updateQuantity(props.menuItem.id, itemQuantity.value - 1)
  } else {
    cartStore.removeFromCart(props.menuItem.id)
  }
}
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.image-zoom {
  transition: transform 0.5s ease;
}

.card-hover:hover .image-zoom {
  transform: scale(1.05);
}

.button-hover {
  transition: all 0.2s ease;
}

.button-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.price-animate {
  position: relative;
  transition: all 0.3s ease;
}

.card-hover:hover .price-animate {
  color: #ff6b35 !important;
  transform: scale(1.05);
}

.tag-hover {
  transition: all 0.2s ease;
}

.tag-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}

.cart-controls {
  transition: all 0.3s ease;
}

.quantity-btn {
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background-color: #f8f9fa;
  transform: scale(1.1);
}

.quantity-input {
  transition: all 0.2s ease;
}

.quantity-input:focus {
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.25);
  border-color: #ffc107;
}

/* انیمیشن برای افزودن به سبد خرید */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

.add-to-cart-btn:not(:disabled) {
  animation: pulse 2s infinite;
}

/* انیمیشن برای تغییرات مقدار */
.quantity-input {
  transition: all 0.3s ease;
}

.quantity-input:focus {
  transform: scale(1.05);
}

/* انیمیشن برای بارگذاری */
.spinner-border {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* انیمیشن برای نمایش جزئیات */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>