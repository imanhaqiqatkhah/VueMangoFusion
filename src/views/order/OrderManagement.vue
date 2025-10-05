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
            <tr v-for="order in paginatedOrders" :key="order.orderHeaderId">
              <td># {{ order.orderHeaderId }}</td>
              <td>{{ order.pickUpName }}</td>
              <td>
                <div>{{ order.pickUpPhoneNumber }}</div>
                <div class="text-body-secondary small">{{ order.pickUpEmail }}</div>
              </td>
              <td>{{ order.totalItem }}</td>
              <td>{{ (order.orderTotal / 10).toFixed(3) }} تومان</td>
              <!-- اضافه کردن فرمت قیمت -->
              <td>
                <span :class="getStatusBadgeClass(order.status)" class="badge rounded-pill">
                  {{ getStatusPersian(order.status) }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-primary" @click="viewOrderDetails(order)">
                  <i class="bi bi-card-checklist"></i>&nbsp; مشاهده جزئیات
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav aria-label="Order pagination" class="mt-4 d-flex justify-content-start">
        <ul class="pagination pagination-md">
          <!-- First page button -->
          <li class="page-item">
            <a
              class="page-link text-primary border-primary"
              href="#"
              aria-label="First"
              @click="changePage(1)"
            >
              <span aria-hidden="true">&laquo;</span>
              <span class="visually-hidden">صفحه اول</span>
            </a>
          </li>
          <!-- Previous button -->
          <li class="page-item">
            <a
              class="page-link text-primary border-primary"
              href="#"
              aria-label="Previous"
              @click="changePage(currentPage - 1)"
            >
              <span aria-hidden="true">&lsaquo;</span>
              <span class="visually-hidden">صفحه قبلی</span>
            </a>
          </li>

          <!-- Page numbers with limited display -->
          <template v-for="pageNum in displayedPageNumber" :key="pageNum">
            <li class="page-item disabled" v-if="pageNum === '...'">
              <span class="page-link border-primary">...</span>
            </li>
            <li class="page-item" v-else>
              <a
                :class="
                  pageNum === currentPage
                    ? 'bg-primary border-primary text-white'
                    : 'text-primary border-primary'
                "
                class="page-link border-primary"
                href="#"
                @click="changePage(pageNum)"
              >
                {{ pageNum }}
              </a>
            </li>
          </template>
          <!-- Next button -->
          <li class="page-item">
            <a
              href="#"
              aria-label="Next"
              class="page-link text-primary border-primary"
              @click="changePage(currentPage + 1)"
            >
              <span aria-hidden="true">&rsaquo;</span>
              <span class="visually-hidden">صفحه بعدی</span>
            </a>
          </li>

          <!-- Last page button -->
          <li class="page-item">
            <a
              href="#"
              class="page-link text-primary border-primary"
              aria-label="Last"
              @click="changePage(totalPages)"
            >
              <span aria-hidden="true">&raquo;</span>
              <span class="visually-hidden">صفحه قبلی</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Order Details Modal Component -->
    <OrderDetailsModal
      :order="selectedOrder"
      @close="closeOrderDetails"
      @status-updated="fetchOrders"
    />
  </div>
</template>

<script setup>
import OrderDetailsModal from '@/components/modals/OrderDetailsModal.vue'
import { ref, onMounted, computed, reactive } from 'vue'
import orderService from '@/services/orderService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { ORDER_STATUS, ORDER_STATUS_OPTIONS, ORDER_STATUS_PERSIAN } from '@/constants/constants'

const orders = reactive([])
const loading = ref(false)
const selectedOrder = ref(null)

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
    Confirmed: 'bg-warning-subtle text-warning-emphasis',
    'Ready for Pickup': 'bg-info-subtle text-info-emphasis',
    Completed: 'bg-primary-subtle text-primary-emphasis',
    Cancelled: 'bg-danger text-danger-emphasis',
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
const viewOrderDetails = (order) => {
  selectedOrder.value = { ...order }
}
const closeOrderDetails = (order) => {
  selectedOrder.value = null
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

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

const paginatedOrders = computed(() => {
  // 20 records
  // page size 5
  // 2nd page
  // start 1st 0-4, 5-9
  const startIndex = (currentPage.value - 1) * itemsPerPage
  // 1st - 0
  // 2st - 5
  const endIndex = startIndex + itemsPerPage
  return filteredOrders.value.slice(startIndex, endIndex)
})

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const displayedPageNumber = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1 // Number of pages to show before and after current page

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let range = []

  // always want to include first page
  range.push(1)

  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(total - 1, current + delta)

  if (rangeStart > 2) {
    range.push('...')
  }

  for (let i = rangeStart; i < rangeEnd; i++) {
    range.push(i)
  }

  if (rangeEnd < total - 1) {
    range.push('...')
  }
  if (total > 1) {
    range.push(total)
  }

  return range
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