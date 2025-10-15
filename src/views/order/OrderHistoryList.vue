<template>
  <div class="container py-5">
    <div class="d-flex align-items-center mb-4">
      <i class="bi bi-bag" style="font-size: 2.5rem"></i>&nbsp;
      <h1 class="mb-0">سفارشات من</h1>
    </div>

    <div class="text-center py-5" v-if="loading">
      <p class="text-body-secondary">در حال بارگیری سفارشات</p>
    </div>

    <div class="text-center py-5" v-else-if="orders.length === 0">
      <div class="bg-body-tertiary rounded-4 p-5">
        <i class="bi bi-bag" style="font-size: 2.5rem"></i>
        <h3 class="mb-3">هنوز سفارشی نیست</h3>
        <p class="text-body-secondary mb-4">اینجا بهترین خدمات ارائه میشه ، برای خرید جستجو کنید</p>
        <router-link :to="{ name: APP_ROUTE_NAMES.HOME }" class="btn btn-warning btn-lg">
          <i class="bi bi-menu-button-wide ms-2"></i>شروع به خرید</router-link
        >
      </div>
    </div>
    <div class="row g-4" v-else>
      <div class="col-md-6 col-lg-4" v-for="order in orders" :key="order.orderHeaderId">
        <!-- Order Card -->
        <OrderListCard :order="order" @rate="rateItem" />
      </div>
    </div>
  </div>
</template>

<script setup>
import OrderListCard from '@/components/card/OrderListCard.vue'
import { useAuthStore } from '@/stores/authStore'
import orderService from '@/services/orderService'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

const authStore = useAuthStore()
const orders = reactive([])
const loading = ref(false)

const fetchOrders = async () => {
  orders.length = 0
  loading.value = true
  try {
    var result = await orderService.getOrders(authStore.user.id)
    orders.push(...result)
    console.log(orders)
  } catch (error) {
    console.log('Error fetch orders:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

const rateItem = async (orderDetailId, rating) => {
  try {
    console.log('Order History', orderDetailId)
    var result = await orderService.submitRating(orderDetailId, rating)

    const orderDetail = orders
      .flatMap((order) => order.orderDetails)
      .find((detail) => detail.orderDetailId === orderDetailId)

    if (orderDetail) {
      orderDetail.rating = rating
    }
  } catch (error) {
    console.log('Error rating item:', error)
  }
}
</script>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>