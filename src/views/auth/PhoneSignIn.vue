<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center">
              <img src="/src/assets/mini-logo.png" alt="logo" width="150px;" />
            </div>
            <h2 class="text-center mb-4">ورود با شماره تلفن</h2>

            <!-- مرحله ۱: وارد کردن شماره تلفن -->
            <div v-if="step === 1">
              <form @submit.prevent="sendVerificationCode">
                <div class="mb-3">
                  <label for="phoneNumber" class="form-label">شماره تلفن</label>
                  <input
                    type="tel"
                    v-model="phoneNumber"
                    class="form-control"
                    id="phoneNumber"
                    dir="ltr"
                  />
                </div>
                <div class="alert alert-danger" v-if="errorList.length > 0">
                  <span v-for="error in errorList" :key="error" class="d-block">{{ error }}</span>
                </div>
                <button :disabled="isLoading" type="submit" class="btn btn-warning w-100">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                  دریافت کد تایید
                </button>
              </form>
            </div>

            <!-- مرحله ۲: وارد کردن کد -->
            <div v-else-if="step === 2">
              <form @submit.prevent="verifyCode">
                <div class="mb-3 text-center">
                  <p>
                    کد تأیید به شماره <strong>{{ phoneNumber }}</strong> ارسال شد
                  </p>
                  <label for="verificationCode" class="form-label">کد ۶ رقمی</label>
                  <input
                    type="text"
                    v-model="verificationCode"
                    class="form-control text-center"
                    id="verificationCode"
                    maxlength="6"
                    dir="ltr"
                    style="font-size: 1.5rem; letter-spacing: 0.5rem"
                  />
                </div>
                <div class="mb-3 text-center">
                  <p class="text-muted">زمان باقی‌مانده: {{ countdown }} ثانیه</p>
                  <button
                    type="button"
                    class="btn btn-link p-0"
                    @click="resendCode"
                    :disabled="countdown > 0"
                  >
                    ارسال مجدد کد
                  </button>
                </div>
                <div class="alert alert-danger" v-if="errorList.length > 0">
                  <span v-for="error in errorList" :key="error" class="d-block">{{ error }}</span>
                </div>
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-outline-secondary w-50" @click="step = 1">
                    تغییر شماره
                  </button>
                  <button :disabled="isLoading" type="submit" class="btn btn-warning w-50">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                    تأیید و ورود
                  </button>
                </div>
              </form>
            </div>

            <div class="text-center mt-3">
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_IN }" class="text-decoration-none"
                >برگشت</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // اضافه شده
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

const router = useRouter()
const authStore = useAuthStore() // اضافه شده

const step = ref(1)
const phoneNumber = ref('')
const verificationCode = ref('')
const isLoading = ref(false)
const countdown = ref(0)
const countdownInterval = ref(null)
const errorList = reactive([])

const startCountdown = () => {
  countdown.value = 120 // 2 دقیقه
  countdownInterval.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownInterval.value)
    }
  }, 1000)
}

const sendVerificationCode = async () => {
  isLoading.value = true
  errorList.length = 0

  // اعتبارسنجی شماره تلفن
  if (
    !phoneNumber.value ||
    phoneNumber.value.length !== 11 ||
    !phoneNumber.value.startsWith('09')
  ) {
    errorList.push('شماره تلفن معتبر نیست')
    isLoading.value = false
    return
  }

  try {
    await authStore.sendSmsCode(phoneNumber.value)
    step.value = 2
    startCountdown()
  } catch (error) {
    errorList.push(error.message || 'خطا در ارسال کد')
  } finally {
    isLoading.value = false
  }
}

const verifyCode = async () => {
  isLoading.value = true
  errorList.length = 0

  if (!verificationCode.value || verificationCode.value.length !== 6) {
    errorList.push('کد تأیید باید ۶ رقمی باشد')
    isLoading.value = false
    return
  }

  try {
    const result = await authStore.signInWithSms(phoneNumber.value, verificationCode.value)

    if (result && !result.success) {
      errorList.push(result.message || 'خطا در ورود')
    }
    // اگر success باشد، کاربر به صفحه اصلی هدایت می‌شود
  } catch (error) {
    errorList.push(error.message || 'خطا در تأیید کد')
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (countdown.value > 0) return

  errorList.length = 0
  try {
    await authStore.sendSmsCode(phoneNumber.value)
    startCountdown()
  } catch (error) {
    errorList.push(error.message || 'خطا در ارسال مجدد کد')
  }
}

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>

<style scoped>
* {
  direction: rtl;
  font-family: 'Yekan';
}
</style>