import api from '@/services/api'

export default {
  async getOrders(userId = null) {
    try {
      const response = await api.get('/OrderHeader', {
        params: {
          userId: userId,
        },
      })

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch Orders')
      }
    } catch (error) {
      console.log('Error fetching Order:', error)
      throw error
    }
  },
  async getOrderById(id) {
    try {
      const response = await api.get(`/OrderHeader/${id}`)

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch order')
      }
    } catch (error) {
      console.log('Error fetching order:', error)
      throw error
    }
  },
  async createOrder(OrderData) {
    try {
      const response = await api.post('/OrderHeader', {
        pickUpName: OrderData.pickUpName,
        pickUpPhoneNumber: OrderData.pickUpPhoneNumber,
        pickUpEmail: OrderData.pickUpEmail,
        applicationUserId: OrderData.applicationUserId,
        orderTotal: OrderData.orderTotal,
        totalItem: OrderData.totalItem,
        orderDetailsDTO: OrderData.orderDetailsDTO,
      })

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.log('Error creating order:', error)
      throw error
    }
  },
  async updateOrder(id, OrderData) {
    try {
      const response = await api.put(`/OrderHeader/${id}`, {
        orderHeaderId: id,
        status: OrderData.status,
      })

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.log('Error updating order:', error)
      throw error
    }
  },
  async submitRating(orderDetailsId, rating) {
    try {
      const response = await api.put(`/OrderDetails/${orderDetailsId}`, {
        orderDetailsId: orderDetailsId,
        rating: rating,
      })

      if (response.data.inSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to update rating')
      }
    } catch (error) {
      console.log('Error updating rating:', error)
      throw error
    }
  },
}
