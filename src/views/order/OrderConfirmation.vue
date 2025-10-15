<template>
  <div class="container py-5">
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-warning text-white">
        <h4 class="mb-0">سفارش شما</h4>
      </div>
      <div class="card-body text-center">
        <div class="text-center my-2">
          <div class="alert alert-warning d-inline-block px-5 py-3 fe-4" role="alert">
            <strong>متشکرم!</strong><br />
            سفارش شما ثبت شد.
          </div>
        </div>
        <p><strong>شماره سفارش: </strong>#{{ orderId }}</p>
        <p><strong>تاریخ: </strong>{{ persianDate }}</p>
        <img
          src="/src/assets/mini-logo.png"
          alt="Order Configuration"
          style="width: 200px; object-fit: cover"
          class="img-fluid rounded-3 mb-3"
        />
      </div>
      <p class="px-3 text-center">سفارش شما در حال آماده سازی است، از خرید شما متشکریم</p>
    </div>
    <div class="text-center">
      <a href="/" class="btn btn-warning px-4">برگشت به صفحه اصلی</a>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
const orderId = ref(route.params.orderId)
import { usePersianDate } from '@/composables/persianDate'

const { toPersianDate, toPersianDateWithTime, toPersianDateFormatted } = usePersianDate()

const persianDate = computed(() => toPersianDate())
const persianDateWithTime = computed(() => toPersianDateWithTime())
const persianDateFormatted = computed(() => toPersianDateFormatted())
</script>



<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>