<template>
  <div
    v-if="order"
    class="position-fixed top-0 end-0 w-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
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
              <i class="bi bi-receipt-cutoff ps-1 text-primary"></i>
              <h5 class="mb-0 fe-5 text-primary"># سفارش</h5>
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
              <i class="bi bi-calender ps-1"></i>
              <span class="text-body-secondary">تاریخ ثبت سفارش</span>
            </div>
            <span>وضعیت</span>
          </div>
        </div>
        <div class="modal-body-scrollable p-3 p-sm-4" style="max-height: 70vh; overflow-y: auto">
          <div class="row g-3 g-md-4 mb-4">
            <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bu bi-person-circle ps-1"></i>
                    <h6 class="card-title mb-0">اطلاعات گیرنده</h6>
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-fill ps-1"></i>
                      <span class="small">نام</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-telephone-fill ps-1"></i>
                      <span class="small">شماره تلفن</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-envelope ps-1"></i>
                      <span class="small text-break">ایمیل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-currency-dollar text-primary ms-2"></i>
                    <h6 class="card-title mb-0">اطلاعات مالی</h6>
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-body-secondary small">کل آیتم</span>
                      <span class="fw-bold">تعداد</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-body-secondary small">جمع کل</span>
                      <span class="fw-bold text-primary">$$$</span>
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
                <i class="bi bi-list-check text-primary ms-2"></i>
                <h6 class="card-title mb-0">آیتم های سفارش</h6>
              </div>
              <div class="table-responsive">
                <template>
                  <div
                    class="d-flex justify-content-between align-items-center py-2 border-bottom gap-3"
                  >
                    <div class="d-flex align-items-center flex-grow-1 min-width-0">
                      <i class="bi bi-dash"></i>
                      <span class="text-truncate small">نام</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                      <span class="badge bg-primary-subtle text-primary">تعداد</span
                      ><span class="text-body-secondary small">قیمت</span>
                    </div>
                  </div>
                </template>
                <div class="text-center text-body-secondary py-3 small">
                  هیچ آیتمی در سفارش نیست
                </div>
              </div>
            </div>
          </div>

          <!-- Order Status -->
          <div class="card border-0 shadow-sm">
            <div class="card-body p-3">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-gear texttext-primary ms-2" width="20"></i>
                <h6 class="card-title mb-0">وضعیت سفارش</h6>
              </div>
              <!-- Status Flow Button -->
              <div
                class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mb-3"
              >
                <button class="btn btn-primary flex-fill">
                  <i class="bi bi-clock ms-1"></i>
                  <span class="small">تایید شده</span>
                </button>
                <div class="d-none d-sm-block text-secondary">
                  <i class="bi bi-arrow-left"></i>
                </div>
                <button class="btn btn-primary flex-fill">
                  <i class="bi bi-gear ms-1"></i><span class="small">آماده برای تحویل</span>
                </button>
                <div class="d-none d-sm-block text-secondary">
                  <i class="bi bi-arrow-left"></i>
                </div>
                <button class="'btn btn-primary flex-fill',">
                  <i class="bi bi-check ms-1"></i><span class="small">تحویل داده شده</span>
                </button>
              </div>
              <!-- Cancel Button -->
              <button class="btn btn-outline-danger w-100">
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
const emit = defineEmits(['close'])

const props = defineProps({
  order: {
    type: Object,
    required: false,
    default: () => ({
      orderHeaderId: '',
      pickupName: '',
      pickupPhoneNumber: '',
      pickupEmail: '',
      status: '',
      orderTotal: 0,
      orderDate: '',
      totalItems: 0,
      orderDetails: [],
    }),
  },
})

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>