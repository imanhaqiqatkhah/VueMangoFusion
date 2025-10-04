import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import authService from '@/services/authService'
import router from '@/router/routes'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useSwal } from '@/composables/swal'
import Cookies from 'js-cookie'
export const useAuthStore = defineStore('authStore', () => {
  // state
  const user = reactive({
    email: '',
    password: '',
    name: '',
    id: '',
  })

  const isAuthenticated = ref(false)

  // getter
  const getUserInfo = computed(() => {
    return isAuthenticated.value ? user : null
  })

  const isAdmin = computed(() => {
    return isAuthenticated.value && user.role === 'Admin'
  })

  function decodeToken(token) {
    const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))))
    return {
      email: payload.email,
      role: payload.role,
      name: payload.fullname,
      id: payload.id,
    }
  }

  // actions

  function initialize() {
    try {
      const token = Cookies.get('token_cloudLand')
      if (token) {
        const userData = decodeToken(token)
        if (userData) {
          Object.assign(user, userData)
          isAuthenticated.value = true
        } else {
          clearAuthData()
        }
      } else {
        clearAuthData()
      }
    } catch (err) {
      console.error('ارور احراز هویت', err)
      clearAuthData()
    }
  }

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

  async function signIn(formObj) {
    try {
      const { token, user: userData } = await authService.signIn(formObj)
      Object.assign(user, userData)
      isAuthenticated.value = true

      Cookies.set('token_cloudLand', token, { expires: 1 })

      router.push('/')
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

  function clearAuthData() {
    Object.assign(user, {
      email: '',
      password: '',
      name: '',
      id: '',
    })
    isAuthenticated.value = false
    Cookies.remove('token_cloudLand')
  }

  function signOut() {
    clearAuthData()
  }

  return { user, isAuthenticated, getUserInfo, isAdmin, signUp, signIn, initialize, signOut }
})
