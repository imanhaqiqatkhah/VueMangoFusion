<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center">
              <img src="/src/assets/mini-logo.png" alt="logo" width="150px;" />
            </div>
            <h2 class="text-center mb-4">ثبت نام</h2>
            <form @submit.prevent="onSignUpSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">نام کامل</label>
                <input type="text" class="form-control" id="name" v-model="formObj.name" />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">ایمیل</label>
                <input type="email" class="form-control" id="email" v-model="formObj.email" />
              </div>

              <div class="mb-3">
                <label for="role" class="form-label">نقش</label>
                <select class="form-select" id="role" v-model="formObj.role">
                  <option v-for="role in ROLE_OPTIONS" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </option>
                </select>
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
              <button :disabled="isLoading" type="submit" class="btn btn-secondary w-100">
                <span v-if="isLoading" class="spinner-border spinner-border-sm ms-2"></span>
                ثبت نام
              </button>
            </form>
            <div class="text-center mt-3">
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_IN }">حساب دارید؟ ورود</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ROLE_OPTIONS } from '@/constants/constants' // تغییر از ROLES به ROLE_OPTIONS
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/authStore'
import { reactive, ref } from 'vue'

const authStore = useAuthStore()
const formObj = reactive({
  name: '',
  email: '',
  password: '',
  role: 'Customer', // همچنان مقدار انگلیسی
})

const isLoading = ref(false)
const errorList = reactive([])

const onSignUpSubmit = async () => {
  isLoading.value = true
  errorList.length = 0

  // اعتبارسنجی‌های بهتر
  if (!formObj.name || formObj.name.trim().length === 0) {
    errorList.push('نام را وارد کنید')
  }

  if (!formObj.email || formObj.email.trim().length === 0) {
    errorList.push('ایمیل را وارد کنید')
  } else {
    // اعتبارسنجی فرمت ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formObj.email)) {
      errorList.push('فرمت ایمیل نامعتبر است')
    }
  }

  if (!formObj.password || formObj.password.length === 0) {
    errorList.push('رمز عبور را وارد کنید')
  } else if (formObj.password.length < 6) {
    errorList.push('رمز عبور باید حداقل ۶ کاراکتر باشد')
  }

  if (errorList.length > 0) {
    isLoading.value = false
    return
  }

  try {
    const response = await authStore.signUp(formObj)
    console.log(response)

    if (response && !response.success) {
      if (response.message) {
        response.message.split('--').forEach((error) => {
          errorList.push(error)
        })
      }
    }
    // اگر success باشد، کاربر به صفحه ورود هدایت می‌شود (طبق کد authStore)
  } catch (err) {
    console.error('Sign up error:', err)
    errorList.push('خطا در ثبت نام. لطفاً دوباره تلاش کنید.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  direction: rtl;
  font-family: 'Yekan';
}
</style>