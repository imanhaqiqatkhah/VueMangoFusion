<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center">
              <img src="/src/assets/mini-logo.png" alt="logo" width="150px;" />
            </div>
            <h2 class="text-center mb-4">انتخاب روش ورود</h2>

            <!-- لینک ورود با شماره تلفن -->
            <div class="text-center mb-4">
              <router-link
                :to="{ name: APP_ROUTE_NAMES.PHONE_SIGN_IN }"
                class="btn btn-warning w-100 mb-3 py-3"
              >
                <i class="bi bi-phone me-2"></i>
                ورود با شماره تلفن
              </router-link>
              <div class="text-muted small my-3">یا</div>
            </div>

            <!-- ورود با ایمیل -->

            <router-link
              :to="{ name: APP_ROUTE_NAMES.EMAIL_SIGN_IN }"
              class="btn btn-outline-warning w-100 py-3"
            >
              <i class="bi bi-envelope me-2"></i>
              ورود با ایمیل
            </router-link>
            <div class="text-center mt-4">
              <p class="text-muted small mb-2">هر دو روش نیازمند:</p>
              <div class="d-flex justify-content-center gap-3 small text-muted">
                <span><i class="bi bi-envelope me-1"></i>تایید ایمیل</span>
                <span><i class="bi bi-phone me-1"></i>تایید شماره تلفن</span>
              </div>
            </div>
            <div class="text-center mt-3">
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_UP }" class="text-decoration-none"
                >حساب ندارید؟ ثبت نام</router-link
              >
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
import { reactive, ref } from 'vue'

const authStore = useAuthStore()
const formObj = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorList = reactive([])

// متد موجود بدون تغییر
const onSignInSubmit = async () => {
  isLoading.value = true
  errorList.length = 0

  if (formObj.email === undefined || formObj.email.length === 0) {
    errorList.push('ایمیل را وارد کنید')
  }
  if (formObj.password === undefined || formObj.password.length === 0) {
    errorList.push('رمز عبور را وارد کنید')
  }

  if (errorList.length > 0) {
    isLoading.value = false
    return
  }

  try {
    const response = await authStore.signIn(formObj)
    console.log(response)
    if (response.success) {
      console.log('success')
    } else {
      if (response.message !== undefined) {
        response.message.split('--').forEach((error) => {
          errorList.push(error)
        })
      }
    }
  } catch (err) {
    errorList.push(err.message || 'خطا در ورود')
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