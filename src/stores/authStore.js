import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import authService from '@/services/authService'
import smsService from '@/services/smsService' // اضافه شده
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
    role: '', // اضافه شده
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
  async function signUpWithPhone(userData) {
    try {
      // استفاده از ثبت‌نام معمولی تا زمانی که SMS کامل شود
      const result = await authService.signUp(userData)

      if (result && !result.success) {
        return result
      }

      const { showSuccess } = useSwal()
      showSuccess('ثبت نام با موفقیت انجام شد')
      router.push({ name: APP_ROUTE_NAMES.SIGN_IN })

      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ثبت نام با شماره تلفن',
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
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ورود به سیستم',
      }
    }
  }

  // 🔥 متد جدید برای ورود با SMS
  async function signInWithSms(phoneNumber, code) {
    try {
      const result = await smsService.verifyLoginCode(phoneNumber, code)

      // ذخیره توکن
      Cookies.set('token_cloudLand', result.token, { expires: 1 })

      // دیکد کردن توکن و ذخیره اطلاعات کاربر
      const userData = decodeToken(result.token)
      Object.assign(user, userData)
      isAuthenticated.value = true

      // هدایت به صفحه اصلی
      router.push('/')

      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ورود با SMS',
      }
    }
  }

  // 🔥 متد جدید برای ارسال کد SMS
  async function sendSmsCode(phoneNumber) {
    try {
      const result = await smsService.sendLoginCode(phoneNumber)
      return result
    } catch (err) {
      throw new Error(err.response?.data?.errorMessages?.join('--') || 'خطا در ارسال کد')
    }
  }

  // 🔥 متد جدید برای ثبت‌نام دو مرحله‌ای با SMS
  async function signUpWithPhoneTwoStep(userData) {
    try {
      // مرحله ۱: ارسال کد تأیید
      const result = await smsService.sendRegisterCode(userData)
      return result
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ارسال کد ثبت‌نام',
      }
    }
  }

  // 🔥 متد جدید برای تأیید کد و تکمیل ثبت‌نام
  async function verifyPhoneRegister(phoneNumber, code) {
    try {
      const result = await smsService.verifyRegisterCode(phoneNumber, code)

      // ذخیره توکن و لاگین اتوماتیک
      Cookies.set('token_cloudLand', result.token, { expires: 1 })
      const userData = decodeToken(result.token)
      Object.assign(user, userData)
      isAuthenticated.value = true

      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در تأیید کد ثبت‌نام',
      }
    }
  }

  function clearAuthData() {
    Object.assign(user, {
      email: '',
      password: '',
      name: '',
      id: '',
      role: '',
    })
    isAuthenticated.value = false
    Cookies.remove('token_cloudLand')
  }

  function signOut() {
    clearAuthData()
    router.push({ name: APP_ROUTE_NAMES.HOME })
  }

  return {
    user,
    isAuthenticated,
    getUserInfo,
    isAdmin,
    signUp,
    signIn,
    signInWithSms,
    signUpWithPhone, // ثبت‌نام مستقیم
    signUpWithPhoneTwoStep, // ثبت‌نام دو مرحله‌ای
    verifyPhoneRegister, // تأیید کد ثبت‌نام
    sendSmsCode,
    initialize,
    signOut,
  }
})
