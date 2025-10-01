import api from '@/services/api'

export default {
  async getMenuItems() {
    try {
      const response = await api.get('/menuItem')

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch menu items')
      }
    } catch (error) {
      console.log('Error fetching menu items:', error)
      throw error
    }
  },
  async getMenuItemById(id) {
    try {
      const response = await api.get(`/menuItem/${id}`)

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch menu item')
      }
    } catch (error) {
      console.log('Error fetching menu item:', error)
      throw error
    }
  },
  async createMenuItem(data) {
    try {
      const response = await api.post('/menuItem', data)

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to create menu items')
      }
    } catch (error) {
      console.log('Error creating menu items:', error)
      throw error
    }
  },
  async updateMenuItem(id, data) {
    try {
      const response = await api.put(`/menuItem?id=${id}`, data)

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to update menu items')
      }
    } catch (error) {
      console.log('Error updating menu items:', error)
      throw error
    }
  },
  async deleteMenuItem(id) {
    try {
      const response = await api.delete(`/menuItem?id=${id}`)

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to delete menu items')
      }
    } catch (error) {
      console.log('Error deleting menu items:', error)
      throw error
    }
  },
}
