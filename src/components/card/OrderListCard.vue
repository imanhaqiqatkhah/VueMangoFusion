<template>
  <div class="card h-100 border-0 shadow-sm hover-shadow transition-all">
    <div class="card-header border-bottom-0 pt-4">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <i class="bi bi-receipt-cutoff text-dark ps-2" style="font-size: 2rem"></i>
          <h5 class="card-title mb-0"># سفارش {{ order.orderHeaderId }}</h5>
        </div>
        <span :class="getStatusBadgeClass(order.status)" class="badge rounded-pill">
          {{ getStatusPersian(order.status) }}
        </span>
      </div>
    </div>
    <div class="card-body">
      <div class="mb-4">
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-person-square text-dark ps-2" style="font-size: 1.5rem"></i>
          <div>
            <h6 class="mb-0">{{ order.pickUpName }}</h6>
            <small class="text-body-secondary">{{ order.pickUpPhoneNumber }}</small>
          </div>
        </div>
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-envelope text-dark ps-2"></i><span>{{ order.pickUpEmail }}</span>
        </div>
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-bag text-dark ps-2"> </i> <span> {{ order.totalItem }}</span>
        </div>
        <div class="d-flex align-items-center">
          <i class="bi bi-cash-coin text-dark ps-2"></i>
          <span class="fw-bold">{{ (order.orderTotal / 10).toFixed(3) }} تومان</span>
        </div>
      </div>
      <!-- 🔥 بخش آدرس -->
      <div class="mb-4" v-if="order.deliveryAddress">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-geo-alt text-dark ps-2"></i>
          <div>
            <h6 class="mb-1">آدرس تحویل</h6>
            <p class="text-body-secondary mb-0 small">{{ order.deliveryAddress }}</p>
          </div>
        </div>
      </div>
      <div class="bg-body-tertiary rounded-3 p-3">
        <div class="d-flex align-items-center mb-3 border-bottom pb-2">
          <i class="bi bi-card-list text-dark ps-2"></i>
          <h6 class="mb-0">آیتم سفارش</h6>
        </div>
        <div
          class="mb-3 pb-2 border-bottom"
          v-for="item in order.orderDetails"
          :key="item.orderDetailId"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center">
              <span class="text-truncate ms-3">{{ item.menuItem.name }}</span>
            </div>
            <div class="d-flex align-items-center">
              <span class="badge bg-secondary-subtle text-secondary ms-2"
                >{{ item.quantity }} *</span
              >
              <span class="text-body-secondary">{{ (item.price / 10).toFixed(3) }} تومان</span>
            </div>
          </div>
          <Rating @rate="onRateItem" :rating="item.rating" :item-id="item.orderDetailId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ORDER_STATUS, ORDER_STATUS_OPTIONS, ORDER_STATUS_PERSIAN } from '@/constants/constants'
import Rating from '../shared/Rating.vue'

const getStatusPersian = (status) => {
  return ORDER_STATUS_PERSIAN[status] || status
}

// تابع برای کلاس badge بر اساس وضعیت
const getStatusBadgeClass = (status) => {
  const statusClasses = {
    Confirmed: 'bg-warning-subtle text-warning-emphasis',
    'Ready for Pickup': 'bg-info-subtle text-info-emphasis',
    Completed: 'bg-primary-subtle text-warning-emphasis',
    Cancelled: 'bg-danger text-danger-emphasis',
  }
  return statusClasses[status] || 'bg-secondary'
}
const emit = defineEmits(['rate'])
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const onRateItem = (itemId, rating) => {
  console.log('OrderListCard', itemId)
  emit('rate', itemId, rating)
}
</script>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>