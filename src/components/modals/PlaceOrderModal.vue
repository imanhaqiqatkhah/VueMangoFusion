<template>
  <div
    v-if="isModalOpen"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title flex-grow-1">تکمیل اطلاعات سفارش</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitOrder">
            <!-- نام -->
            <div class="mb-3">
              <label class="form-label">نام</label>
              <input
                v-model="orderData.pickUpName"
                type="text"
                class="form-control"
                placeholder="نام شما"
              />
            </div>

            <!-- شماره تلفن -->
            <div class="mb-3">
              <label>شماره تلفن <span class="text-danger">*</span></label>
              <input
                v-model="orderData.pickUpPhoneNumber"
                type="tel"
                class="form-control"
                placeholder="09xxxxxxxxx"
                required
              />
              <small class="text-muted">
                <i class="bi bi-info-circle"></i>
                برای پیگیری سفارش نیاز به شماره تلفن داریم
              </small>
            </div>

            <!-- ایمیل -->
            <div class="mb-4">
              <label class="form-label">ایمیل</label>
              <input
                v-model="orderData.pickUpEmail"
                type="email"
                class="form-control"
                placeholder="ایمیل شما"
              />
            </div>

            <!-- سبد خرید -->
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
              <div v-else class="text-center text-muted">سبد خرید خالی است</div>
            </div>

            <!-- خطاها -->
            <div class="alert alert-danger" v-if="errorList.length > 0">
              <span v-for="error in errorList" :key="error" class="d-block">{{ error }}</span>
            </div>

            <!-- دکمه‌ها -->
            <div class="d-flex justify-content-start gap-2">
              <button type="button" class="btn btn-outline-secondary px-4" @click="closeModal">
                کنسل
              </button>
              <button
                type="submit"
                class="btn btn-warning px-4"
                :disabled="isSubmitting || !cartStore.cartItems || cartStore.cartItems.length === 0"
              >
                <span v-if="isSubmitting" class="d-flex align-items-center gap-2">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">در حال بارگیری...</span>
                  </div>
                  در حال پردازش
                </span>
                <span v-else>سفارش دهید</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useSwal } from '@/composables/swal'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import orderService from '@/services/orderService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { showSuccess, showError } = useSwal()

// Props و Emits
const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])

// state
const isModalOpen = ref(false)
const orderData = reactive({
  pickUpName: '',
  pickUpPhoneNumber: '',
  pickUpEmail: '',
  orderTotal: 0,
  totalItem: 0,
  orderDetailsDTO: [],
})

const isSubmitting = ref(false)
const errorList = reactive([])

// پر کردن خودکار اطلاعات کاربر
// پر کردن خودکار اطلاعات کاربر
const fillUserData = async () => {
  console.log('🔄 fillUserData called')

  if (authStore.isAuthenticated) {
    const savedUserData = localStorage.getItem('userData')

    console.log('🔍 AuthStore user:', authStore.user)
    console.log('🔍 AuthStore phoneNumber:', authStore.user.phoneNumber)

    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      console.log('✅ Data from localStorage:', userData)

      orderData.pickUpName = userData.name || ''
      orderData.pickUpEmail = userData.email || ''

      // 🔴 اول از authStore بگیر، اگر نبود از localStorage
      orderData.pickUpPhoneNumber = authStore.user.phoneNumber || userData.phoneNumber || ''

      orderData.deliveryAddress = userData.address || ''
      orderData.applicationUserId = userData.id || authStore.user.id || ''

      console.log('📝 Final filled data:')
      console.log('- Name:', orderData.pickUpName)
      console.log('- Email:', orderData.pickUpEmail)
      console.log('- Phone (from authStore):', authStore.user.phoneNumber)
      console.log('- Phone (from localStorage):', userData.phoneNumber)
      console.log('- Phone (final):', orderData.pickUpPhoneNumber)
    }
  }
}

// تماشای تغییرات props
watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal
    if (newVal) {
      fillUserData()
    }
  }
)

const submitOrder = async () => {
  try {
    isSubmitting.value = true
    errorList.length = 0

    // اعتبارسنجی ساده
    if (!orderData.pickUpName) errorList.push('نام را وارد کنید')
    if (!orderData.pickUpPhoneNumber) errorList.push('شماره تلفن را وارد کنید')
    if (!orderData.pickUpEmail) errorList.push('ایمیل را وارد کنید')

    if (errorList.length > 0) {
      isSubmitting.value = false
      return
    }

    // آماده‌سازی داده‌های سفارش
    orderData.orderTotal = cartStore.cartTotal
    orderData.totalItem = cartStore.cartCount
    orderData.orderDetailsDTO = cartStore.cartItems.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
      itemName: item.name,
      price: item.price,
    }))

    // ارسال سفارش
    const orderHeader = await orderService.createOrder(orderData)

    if (orderHeader?.orderHeaderId > 0) {
      cartStore.clearCart()
      showSuccess('سفارش شما با موفقیت ثبت شد')
      router.push({
        name: APP_ROUTE_NAMES.ORDER_CONFIRM,
        params: { orderId: orderHeader.orderHeaderId },
      })
      closeModal()
    }
  } catch (err) {
    errorList.push('خطا در ثبت سفارش')
    console.error('Error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  isModalOpen.value = false
  emit('close')
  errorList.length = 0
}
</script>

<style scoped>
* {
  direction: rtl;
  font-family: 'Yekan';
}
</style>