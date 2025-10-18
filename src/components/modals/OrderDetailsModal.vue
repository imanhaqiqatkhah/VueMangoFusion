<template>
  <div
    v-if="order"
    class="position-fixed top-0 end-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
    style="z-index: 1050"
  >
    <div
      class="bg-body p-4 rounded-4 shadow-lg mx-3 overflow-auto"
      style="max-width: 800px; width: 100%; max-height: 90vh"
    >
      <div class="modal-content border-0 rounded-4 bg-body">
        <div class="sticky-top bg-body p-3 p-sm-4 border-bottom">
          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-end align-items-sm-center gap-3 mb-2"
          >
            <div class="d-flex align-items-center">
              <i class="bi bi-receipt-cutoff ps-1 text-dark"></i>
              <h5 class="mb-0 fe-5 text-dark"># سفارش {{ order.orderHeaderId }}</h5>
            </div>
            <button
              @click="closeModal"
              class="btn-close me-auto me-sm-0"
              aria-label="Close modal"
            ></button>
          </div>
          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-end align-items-sm-center gap-2"
          >
            <div class="d-flex align-items-center">
              <i class="bi bi-calendar ps-1 text-secondary"></i>
              <span class="text-body-secondary small me-2">تاریخ ثبت: </span>
              <span class="fw-medium"> {{ formatOrderDate(order.orderDate) }} </span>
            </div>
            <span :class="getStatusBadgeClass(order.status)" class="badge rounded-pill px-3 py-2">
              {{ getStatusPersian(order.status) }}
            </span>
          </div>
        </div>
        <div class="modal-body-scrollable p-3 p-sm-4" style="max-height: 70vh; overflow-y: auto">
          <!-- 🔥 بخش آدرس تحویل - فقط برای ادمین -->
          <div v-if="authStore.isAdmin" class="card border-0 shadow-sm mb-4">
            <div class="card-body p-3">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-geo-alt text-dark ms-2"></i>
                <h6 class="card-title mb-0">آدرس تحویل</h6>
              </div>
              <div v-if="order.deliveryAddress" class="bg-light rounded-2 p-3">
                <p class="mb-0 text-dark">{{ order.deliveryAddress }}</p>
              </div>
              <div v-else class="text-center text-body-secondary py-2">
                <i class="bi bi-info-circle me-1"></i>
                آدرس تحویل ثبت نشده است
              </div>
            </div>
          </div>
          <div class="row g-3 g-md-4 mb-4">
            <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-person-circle ps-1"></i>
                    <h6 class="card-title mb-0">اطلاعات گیرنده</h6>
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-fill ps-1"></i>
                      <span class="small">{{ order.pickUpName }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-telephone-fill ps-1"></i>
                      <span class="small">{{ order.pickUpPhoneNumber }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-envelope ps-1"></i>
                      <span class="small text-break">{{ order.pickUpEmail }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-currency-dollar text-secondary ms-2"></i>
                    <h6 class="card-title mb-0">اطلاعات مالی</h6>
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-body-secondary small">کل آیتم</span>
                      <span class="fw-bold">{{ order.totalItem }}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-body-secondary small">جمع کل</span>
                      <span class="fw-bold text-dark"
                        >{{ (order.orderTotal / 10).toFixed(3) }} تومان</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Order Items -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-3">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-list-check text-dark ms-2"></i>
                <h6 class="card-title mb-0">آیتم های سفارش</h6>
              </div>
              <div class="table-responsive">
                <template v-if="order.orderDetails?.length">
                  <div
                    v-for="item in order.orderDetails"
                    :key="item.orderDetails"
                    class="d-flex justify-content-between align-items-center py-2 border-bottom gap-3"
                  >
                    <div class="d-flex align-items-center flex-grow-1 min-width-0">
                      <i class="bi bi-dash"></i>
                      <span class="text-truncate small">{{
                        item.menuItem?.name || item.itemName
                      }}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                      <span class="badge bg-info-subtle text-info">{{ item.quantity }} </span>*<span
                        class="text-body-secondary small"
                        >{{ (item.price / 10).toFixed(3) }} تومان</span
                      >
                    </div>
                  </div>
                </template>
                <div v-else class="text-center text-body-secondary py-3 small">
                  هیچ آیتمی در سفارش نیست
                </div>
              </div>
            </div>
          </div>

          <!-- Order Status -->
          <div class="card border-0 shadow-sm">
            <div class="card-body p-3">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-gear text-dark ms-2" width="20"></i>
                <h6 class="card-title mb-0">وضعیت سفارش</h6>
              </div>
              <!-- Status Flow Button -->
              <div
                class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mb-3"
              >
                <button
                  :class="[
                    'btn flex-fill',
                    getStatusButtonClass(ORDER_STATUS_CONFIRMED),
                    isStatusDisabled(ORDER_STATUS_CONFIRMED) ? 'opacity-50' : '',
                  ]"
                  :disabled="isStatusDisabled(ORDER_STATUS_CONFIRMED)"
                >
                  <i class="bi bi-clock ms-1"></i>
                  <span class="small">تایید شده</span>
                </button>

                <div class="d-none d-sm-block text-secondary">
                  <i class="bi bi-arrow-left"></i>
                </div>

                <button
                  :class="[
                    'btn flex-fill',
                    getStatusButtonClass(ORDER_STATUS_READY_FOR_PICKUP),
                    isStatusDisabled(ORDER_STATUS_READY_FOR_PICKUP) ? 'opacity-50' : '',
                  ]"
                  @click="updateStatus(ORDER_STATUS_READY_FOR_PICKUP)"
                  :disabled="isStatusDisabled(ORDER_STATUS_READY_FOR_PICKUP)"
                >
                  <i class="bi bi-gear ms-1"></i>
                  <span class="small">آماده برای تحویل</span>
                </button>

                <div class="d-none d-sm-block text-secondary">
                  <i class="bi bi-arrow-left"></i>
                </div>

                <button
                  :class="[
                    'btn flex-fill',
                    getStatusButtonClass(ORDER_STATUS_COMPLETED),
                    isStatusDisabled(ORDER_STATUS_COMPLETED) ? 'opacity-50' : '',
                  ]"
                  @click="updateStatus(ORDER_STATUS_COMPLETED)"
                  :disabled="isStatusDisabled(ORDER_STATUS_COMPLETED)"
                >
                  <i class="bi bi-check ms-1"></i>
                  <span class="small">تکمیل شده</span>
                </button>
              </div>
              <!-- Cancel Button -->
              <button
                class="btn btn-outline-danger w-100"
                :class="{ 'opacity-50': isStatusDisabled(ORDER_STATUS_CANCELLED) }"
                @click="updateStatus(ORDER_STATUS_CANCELLED)"
                :disabled="isStatusDisabled(ORDER_STATUS_CANCELLED)"
              >
                <i class="bi bi-x-circle ms-1"></i>
                <span class="small">کنسل سفارش</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSwal } from '@/composables/swal'
