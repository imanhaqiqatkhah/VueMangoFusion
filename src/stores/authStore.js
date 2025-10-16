import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import authService from '@/services/authService'
import smsService from '@/services/smsService'
import api from '@/services/api' // ✅ اضافه شد
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
    role: '',
    phoneNumber: '', // ✅ اضافه شد
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
    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))))
      console.log('🔐 FULL Token payload:', payload) // کل payload رو ببین

      return {
        email: payload.email || '',
        role: payload.role || '',
        name: payload.fullname || payload.name || '',
        id: payload.id || payload.nameid || '',
        phoneNumber:
          payload.phoneNumber || payload.PhoneNumber || payload.mobilephone || payload.phone || '',
      }
    } catch (error) {
      console.error('❌ Error decoding token:', error)
      return null
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

  // ✅ متد جدید: دریافت کاربر بر اساس شماره تلفن
  async function getUserByPhone(phoneNumber) {
    try {
      const response = await api.get(
        `/SmsAuth/user-by-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`,
      )

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'کاربر یافت نشد')
      }
    } catch (error) {
      console.error('Error fetching user by phone:', error)
      throw new Error(
        error.response?.data?.errorMessages?.join(', ') || 'خطا در دریافت اطلاعات کاربر',
      )
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

  async function signInWithSms(phoneNumber, code) {
    try {
      const result = await smsService.verifyLoginCode(phoneNumber, code)

      console.log('📱 SMS login result:', result)

      // ذخیره توکن
      Cookies.set('token_cloudLand', result.token, { expires: 1 })

      // دیکد کردن توکن
      const userData = decodeToken(result.token)
      console.log('🔐 Decoded user data:', userData)

      // پر کردن اطلاعات کاربر
      Object.assign(user, userData)

      // 🔥 مهم: شماره تلفن رو حتماً ست کن
      user.phoneNumber = phoneNumber
      isAuthenticated.value = true

      // 🔥 در localStorage هم ذخیره کن
      localStorage.setItem('userPhone', phoneNumber)
      localStorage.setItem(
        'userData',
        JSON.stringify({
          name: user.name,
          email: user.email,
          phoneNumber: phoneNumber,
        }),
      )

      console.log('✅ User after SMS login:', user)
      console.log('✅ Phone number saved to localStorage:', phoneNumber)

      router.push('/')

      return { success: true }
    } catch (err) {
      console.error('❌ SMS login error:', err)
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ورود با SMS',
      }
    }
  }

  async function sendSmsCode(phoneNumber) {
    try {
      const result = await smsService.sendLoginCode(phoneNumber)
      return result
    } catch (err) {
      throw new Error(err.response?.data?.errorMessages?.join('--') || 'خطا در ارسال کد')
    }
  }

  async function signUpWithPhoneTwoStep(userData) {
    try {
      const result = await smsService.sendRegisterCode(userData)
      return result
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join('--') || 'خطا در ارسال کد ثبت‌نام',
      }
    }
  }

  async function verifyPhoneRegister(phoneNumber, code) {
    try {
      const result = await smsService.verifyRegisterCode(phoneNumber, code)

      Cookies.set('token_cloudLand', result.token, { expires: 1 })
      const userData = decodeToken(result.token)

      Object.assign(user, userData)

      // 🔥 شماره تلفن رو ذخیره کن
      user.phoneNumber = phoneNumber
      isAuthenticated.value = true

      // 🔥 در localStorage ذخیره کن
      localStorage.setItem('userPhone', phoneNumber)
      localStorage.setItem(
        'userData',
        JSON.stringify({
          name: user.name,
          email: user.email,
          phoneNumber: phoneNumber,
        }),
      )

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
      phoneNumber: '', // ✅ اضافه شد
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
    signUpWithPhone,
    signUpWithPhoneTwoStep,
    verifyPhoneRegister,
    sendSmsCode,
    getUserByPhone, // ✅ اضافه شد
    initialize,
    signOut,
  }
})
