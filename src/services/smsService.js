import api from '@/services/api'

export default {
  async sendLoginCode(phoneNumber) {
    try {
      const response = await api.post('/SmsAuth/send-login-code', {
        phoneNumber: phoneNumber,
      })

      if (response.data.inSuccess) {
        return { success: true, message: 'کد ورود ارسال شد' }
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'خطا در ارسال کد')
      }
    } catch (error) {
      console.log('Error sending SMS code:', error)
      throw error
    }
  },

  async verifyLoginCode(phoneNumber, code) {
    try {
      const response = await api.post('/SmsAuth/verify-login', {
        phoneNumber: phoneNumber,
        code: code,
      })

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'خطا در تأیید کد')
      }
    } catch (error) {
      console.log('Error verifying code:', error)
      throw error
    }
  },

  // اضافه کردن این متدها به smsService.js
  async sendRegisterCode(userData) {
    try {
      const response = await api.post('/SmsAuth/send-register-code', {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        role: userData.role,
      })

      if (response.data.inSuccess) {
        return {
          success: true,
          message: 'کد تأیید ارسال شد',
          userId: response.data.result.userId,
          debugCode: response.data.result.debugCode, // فقط برای توسعه
        }
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'خطا در ارسال کد ثبت‌نام')
      }
    } catch (error) {
      console.log('Error sending register SMS code:', error)
      throw error
    }
  },

  async verifyRegisterCode(phoneNumber, code) {
    try {
      const response = await api.post('/SmsAuth/verify-register', {
        phoneNumber: phoneNumber,
        code: code,
      })

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error(response.data.errorMessages?.join(', ') || 'خطا در تأیید کد ثبت‌نام')
      }
    } catch (error) {
      console.log('Error verifying register code:', error)
      throw error
    }
  },
}
