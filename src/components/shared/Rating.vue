<template>
  <div class="d-flex align-items-center">
    <small class="text-secondary ms-2" v-if="!readonly">رتبه بندی این آیتم:</small>
    <div class="d-flex">
      <div
        v-for="star in 5"
        :key="star"
        class="star-rating ms-1"
        @click="!readonly && onRatingUpdate(star)"
        :class="{ 'cursor-pointer': !readonly }"
      >
        <i
          :class="
            rating && Math.round(rating * 2) / 2 >= star
              ? 'bi-star-fill'
              : Math.round(rating * 2) / 2 >= star - 0.5
              ? 'bi-star-half'
              : 'bi-star'
          "
          class="text-warning"
          width="16"
        ></i>
      </div>
    </div>
    <div v-if="rating" class="me-2 text-secondary small">({{ rating.toFixed(1) }})</div>
    <div
      v-if="isProcessing"
      class="spinner-border spinner-border-sm text-warning me-2"
      role="status"
    >
      <span class="visually-hidden">رتبه...</span>
    </div>
    <div class="text-warning me-2" v-if="isRatingSuccessful">
      <i class="bi bi-check-circle-fill"></i>
    </div>
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
  rating: {
    type: [Number],
    default: 0,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const onRatingUpdate = async (newRating) => {
  isProcessing.value = true

  isRatingSuccessful.value = false
  console.log('Rating', props.itemId)
  emit('rate', props.itemId, newRating)

  isRatingSuccessful.value = true

  setTimeout(() => {
    isRatingSuccessful.value = false
  }, 2000)

  isProcessing.value = false
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