<template>
  <div class="container-fluid py-2">
    <p class="text-primary h2 pb-1">مدیریت سفارشات</p>

    <!-- Filters -->
    <div class="card border-0 shadow-sm p-4 mb-4">
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">فیلتر براساس وضعیت</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">همه وضعیت ها</option>
            <option
              v-for="status in ORDER_STATUS_OPTIONS"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">ترتیب بندی</label>
          <select v-model="sortBy" class="form-select">
            <option value="orderHeaderId">id سفارش</option>
            <option value="orderTotal">کل پرداختی</option>
            <option value="pickUpName">نام مشتری</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">ترتیب</label>
          <select v-model="sortDirection" class="form-select">
            <option value="asc">صعودی</option>
            <option value="desc">نزولی</option>
          </select>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-8 mb-3">
          <label class="form-label">جستجو</label>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="جستجو با نام، ایمیل یا شماره تلفن"
          />
        </div>

        <div class="col-md-4 mb-3 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="resetFilters">ریست فیلتر</button>
        </div>
      </div>
    </div>

    <div class="text-center py-4 fe-5 text-body-secondary" v-if="loading">
      در حال بارگیری سفارشات...
    </div>

    <div class="text-center py-5 card border-0 shadow-sm" v-else-if="filteredOrders.length === 0">
      <p class="mb-0">هنوز هیچ سفارشی پیدا نشد</p>
    </div>

    <div v-else>
      <div class="mb-3">
        <span class="badge bg-primary">{{ filteredOrders.length }} سفارش موجود</span>
      </div>

      <div class="table-responsive card border-0 shadow-sm">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th style="cursor: pointer" @click="updateSort('orderHeaderId')">
                id سفارش<span class="me-1" v-if="sortBy === 'orderHeaderId'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th style="cursor: pointer" @click="updateSort('pickUpName')">
                مشتری<span v-if="sortBy === 'pickUpName'" class="me-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}</span
                >
              </th>
              <th>ارتباط</th>
              <th>شماره آیتم</th>
              <th style="cursor: pointer" @click="updateSort('orderTotal')">
                کل
                <span v-if="sortBy === 'orderTotal'" class="me-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}</span
                >
              </th>
              <th>وضعیت</th>
              <th>عملکرد</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.orderHeaderId">
              <td># {{ order.orderHeaderId }}</td>
              <td>{{ order.pickUpName }}</td>
              <td>
                <div>{{ order.pickUpPhoneNumber }}</div>
                <div class="text-body-secondary small">{{ order.pickUpEmail }}</div>
              </td>
              <td>{{ order.totalItem }}</td>
              <td>{{ order.orderTotal.toLocaleString() }} تومان</td>
              <!-- اضافه کردن فرمت قیمت -->
              <td>
                <span :class="getStatusBadgeClass(order.status)" class="badge rounded-pill">
                  {{ getStatusPersian(order.status) }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-primary">
                  <i class="bi bi-card-checklist"></i>&nbsp; مشاهده جزئیات
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <!-- کد pagination بدون تغییر -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import orderService from '@/services/orderService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { ORDER_STATUS, ORDER_STATUS_OPTIONS, ORDER_STATUS_PERSIAN } from '@/constants/constants'

const orders = reactive([])
const loading = ref(false)

// filter and sorting
const statusFilter = ref('')
const searchQuery = ref('')
const sortBy = ref('orderHeaderId') // اصلاح: orderByHeaderId به orderHeaderId
const sortDirection = ref('desc')

// pagination
const itemsPerPage = 5
const currentPage = ref(1)

// تابع برای تبدیل وضعیت به فارسی
const getStatusPersian = (status) => {
  return ORDER_STATUS_PERSIAN[status] || status
}

// تابع برای کلاس badge بر اساس وضعیت
const getStatusBadgeClass = (status) => {
  const statusClasses = {
    Confirmed: 'bg-primary',
    'Ready for Pickup': 'bg-success',
    Completed: 'bg-info',
    Cancelled: 'bg-danger',
  }
  return statusClasses[status] || 'bg-secondary'
}

const resetFilters = () => {
  statusFilter.value = ''
  searchQuery.value = ''
  sortBy.value = 'orderHeaderId'
  sortDirection.value = 'desc'
  currentPage.value = 1
}

const updateSort = (field) => {
  if (sortBy.value == field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'asc'
  }
}

const filteredOrders = computed(() => {
  let result = [...orders]

  // فیلتر بر اساس وضعیت
  if (statusFilter.value) {
    result = result.filter(
      (order) => order.status.toUpperCase() === statusFilter.value.toUpperCase()
    )
  }

  // فیلتر بر اساس جستجو
  if (searchQuery.value) {
    const query = searchQuery.value.toUpperCase()
    result = result.filter(
      (order) =>
        order.pickUpEmail?.toUpperCase().includes(query) ||
        order.pickUpName?.toUpperCase().includes(query) ||
        order.pickUpPhoneNumber?.toUpperCase().includes(query)
    )
  }

  // مرتب‌سازی
  result.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    if (typeof aValue == 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection.value == 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return result
})

const fetchOrders = async () => {
  orders.length = 0
  loading.value = true
  try {
    var result = await orderService.getOrders()
    orders.push(...result)
    console.log(orders)
  } catch (error) {
    console.log('Error fetch orders:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
</style>