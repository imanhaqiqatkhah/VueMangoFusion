import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import authService from '@/services/authService'
import router from '@/router/routes'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useSwal } from '@/composables/swal'
export const useAuthStore = defineStore('authStore', () => {
  // state
  const user = reactive({
    email: '',
    password: '',
    name: '',
    id: '',
    isLoggedIn: false,
  })

  const isAuthenticated = ref(false)

  // getter
  const getUserInfo = computed(() => {
    return isAuthenticated.value ? user : null
  })

  // actions
  async function signUp(userData) {
    try {
      await authService.signUp(userData)
      const { showSuccess } = useSwal()
      showSuccess('ثبت نام با موفقیت انجام شد')
      router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در رجیستر',
      }
    }
  }

  async function signIn(userData) {
    try {
      const response = await authService.signIn(userData)
      console.log(response)
      //const { showSuccess } = useSwal()
      //showSuccess('ثبت نام با موفقیت انجام شد')
      // router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ورود به سیستم',
      }
    }
  }

  return { user, isAuthenticated, getUserInfo, signUp, signIn }
})
