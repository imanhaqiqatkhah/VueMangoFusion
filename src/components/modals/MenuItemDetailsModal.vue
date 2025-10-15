<template>
  <div
    v-if="show"
    class="position-fixed top-0 end-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
    style="z-index: 1050"
  >
    <div
      class="modal-dialog modal-dialog-centered m-0 modal-size d-flex flex-column rounded-4"
      style="pointer-events: auto"
    >
      <div
        class="modal-content rounded-4 border-0 rounded-0 rounded-md-4 bg-body h-100 d-flex flex-column"
      >
        <!-- Header -->
        <div
          class="position-relative modal-header w-100 d-flex justify-content-between border-0 bg-warning bg-opacity-10 px-3 px-sm-4 py-3 rounded-top-0 rounded-md-top-4 sticky-top"
        >
          <h5 class="modal-title d-flex align-items-center gap-2 mb-0 fe-5 fe-sm-4">
            <i class="bi bi-card-heading"></i><span>منوی مشخصات</span>
          </h5>
          <button
            type="button"
            class="position-absolute start-0 ms-4 btn-close"
            aria-label="Close menu details"
            @click="handleClose"
          ></button>
        </div>
        <!-- Body - Scrollable Content -->
        <div class="modal-body p-3 p-sm-4 overflow-auto">
          <div class="row g-3 g-sm-4">
            <!-- Image Column -->
            <div class="col-12 col-md-6">
              <div class="position-relative">
                <img
                  :src="CONFIG_IMAGE_URL + menuItem.image"
                  class="rounded-4 w-100 object-fit-cover"
                  style="max-height: 300px; min-height: 300px"
                />
                <div class="position-absolute top-0 start-0 m-2 m-sm-3">
                  <span
                    class="badge bg-warning text-dark rounded-pill px-2 px-sm-3 py-1 py-sm-2 d-flex align-items-center gap-1 fe-6 fe-sm-5"
                    >{{ (menuItem.price / 10).toFixed(3) }} تومان
                  </span>
                </div>
              </div>
            </div>
            <!-- Details Column -->
            <div class="col-12 col-md-6">
              <div class="d-flex flex-column gap-3 gap-sm-4">
                <!-- Name -->
                <div>
                  <div class="text-secondary small mb-1">
                    <i class="bi bi-card-text ms-1"></i>نام
                  </div>
                  <h4 class="fw-bold mb-0 fe-5 fe-sm-4">{{ menuItem.name }}</h4>
                </div>
                <div class="">
                  <Rating :rating="menuItem.rating" :item-id="menuItem.id" :readonly="true" />
                </div>
                <!-- Category -->
                <div>
                  <div class="text-secondary small mb-1">
                    <i class="bi bi-tag ms-1"></i>دسته بندی
                  </div>
                  <div
                    class="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 px-sm-3 py-1 py-sm-2 fe-6 fe-sm-6"
                  >
                    {{ menuItem.category }}
                  </div>
                </div>
                <!-- Special Tag -->
                <div v-if="menuItem.specialTag">
                  <div class="text-secondary small mb-1">
                    <i class="bi bi-star ms-1"></i>تگ اجتماعی
                  </div>
                  <div
                    class="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 px-sm-3 py-1 py-sm-2 fe-6 fe-sm-6"
                  >
                    {{ menuItem.specialTag }}
                  </div>
                </div>
                <!-- Description -->
                <div>
                  <div class="text-secondary small mb-1">
                    <i class="bi bi-card-text ms-1"></i>توضیحات
                  </div>
                  <p class="mb-0">{{ menuItem.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div class="modal-footer border-0 px-3 px-sm-4 pb-3 pb-sm-4 sticky-bottom bg-body">
          <button
            type="button"
            @click="handleClose"
            class="btn btn-outline-secondary rounded-pill px-3 px-sm-4 w-100"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Rating from '../shared/Rating.vue'
import { CONFIG_IMAGE_URL } from '@/constants/config'

const props = defineProps({
  show: Boolean,
  menuItem: Object,
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
* {
  direction: rtl;
}
@media (max-width: 576px) {
  .modal-size {
    width: 85%;
    height: 85%;
  }
}
@media (min-width: 577px) {
  .modal-size {
    width: 50%;
    height: 65%;
  }
}
</style>