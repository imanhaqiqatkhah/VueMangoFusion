<template>
  <div class="container-fluid py-2">
    <!-- <h1 class="mb-4"> مدیریت سفارشات </h1>-->
    <p class="text-primary h2 pb-1">مدیریت سفارشات</p>
    <!-- Filters -->
    <div class="card border-0 shadow-sm p-4 mb-4">
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">فیلتر براساس وضعیت</label>
          <select class="form-select">
            <option value="">همه وضعیت ها</option>
            <option value="Confirmed">قبول شده</option>
            <option value="Ready for Pickup">در حال آماده سازی</option>
            <option value="Completed">کامل شده</option>
            <option value="Cancelled">کنسل شده</option>
          </select>
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">ترتیب بندی</label>
          <select class="form-select">
            <option value="orderHeaderId">id سفارش</option>
            <option value="orderTotal">کل پرداختی</option>
            <option value="pickUpName">نام مشتری</option>
          </select>
        </div>

        <div class="col-md-4 mb-3">
          <label class="form-label">ترتیب بندی بر اساس</label>
          <select class="form-select">
            <option value="asc">صعودی</option>
            <option value="desc">نزولی</option>
          </select>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-8 md-3">
          <label class="form-label">جستجو</label>
          <input type="text" class="form-control" placeholder="جستجو با نام، ایمیل یا شماره تلفن" />
        </div>

        <div class="col-md-4 mb-3 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100">ریست فیلتر</button>
        </div>
      </div>
    </div>

    <div class="text-center py-4 fe-5 text-body-secondary">در حال بارگیری سفارشات...</div>
    <div class="text-center py-5 card border-0 shadow-sm">
      <p class="mb-0">هنوز هیچ سفارشی پیدا نشد</p>
    </div>
    <div>
      <div class="mb-3"><span class="badge bg-primary">XX سفارش موجود</span></div>
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
            <tr>
              <td># ID</td>
              <td>نام</td>
              <td>
                <div>شماره تلفن</div>
                <div class="text-body-secondary small">ایمیل</div>
              </td>
              <td>$$$</td>
              <td>تعداد سفارشات</td>
              <td>
                <div class="badge rounded-pill">وضعیت</div>
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
    result = result.filter()
  }
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