import { usePersianDate } from '@/composables/persianDate'
import orderService from '@/services/orderService'
import { useAuthStore } from '@/stores/authStore' // 🔥 اضافه شد
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_PERSIAN,
} from '@/constants/constants'

const { showSuccess, showError, showConfirm } = useSwal()
const { toPersianDate } = usePersianDate()
const authStore = useAuthStore() // 🔥 اضافه شد

// Props
const props = defineProps({
  order: {
    type: Object,
    required: false,
    default: () => ({
      orderHeaderId: '',
      pickUpName: '',
      pickUpPhoneNumber: '',
      pickUpEmail: '',
      status: '',
      orderTotal: 0,
      orderDate: '',
      totalItem: 0,
      orderDetails: [],
    }),
  },
})

// Emits
const emit = defineEmits(['close', 'status-updated'])

// State
const isLoading = ref(false)

// ترتیب منطقی وضعیت‌ها
const STATUS_FLOW = [ORDER_STATUS_CONFIRMED, ORDER_STATUS_READY_FOR_PICKUP, ORDER_STATUS_COMPLETED]

// توابع
const closeModal = () => {
  emit('close')
}

const getStatusPersian = (status) => {
  return ORDER_STATUS_PERSIAN[status] || status
}

// تابع برای کلاس badge بر اساس وضعیت
const getStatusBadgeClass = (status) => {
  const statusClasses = {
    [ORDER_STATUS_CONFIRMED]: 'bg-warning-subtle text-warning-emphasis',
    [ORDER_STATUS_READY_FOR_PICKUP]: 'bg-info-subtle text-info-emphasis',
    [ORDER_STATUS_COMPLETED]: 'bg-success-subtle text-success-emphasis',
    [ORDER_STATUS_CANCELLED]: 'bg-danger-subtle text-danger-emphasis',
  }
  return statusClasses[status] || 'bg-secondary'
}

