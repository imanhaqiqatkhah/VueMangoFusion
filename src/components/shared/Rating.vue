<template>
  <div class="d-flex align-items-center">
    <small class="text-secondary ms-2">رتبه بندی این آیتم:</small>
    <div class="d-flex">
      <div v-for="star in 5" :key="star" class="star-rating ms-1" @click="onRatingUpdate(star)">
        <i class="bi-star text-warning" width="16"></i>
      </div>
    </div>
    <div class="spinner-border spinner-border-sm text-warning me-2" role="status">
      <span class="visually-hidden">رتبه...</span>
    </div>
    <div class="text-primary me-2"><i class="bi bi-check-circle-fill"></i></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isProcessing = ref(false)
const isRatingSuccessful = ref(false)
const emit = defineEmits(['rate'])

const props = defineProps({
  itemId: {
    type: [Number],
    required: true,
  },
})

const onRatingUpdate = async (newRating) => {
  isProcessing = true

  isRatingSuccessful = false

  emit('rate', props.itemId, newRating)

  isRatingSuccessful.value = true

  setTimeout(() => {
    isRatingSuccessful = false
  }, 2000)

  isProcessing = false
}
</script>


<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
.star-rating {
  transition: transform 0.1s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  transform: scale(1.2);
}
</style>