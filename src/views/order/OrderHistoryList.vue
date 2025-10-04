<template>
  <div class="container py-5">
    <div class="d-flex align-items-center mb-4">
      <i class="bi bi-bag" style="font-size: 2.5rem"></i>&nbsp;
      <h1 class="mb-0">سفارشات من</h1>
    </div>

    <div class="text-center py-5">
      <p class="text-body-secondary">در حال بارگیری سفارشات</p>
    </div>
    <div class="text-center py-5">
      <div class="bg-body-tertiary rounded-4 p-5">
        <i class="bi bi-bag" style="font-size: 2.5rem"></i>
        <h3 class="mb-3">هنوز سفارشی نیست</h3>
        <p class="text-body-secondary mb-4">اینجا بهترین خدمات ارائه میشه ، برای خرید جستجو کنید</p>
        <a href="#" class="btn btn-primary btn-lg">
          <i class="bi bi-menu-button-wide ms-2"></i>شروع به خرید</a
        >
      </div>
    </div>
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <!-- Order Card -->
        <OrderListCard />
      </div>
    </div>
  </div>
</template>

<script setup>
import OrderListCard from '@/components/card/OrderListCard.vue'
</script>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>