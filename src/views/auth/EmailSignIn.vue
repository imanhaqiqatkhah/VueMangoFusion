<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center">
              <img src="/src/assets/mini-logo.png" alt="logo" width="150px;" />
            </div>
            <h2 class="text-center mb-4">ورود با کد تأیید ایمیل</h2>

            <!-- مرحله ۱: وارد کردن ایمیل -->
            <div v-if="step === 1">
              <form @submit.prevent="sendVerificationCode">
                <div class="mb-3">
                  <label for="email" class="form-label">ایمیل</label>
                  <input type="email" v-model="email" class="form-control" id="email" />
                </div>
                <div class="alert alert-danger" v-if="errorList.length > 0">
                  <span v-for="error in errorList" :key="error" class="d-block">{{ error }}</span>
                </div>
                <button :disabled="isLoading" type="submit" class="btn btn-warning w-100">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                  دریافت کد تأیید
                </button>
              </form>
            </div>

            <!-- مرحله ۲: وارد کردن کد -->
            <div v-else-if="step === 2">
              <form @submit.prevent="verifyCode">
                <div class="mb-3 text-center">
                  <p>
                    کد تأیید به ایمیل <strong>{{ email }}</strong> ارسال شد
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
                  <!-- <small class="text-muted" v-if="debugCode">کد تست: {{ debugCode }}</small> -->
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
                    تغییر ایمیل
                  </button>
                  <button :disabled="isLoading" type="submit" class="btn btn-warning w-50">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                    تأیید و ورود
                  </button>
                </div>
              </form>
            </div>

            <div class="text-center mt-3">
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_IN }"> ورود با رمز عبور </router-link>
              <span class="mx-2">|</span>
              <router-link :to="{ name: APP_ROUTE_NAMES.PHONE_SIGN_IN }">
                ورود با شماره تلفن
              </router-link>
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
import { useAuthStore } from '@/stores/authStore'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const email = ref('')
const verificationCode = ref('')
const debugCode = ref('')
const isLoading = ref(false)
const countdown = ref(0)
const countdownInterval = ref(null)
const errorList = reactive([])

const startCountdown = () => {
  countdown.value = 120
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

  if (!email.value) {
    errorList.push('ایمیل را وارد کنید')
    isLoading.value = false
    return
  }

  try {
    const result = await authStore.sendEmailCode(email.value)

    if (result && result.success) {
      step.value = 2
      startCountdown()
      debugCode.value = result.debugCode || ''
    } else {
      errorList.push(result?.message || 'خطا در ارسال کد')
    }
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
    const result = await authStore.signInWithEmailCode(email.value, verificationCode.value)

    if (result && !result.success) {
      errorList.push(result.message || 'خطا در ورود')
    }
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
    const result = await authStore.sendEmailCode(email.value)

    if (result && result.success) {
      startCountdown()
      debugCode.value = result.debugCode || ''
    } else {
      errorList.push(result?.message || 'خطا در ارسال مجدد کد')
    }
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