<template>
  <div class="container py-5">
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">سفارش شماس</h4>
      </div>
      <div class="card-body text-center">
        <div class="text-center my-2">
          <div class="alert alert-primary d-inline-block px-5 py-3 fe-4" role="alert">
            <strong>متشکرم!</strong>سفارش شما ثبت شد.
          </div>
        </div>
        <p><strong>شماره سفارش: </strong>#{{ orderId }}</p>
        <p><strong>تاریخ: </strong>{{ new Date().toLocaleDateString() }}</p>
        <img
          src="/src/assets/confirm.jpg"
          alt="Order Configuration"
          style="width: 500px; object-fit: cover"
          class="img-fluid rounded-3 mb-3"
        />
      </div>
      <p class="px-3 text-center">سفارش شما در حال آماده سازی است، از خرید شما متشکریم</p>
    </div>
    <div class="text-center">
      <a href="/" class="btn btn-primary px-4">برگشت به صفحه اصلی</a>
    </div>
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
const orderId = ref(route.params.orderid)
</script>



<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>