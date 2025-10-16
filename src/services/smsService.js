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
}
