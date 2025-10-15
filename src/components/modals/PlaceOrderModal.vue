<template>
  <div
    v-if="isOpen"
    class="position-fixed top-0 end-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
    style="z-index: 1050"
  >
    <div
      class="bg-body p-4 rounded-4 shadow-lg mx-3 overflow-auto"
      style="max-width: 500px; width: 100%; max-height: 90vh"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold m-0">تکمیل سفارش شما</h4>
        <button class="btn" @click="closeModal"><i class="bi bi-x-circle"></i></button>
      </div>
      <div v-if="errorList.length > 0" class="alert alert-danger" role="alert">
        <span class="d-block" v-for="error in errorList" :key="error">{{ error }}</span>
      </div>
      <form @submit.prevent="submitOrder">
        <div class="mb-3">
          <label for="pickupName" class="form-label">نام</label>
          <input v-model="orderData.pickUpName" type="text" class="form-control" id="pickupName" />
        </div>

        <div class="mb-3">
          <label for="pickupPhoneNumber">شماره تلفن</label>
          <input
            v-model="orderData.pickUpPhoneNumber"
            type="tel"
            class="form-control"
            id="pickupPhoneNumber"
          />
        </div>
        <div class="mb-4">
          <label for="pickupEmail" class="form-label">ایمیل</label>
          <input
            v-model="orderData.pickUpEmail"
            type="email"
            class="form-control"
            id="pickupEmail"
          />
        </div>

        <div class="bg-body-tertiary rounded-3 p-3 mb-4">
          <h5 class="fw-bold mb-3">سفارش شما</h5>
          <div v-if="cartStore.cartItems && cartStore.cartItems.length > 0">
            <div
              class="d-flex justify-content-between align-items-center mb-2"
              v-for="item in cartStore.cartItems"
              :key="item.id"
            >
              <span class="fw-medium">{{ item.name }}</span>
              <div class="d-flex align-items-center gap-3">
                <span class="fw-medium"> {{ item.quantity }} * </span>
                <span class="fw-medium">{{ item.price.toFixed(3) }}</span>
              </div>
            </div>
            <div class="border-top pt-3 mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">قیمت کل</span>
                <span class="fw-bold fe-5">{{ cartStore.cartTotal.toFixed(3) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-start gap-2">
          <button type="button" class="btn btn-outline-secondary px-4" @click="closeModal">
            کنسل
          </button>
          <button
            tabindex="submit"
            class="btn btn-warning px-4"
            :disabled="isSubmitting || !cartStore.cartItems || cartStore.cartItems.length === 0"
          >
            <span v-if="isSubmitting" class="d-flex align-items-center gap-2">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">در حال بارگیری...</span>
              </div>
              در حال پردازش </span
            ><span v-else>سفارش دهید </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import orderService from '@/services/orderService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useSwal } from '@/composables/swal'
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const { showSuccess, showError } = useSwal()
const isSubmitting = ref(false)
const errorList = reactive([])

const orderData = reactive({
  pickUpName: '',
  pickUpPhoneNumber: '',
  pickUpEmail: '',
  applicationUserId: '',
  orderTotal: 0,
  totalItem: 0,
  orderDetailsDTO: [],
})

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    orderData.applicationUserId = authStore.user.id
    orderData.pickUpName = authStore.user.name
    orderData.pickUpEmail = authStore.user.email
  }
})

const submitOrder = async () => {
  try {
    isSubmitting.value = true
    errorList.length = 0

    // اعتبارسنجی‌های بهتر
    if (!orderData.pickUpName || orderData.pickUpName.trim().length === 0) {
      errorList.push('نام را وارد کنید')
    }
    if (!orderData.pickUpPhoneNumber || orderData.pickUpPhoneNumber.trim().length === 0) {
      errorList.push('شماره تلفن را وارد کنید')
    }
    if (!orderData.pickUpEmail || orderData.pickUpEmail.trim().length === 0) {
      errorList.push('ایمیل را وارد کنید')
    }

    // اعتبارسنجی ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (orderData.pickUpEmail && !emailRegex.test(orderData.pickUpEmail)) {
      errorList.push('فرمت ایمیل نامعتبر است')
    }

    if (errorList.length > 0) {
      isSubmitting.value = false
      return
    }

    // آماده‌سازی داده‌های سفارش
    orderData.orderTotal = cartStore.cartTotal
    orderData.totalItem = cartStore.cartCount

    orderData.orderDetailsDTO = Array.isArray(cartStore.cartItems)
      ? cartStore.cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
          itemName: item.name,
          price: item.price,
        }))
      : []

    console.log('Order data:', orderData)

    // ارسال سفارش
    const orderHeader = await orderService.createOrder(orderData)

    if (orderHeader && orderHeader.orderHeaderId > 0) {
      // ✅ حذف سبد خرید بعد از ثبت موفقیت‌آمیز سفارش
      cartStore.clearCart()

      showSuccess('سفارش شما با موفقیت ثبت شد')

      // هدایت به صفحه تأیید سفارش
      router.push({
        name: APP_ROUTE_NAMES.ORDER_CONFIRM,
        params: { orderId: orderHeader.orderHeaderId },
      })

      // بستن مودال
      closeModal()
    } else {
      throw new Error('پاسخ نامعتبر از سرور')
    }
  } catch (err) {
    console.error('Error in submitOrder:', err)

    // نمایش خطای بهتر
    const errorMessage =
      err.response?.data?.errorMessages?.join(', ') ||
      err.response?.data?.message ||
      err.message ||
      'خطا در ثبت سفارش'

    errorList.push(errorMessage)
    showError('خطا در ثبت سفارش')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
</style>