// تابع برای کلاس دکمه‌ها بر اساس وضعیت
const getStatusButtonClass = (status) => {
  const currentStatus = props.order.status

  if (currentStatus === status) {
    return (
      {
        [ORDER_STATUS_CONFIRMED]: 'btn-warning',
        [ORDER_STATUS_READY_FOR_PICKUP]: 'btn-info',
        [ORDER_STATUS_COMPLETED]: 'btn-success',
        [ORDER_STATUS_CANCELLED]: 'btn-danger',
      }[status] || 'btn-primary'
    )
  }

  return 'btn-outline-secondary'
}

const formatOrderDate = (dateString) => {
  if (!dateString) return 'تاریخ نامعتبر'

  try {
    const date = new Date(dateString)
    const persianDate = toPersianDate(date)
    const time = date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    return `${persianDate} - ${time}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'تاریخ نامعتبر'
  }
}

const updateStatus = async (newStatus) => {
  try {
    const confirmResult = await showConfirm(
      `آیا از تغییر وضعیت سفارش به "${getStatusPersian(newStatus)}" اطمینان دارید؟`
    )

    if (!confirmResult.isConfirmed) {
      return
    }

    isLoading.value = true

    await orderService.updateOrder(props.order.orderHeaderId, {
      orderHeaderId: props.order.orderHeaderId,
      status: newStatus,
      pickUpName: props.order.pickUpName,
      pickUpPhoneNumber: props.order.pickUpPhoneNumber,
      pickUpEmail: props.order.pickUpEmail,
    })

    showSuccess('وضعیت سفارش با موفقیت به روز شد')
    closeModal()
    // اطلاع به کامپوننت والد
    emit('status-updated', {
      orderHeaderId: props.order.orderHeaderId,
      newStatus: newStatus,
    })
  } catch (error) {
    console.error('خطا در تغییر وضعیت', error)
    showError('خطا در تغییر وضعیت سفارش')
  } finally {
    isLoading.value = false
  }
}

const isStatusDisabled = (status) => {
  const currentStatus = props.order.status

  // اگر وضعیت فعلی لغو شده یا تکمیل شده باشد، همه دکمه‌ها غیرفعال
  if (currentStatus === ORDER_STATUS_CANCELLED || currentStatus === ORDER_STATUS_COMPLETED) {
    return true
  }

  // اگر وضعیت درخواستی همان وضعیت فعلی باشد، غیرفعال شود
  if (currentStatus === status) {
    return true
  }

  // برای وضعیت لغو: همیشه فعال باشد (به جز وقتی که تکمیل شده)
  if (status === ORDER_STATUS_CANCELLED) {
    return false
  }

  // منطق flow مرحله‌ای - فقط مرحله بعدی فعال باشد
  const statusFlowMap = {
    [ORDER_STATUS_CONFIRMED]: [ORDER_STATUS_READY_FOR_PICKUP], // از تایید شده فقط به آماده تحویل
    [ORDER_STATUS_READY_FOR_PICKUP]: [ORDER_STATUS_COMPLETED], // از آماده تحویل فقط به تکمیل شده
    [ORDER_STATUS_COMPLETED]: [], // از تکمیل شده به هیچ‌جا
  }

  // اگر وضعیت فعلی در map نباشد، غیرفعال
  if (!statusFlowMap[currentStatus]) {
    return true
  }

  // فقط اگر وضعیت هدف در لیست وضعیت‌های مجاز باشد، فعال
  return !statusFlowMap[currentStatus].includes(status)
}
</script>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}

.modal-body-scrollable {
  scrollbar-width: thin;
  scrollbar-color: #dee2e6 #f8f9fa;
}

.modal-body-scrollable::-webkit-scrollbar {
  width: 6px;
}

.modal-body-scrollable::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.modal-body-scrollable::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.modal-body-scrollable::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

.min-width-0 {
  min-width: 0;
}
</style>