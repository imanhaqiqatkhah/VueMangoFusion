<template>
  <div class="container-fluid py-2">
    <!-- <h1 class="mb-4"> مدیریت سفارشات </h1>-->
    <p class="text-primary h2 pb-1">مدیریت سفارشات</p>
    <!-- Filters -->
    <div class="card border-0 shadow-sm p-4 mb-4">
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">فیلتر براساس وضعیت</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">همه وضعیت ها</option>
            <option v-for="status in ORDER_STATUS" :key="status" :value="status">
              {{ status }}
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
          <label class="form-label">ترتیب بندی بر اساس</label>
          <select v-model="sortDirection" class="form-select">
            <option value="asc">صعودی</option>
            <option value="desc">نزولی</option>
          </select>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-8 md-3">
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
              <th class="cursor-pointer">id سفارش<span class="me-1"></span></th>
              <th class="cursor-pointer">مشتری<span class="me-1"></span></th>
              <th>ارتباط</th>
              <th>شماره آیتم</th>
              <th class="cursor-pointer">
                کل
                <span class="me-1"></span>
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
              <td>{{ order.orderTotal }}</td>
              <td>
                <div class="badge rounded-pill">{{ order.status }}</div>
              </td>
              <td>
                <button class="btn btn-sm btn-primary">
                  <i class="bi bi-card-checklist"></i>&nbsp; مشاهده خصوصیات کل
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
            <a class="page-link text-primary border-primary" href="#" aria-label="First">
              <span aria-hidden="true">&laquo;</span>
              <span class="visually-hidden">صفحه اول</span>
            </a>
          </li>
          <!-- Previous button -->
          <li class="page-item">
            <a class="page-link text-primary border-primary" href="#" aria-label="Previous">
              <span aria-hidden="true">&lsaquo;</span>
              <span class="visually-hidden">صفحه قبلی</span>
            </a>
          </li>

          <!-- Page numbers with limited display -->
          <li class="page-item disabled">
            <span class="page-link border-primary">...</span>
          </li>
          <li class="page-item">
            <a class="page-link text-muted border-primary" href="#"> xx </a>
          </li>
          <!-- Next button -->
          <li class="page-item">
            <a href="#" aria-label="Next" class="page-link text-primary border-primary">
              <span aria-hidden="true">&rsaquo;</span>
              <span class="visually-hidden">صفحه بعدی</span>
            </a>
          </li>
          <!-- Last page button -->
          <li class="page-item">
            <a href="#" class="page-link text-primary border-primary" aria-label="Last">
              <span aria-hidden="true">&raquo;</span>
              <span class="visually-hidden">صفحه قبلی</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <!-- Order Details Modal Component -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import orderService from '@/services/orderService'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import {
  ORDER_STATUS,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
} from '@/constants/constants'

const orders = reactive([])
const loading = ref(false)

// filter and sorting
const statusFilter = ref('')
const searchQuery = ref('')
const sortBy = ref('orderByHeaderId')
const sortDirection = ref('desc')

// pagination
const itemsPerPage = 5
const currentPage = ref(1)

const resetFilters = () => {
  statusFilter.value = ''
  searchQuery.value = ''
  sortBy.value = 'orderByHeaderId'
  sortDirection.value = 'desc'
  currentPage.value = 1
}

const filteredOrders = computed(() => {
  let result = [...orders]
  if (statusFilter.value) {
    result = result.filter(
      (order) => order.status.toUpperCase() === statusFilter.value.toUpperCase()
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toUpperCase()
    result = result.filter(
      (order) =>
        order.pickUpEmail.toUpperCase().includes(query) ||
        order.pickUpName.toUpperCase().includes(query) ||
        order.pickUpPhoneNumber.toUpperCase().includes(query)
    )
  }

  // apply sorting logic
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

onMounted(fetchOrders)
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
</style>