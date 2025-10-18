import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import authService from '@/services/authService'
import smsService from '@/services/smsService'
import api from '@/services/api'
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
    phoneNumber: '',
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

  async function sendEmailCode(email) {
    try {
      const response = await api.post('/SmsAuth/send-email-code', {
        email: email,
      })

      if (response.data.inSuccess) {
        return {
          success: true,
          message: 'کد تأیید ارسال شد',
          debugCode: response.data.result.debugCode,
        }
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'خطا در ارسال کد')
      }
    } catch (err) {
      console.error('Error sending email code:', err)
      throw new Error(err.response?.data?.errorMessages?.join(', ') || 'خطا در ارسال کد ایمیل')
    }
  }

  async function signInWithEmailCode(email, code) {
    try {
      const response = await api.post('/SmsAuth/verify-email', {
        email: email,
        code: code,
      })

      if (response.data.inSuccess) {
        const result = response.data.result
        Cookies.set('token_cloudLand', result.token, { expires: 1 })
        const userData = decodeToken(result.token)
        Object.assign(user, userData)
        isAuthenticated.value = true
        router.push('/')
        return { success: true }
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'خطا در ورود با ایمیل')
      }
    } catch (err) {
      console.error('Error verifying email code:', err)
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join(', ') || 'خطا در ورود با ایمیل',
      }
    }
  }

  async function signUpWithEmailTwoStep(userData) {
    try {
      console.log('📧 [DEBUG] Sending email register data:', userData)

      const response = await api.post('/SmsAuth/send-email-register-code', {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber, // 🔥 این خط باید وجود داشته باشه
        password: userData.password,
      })

      console.log('📧 [DEBUG] Response:', response.data)

      if (response.data.inSuccess) {
        return {
          success: true,
          message: 'کد تأیید ارسال شد',
          debugCode: response.data.result.debugCode,
        }
      } else {
        return {
          success: false,
          message: response.data.errorMessages?.join(', ') || 'خطا در ارسال کد ثبت‌نام',
        }
      }
    } catch (err) {
      console.error('📧 [DEBUG] Error details:', err.response?.data)
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join(', ') || 'خطا در ارسال کد ثبت‌نام',
      }
    }
  }

  async function verifyEmailRegister(email, code) {
    try {
      const response = await api.post('/SmsAuth/verify-email-register', {
        email: email,
        code: code,
      })

      if (response.data.inSuccess) {
        const result = response.data.result
        Cookies.set('token_cloudLand', result.token, { expires: 1 })
        const userData = decodeToken(result.token)
        Object.assign(user, userData)
        isAuthenticated.value = true

        // 🔴 اضافه کردن: ذخیره شماره تلفن در localStorage
        localStorage.setItem(
          'userData',
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '', // این خط اضافه شد
          }),
        )

        router.push('/')
        return { success: true }
      } else {
        return {
          success: false,
          message: response.data.errorMessages?.join(', ') || 'خطا در تأیید کد ثبت‌نام',
        }
      }
    } catch (err) {
      console.error('Error verifying email register:', err)
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join(', ') || 'خطا در تأیید کد ثبت‌نام',
      }
    }
  }

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
      Cookies.set('token_cloudLand', result.token, { expires: 1 })
      const userData = decodeToken(result.token)
      Object.assign(user, userData)
      user.phoneNumber = phoneNumber
      isAuthenticated.value = true
      localStorage.setItem('userPhone', phoneNumber)
      localStorage.setItem(
        'userData',
        JSON.stringify({
          name: user.name,
          email: user.email,
          phoneNumber: phoneNumber,
        }),
      )
      router.push('/')
      return { success: true }
    } catch (err) {
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
      console.log('📱 [DEBUG] Sending phone register data:', userData)

      const response = await api.post('/SmsAuth/send-register-code', {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        role: userData.role || 'Customer',
      })

      console.log('📱 [DEBUG] Response:', response.data)

      if (response.data.inSuccess) {
        return {
          success: true,
          message: 'کد تأیید ارسال شد',
          debugCode: response.data.result.debugCode,
        }
      } else {
        return {
          success: false,
          message: response.data.errorMessages?.join(', ') || 'خطا در ارسال کد ثبت‌نام',
        }
      }
    } catch (err) {
      console.error('Error sending phone register code:', err.response?.data)
      return {
        success: false,
        message: err.response?.data?.errorMessages?.join(', ') || 'خطا در ارسال کد ثبت‌نام',
      }
    }
  }

  async function verifyPhoneRegister(phoneNumber, code) {
    try {
      const result = await smsService.verifyRegisterCode(phoneNumber, code)
      Cookies.set('token_cloudLand', result.token, { expires: 1 })
      const userData = decodeToken(result.token)
      Object.assign(user, userData)
      user.phoneNumber = phoneNumber
      isAuthenticated.value = true

      // 🔴 اضافه کردن: ذخیره شماره تلفن در localStorage
      localStorage.setItem('userPhone', phoneNumber)
      localStorage.setItem(
        'userData',
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: phoneNumber, // این خط اضافه شد
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
      phoneNumber: '',
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
    getUserByPhone,
    initialize,
    signOut,
    sendEmailCode,
    signInWithEmailCode,
    signUpWithEmailTwoStep,
    verifyEmailRegister,
  }
})
