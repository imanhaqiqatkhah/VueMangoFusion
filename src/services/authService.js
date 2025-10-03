import api from '@/services/api'
export default {
  async signUp(userData) {
    try {
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
      })
      console.log(response.data)

      if (response.data.inSuccess) {
        return { success: true, message: 'رجیستر انچام شد' }
      } else {
        throw new Error('رجیستر انچام نشد')
      }
    } catch (error) {
      console.log('رجیستر با خطا همراه شد:', error)
      throw error
    }
  },

  async signIn(userData) {
    try {
      const response = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password,
      })
      console.log('Response LOGIN', response.data)

      if (response.data.inSuccess) {
        return { success: true, message: 'ورود انچام شد' }
      } else {
        throw new Error('ورود انچام نشد')
      }
    } catch (error) {
      console.log('ورود با خطا همراه شد:', error)
      throw error
    }
  },
}
