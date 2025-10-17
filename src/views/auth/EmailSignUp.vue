<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center">
              <img src="/src/assets/mini-logo.png" alt="logo" width="150px;" />
            </div>
            <h2 class="text-center mb-4">ثبت نام با ایمیل</h2>

            <!-- مرحله ۱: اطلاعات کاربر -->
            <div v-if="step === 1">
              <form @submit.prevent="sendVerificationCode">
                <div class="mb-3">
                  <label for="name" class="form-label">نام کامل</label>
                  <input type="text" class="form-control" id="name" v-model="formObj.name" />
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">ایمیل</label>
                  <input type="email" class="form-control" id="email" v-model="formObj.email" />
                </div>

                <!-- 🔥 اضافه شده: فیلد شماره تلفن -->
                <div class="mb-3">
                  <label for="phoneNumber" class="form-label">شماره تلفن</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phoneNumber"
                    v-model="formObj.phoneNumber"
                    dir="ltr"
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">رمز عبور</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="formObj.password"
                    id="password"
                  />
                </div>

                <div class="alert alert-danger" v-if="errorList.length > 0">
                  <span v-for="error in errorList" :key="error" class="d-block">{{ error }}</span>
                </div>

                <button :disabled="isLoading" type="submit" class="btn btn-warning w-100">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                  دریافت کد تأیید ایمیل
                </button>
              </form>
            </div>

            <!-- مرحله ۲: وارد کردن کد -->
            <div v-else-if="step === 2">
              <form @submit.prevent="verifyAndRegister">
                <div class="mb-3 text-center">
                  <p>
                    کد تأیید به ایمیل <strong>{{ formObj.email }}</strong> ارسال شد
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
                    تغییر اطلاعات
                  </button>
                  <button :disabled="isLoading" type="submit" class="btn btn-warning w-50">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                    تأیید و ثبت نام
                  </button>
                </div>
              </form>
            </div>

            <div class="text-center mt-3">
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_UP }" class="text-decoration-none">
                برگشت
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/authStore'
import { reactive, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const formObj = reactive({
  name: '',
  email: '',
  phoneNumber: '', // 🔥 اضافه شده
  password: '',
})
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

  // 🔥 آپدیت شده: اضافه کردن validation شماره تلفن
  if (!formObj.name || formObj.name.trim().length === 0) {
    errorList.push('نام را وارد کنید')
  }

  if (!formObj.email || formObj.email.trim().length === 0) {
    errorList.push('ایمیل را وارد کنید')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formObj.email)) {
      errorList.push('فرمت ایمیل نامعتبر است')
    }
  }

  // 🔥 اضافه شده: validation شماره تلفن
  if (!formObj.phoneNumber || formObj.phoneNumber.trim().length === 0) {
    errorList.push('شماره تلفن را وارد کنید')
  } else if (formObj.phoneNumber.length !== 11 || !formObj.phoneNumber.startsWith('09')) {
    errorList.push('شماره تلفن معتبر نیست (مثال: 09123456789)')
  }

  if (!formObj.password || formObj.password.length === 0) {
    errorList.push('رمز عبور را وارد کنید')
  } else if (formObj.password.length < 4) {
    // 🔥 از ۶ به ۴ تغییر دادم
    errorList.push('رمز عبور باید حداقل ۴ کاراکتر باشد') // 🔥 متن رو هم آپدیت کن
  }

  if (errorList.length > 0) {
    isLoading.value = false
    return
  }

  try {
    // 🔥 تغییر: استفاده از متد جدید که شماره تلفن هم ارسال کنه
    const result = await authStore.signUpWithEmailTwoStep(formObj)

    if (result && result.success) {
      step.value = 2
      startCountdown()
      debugCode.value = result.debugCode || ''
    } else {
      errorList.push(result.message || 'خطا در ارسال کد تأیید')
    }
  } catch (err) {
    errorList.push('خطا در ارسال کد تأیید')
  } finally {
    isLoading.value = false
  }
}

const verifyAndRegister = async () => {
  isLoading.value = true
  errorList.length = 0

  if (!verificationCode.value || verificationCode.value.length !== 6) {
    errorList.push('کد تأیید باید ۶ رقمی باشد')
    isLoading.value = false
    return
  }

  try {
    const result = await authStore.verifyEmailRegister(formObj.email, verificationCode.value)

    if (result && result.success) {
      router.push({ name: APP_ROUTE_NAMES.HOME })
    } else {
      errorList.push(result.message || 'خطا در ثبت نام')
    }
  } catch (err) {
    errorList.push('خطا در ثبت نام')
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (countdown.value > 0) return

  errorList.length = 0
  try {
    const result = await authStore.signUpWithEmailTwoStep(formObj)

    if (result && result.success) {
      startCountdown()
      debugCode.value = result.debugCode || ''
    } else {
      errorList.push(result.message || 'خطا در ارسال مجدد کد')
    }
  } catch (error) {
    errorList.push('خطا در ارسال مجدد کد')
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