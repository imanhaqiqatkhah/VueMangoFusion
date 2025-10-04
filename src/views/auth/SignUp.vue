<template>
  <div class="container mt-5">
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
                  <option v-for="role in ROLES" :key="role">{{ role }}</option>
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
import { ROLES } from '@/constants/constants'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/authStore'
import { reactive, ref } from 'vue'
const authStore = useAuthStore()
const formObj = reactive({
  name: '',
  email: '',
  password: '',
  role: 'Customer',
})

const isLoading = ref(false)

const errorList = reactive([])

const onSignUpSubmit = async () => {
  isLoading.value = true

  errorList.length = 0

  if (formObj.name === undefined || formObj.name.length === 0) {
    errorList.push('نام را وارد کنید')
  }
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
    const response = await authStore.signUp(formObj)
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
    errorList.push(err)
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