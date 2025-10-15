<template>
  <div>
    <div class="position-relative overflow-hidden mb-4">
      <div class="hero-section position-relative py-5 rounded-4" style="min-height: 400px">
        <div class="container position-relative z-3">
          <div class="row justify-content-center text-center">
            <div class="col-lg-8 col-xl-7">
              <h1 class="display-4 fw-bold text-warning mb-4">
                <br /><span class="text-light"></span><br />
              </h1>
              <div
                class="input-group mx-auto shadow-lg rounded-pill overflow-hidden mt-5"
                style="max-width: 600px"
              >
                <button class="btn btn-warning px-4 d-flex align-items-center border-0">
                  <i class="bi bi-search"></i><span class="me-2 d-none d-sm-inline">جستجو</span>
                </button>
                <input
                  v-model="searchValue"
                  type="text"
                  class="form-control border-0 py-3 px-4"
                  placeholder="محصولات ما را دنبال کن"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container px-0 mx-0">
      <!-- Filters Section -->
      <div class="row g-3 my-4 align-items-center rounded-4 mx-1 pt-1 p-3 bg-white">
        <!-- Categories -->
        <div class="col-lg-12 mb-3">
          <div class="d-flex flex-wrap gap-2 justify-content-center">
            <div
              :class="{
                'category-active': category === selectedCategory,
                'category-inactive': category !== selectedCategory,
              }"
              class="category-card rounded-3 p-3 text-center cursor-pointer transition-all position-relative"
              @click="updateSelectedCategory(category)"
              v-for="(category, index) in categoryList"
              :key="index"
              style="min-width: 100px"
            >
              <!-- Animated Background -->
              <div class="category-bg"></div>

              <!-- Icon -->
              <div class="category-icon mb-2">
                <i :class="getCategoryIcon(category)" class="fs-4"></i>
              </div>

              <!-- Text -->
              <div class="category-name small fw-bold position-relative z-2">{{ category }}</div>

              <!-- Active Indicator -->
              <div
                v-if="category === selectedCategory"
                class="active-indicator position-absolute top-0 start-0 w-100 h-100"
              >
                <div class="sparkle" v-for="n in 8" :key="n" :style="sparkleStyle(n)"></div>
              </div>

              <!-- Hover Effect -->
              <div class="hover-effect"></div>
            </div>
          </div>
        </div>

        <!-- Sort Dropdown - Centered Below Categories -->
        <div class="col-lg-12">
          <div class="d-flex justify-content-center">
            <div class="dropdown sort-dropdown">
              <button
                class="btn btn-outline-dark rounded-pill px-4 py-2 dropdown-toggle d-flex align-items-center gap-3 transition-all hover-lift"
                type="button"
                data-bs-toggle="dropdown"
              >
                <div class="sort-icon-wrapper">
                  <i class="bi bi-sort-down fs-5"></i>
                </div>
                <div class="sort-text">
                  <div class="fw-bold">{{ selectedSortOption }}</div>
                  <small class="text-muted">مرتب‌سازی</small>
                </div>
                <i class="bi bi-chevron-down fs-6 transition-rotate"></i>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-center shadow-lg border-0 rounded-3 overflow-hidden slide-down"
              >
                <li v-for="(sort, index) in SORT_OPTIONS" :key="index">
                  <button
                    class="dropdown-item py-3 px-4 d-flex align-items-center gap-3 transition-all menu-item-hover"
                    @click="updateSelectedSortOption(sort)"
                  >
                    <div class="menu-icon">
                      <i class="bi" :class="getSortIcon(sort)"></i>
                    </div>
                    <div class="flex-grow-1 text-start">
                      <div class="fw-medium">{{ sort }}</div>
                    </div>
                    <div class="selection-indicator">
                      <i v-if="sort === selectedSortOption" class="bi bi-check-lg text-warning"></i>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- Content Section -->
      <div class="text-center py-5" v-if="loading">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">در حال بارگیری...</span>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <MenuItemCard
            v-if="paginatedItems.length && paginatedItems.length > 0"
            v-for="(item, index) in paginatedItems"
            :key="item.id"
            class="list-item col-12 col-md-6 col-lg-4 pb-4"
            :menuItem="item"
            @show-details="handleShowDetails"
          />

          <div
            class="text-center py-5 display-4 mx-auto text-body-secondary mb-3 d-block"
            v-if="filteredItems.length === 0"
          >
            <i class="bi bi-emoji-frown"></i>
            <p class="lead text-body-secondary">هیچ آیتمی یافت نشد</p>
          </div>
        </div>

        <!-- Pagination -->
        <nav
          aria-label="Product pagination"
          class="mt-4 d-flex justify-content-center"
          v-if="totalPages > 1"
        >
          <ul class="pagination pagination-md">
            <!-- First page button -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a
                class="page-link text-secondary border-secondary"
                aria-label="First"
                @click="changePage(1)"
              >
                <span aria-hidden="true">&laquo;</span>
                <span class="visually-hidden">صفحه اول</span>
              </a>
            </li>
            <!-- Previous button -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a
                class="page-link text-secondary border-secondary"
                aria-label="Previous"
                @click="changePage(currentPage - 1)"
              >
                <span aria-hidden="true">&lsaquo;</span>
                <span class="visually-hidden">صفحه قبلی</span>
              </a>
            </li>

            <!-- Page numbers with limited display -->
            <template v-for="pageNum in displayedPageNumbers" :key="pageNum">
              <li class="page-item disabled" v-if="pageNum === '...'">
                <span class="page-link border-secondary">...</span>
              </li>
              <li class="page-item" v-else>
                <a
                  :class="
                    pageNum === currentPage
                      ? 'bg-secondary border-secondary text-white'
                      : 'text-secondary border-secondary'
                  "
                  class="page-link border-secondary"
                  @click="changePage(pageNum)"
                >
                  {{ pageNum }}
                </a>
              </li>
            </template>
            <!-- Next button -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a
                aria-label="Next"
                class="page-link text-secondary border-secondary"
                @click="changePage(currentPage + 1)"
              >
                <span aria-hidden="true">&rsaquo;</span>
                <span class="visually-hidden">صفحه بعدی</span>
              </a>
            </li>

            <!-- Last page button -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a
                class="page-link text-secondary border-secondary"
                aria-label="Last"
                @click="changePage(totalPages)"
              >
                <span aria-hidden="true">&raquo;</span>
                <span class="visually-hidden">صفحه آخر</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <!-- Menu Detail Modal -->
    <MenuItemDetailsModal
      :show="showModal"
      :menuItem="selectedMenuItem"
      @close="handleCloseDetailsModal"
    />
  </div>
</template>

<script setup>
import MenuItemDetailsModal from '@/components/modals/MenuItemDetailsModal.vue'
import MenuItemCard from '@/components/card/MenuItemCard.vue'
import menuItemService from '@/services/menuItemService'
import { ref, onMounted, reactive, computed } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { CONFIG_IMAGE_URL } from '@/constants/config'
import { useSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'
import {
  CATEGORIES,
  SORT_PRICE_LOW_HIGH,
  SORT_PRICE_HIGH_LOW,
  SORT_NEWEST,
  SORT_OPTIONS,
} from '@/constants/constants'

const { showConfirm, showError, showSuccess } = useSwal()
const menuItems = reactive([])
const loading = ref(false)
const selectedCategory = ref('همه')
const selectedSortOption = ref(SORT_OPTIONS[0]) // جدیدترین به عنوان پیش‌فرض
const searchValue = ref('')
const router = useRouter()
const categoryList = reactive(['همه', ...CATEGORIES])

const showModal = ref(false)
const selectedMenuItem = ref(null)

// Pagination variables
const itemsPerPage = 8
const currentPage = ref(1)

const handleShowDetails = (menuItem) => {
  selectedMenuItem.value = menuItem
  showModal.value = true
}
const handleCloseDetailsModal = (menuItem) => {
  selectedMenuItem.value = null
  showModal.value = false
}

function updateSelectedCategory(category) {
  selectedCategory.value = category
  currentPage.value = 1 // بازگشت به صفحه اول هنگام تغییر دسته‌بندی
}

function updateSelectedSortOption(sort) {
  selectedSortOption.value = sort
  currentPage.value = 1 // بازگشت به صفحه اول هنگام تغییر مرتب‌سازی
}

const filteredItems = computed(() => {
  let tempArray =
    selectedCategory.value == 'همه'
      ? [...menuItems]
      : menuItems.filter(
          (item) => item.category.toUpperCase() === selectedCategory.value.toUpperCase()
        )

  if (searchValue.value) {
    tempArray = tempArray.filter((item) =>
      item.name.toUpperCase().includes(searchValue.value.toUpperCase())
    )
  }

  // مرتب‌سازی ساده‌شده
  if (selectedSortOption.value === SORT_NEWEST) {
    tempArray.sort((a, b) => b.id - a.id) // یا بر اساس تاریخ
  } else if (selectedSortOption.value === SORT_PRICE_LOW_HIGH) {
    tempArray.sort((a, b) => a.price - b.price)
  } else if (selectedSortOption.value === SORT_PRICE_HIGH_LOW) {
    tempArray.sort((a, b) => b.price - a.price)
  }

  return tempArray
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return filteredItems.value.slice(startIndex, endIndex)
})

const displayedPageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let range = []
  range.push(1)

  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(total - 1, current + delta)

  if (rangeStart > 2) {
    range.push('...')
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
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

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  // اسکرول به بالای صفحه
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fetchMenuItems = async () => {
  menuItems.length = 0
  loading.value = true
  try {
    var result = await menuItemService.getMenuItems()
    menuItems.push(...result)
  } catch (error) {
    console.log('Error fetch menu item:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMenuItems)

const getCategoryIcon = (category) => {
  const icons = {
    همه: 'bi bi-grid-fill',
    موبایل: 'bi bi-phone',
    اسپیکر: 'bi bi-speaker',
    ایرپاد: 'bi bi-earbuds',
    'ساعت هوشمند': 'bi bi-smartwatch',
    هندزفری: 'bi bi-headphones',
    میکروفن: 'bi bi-mic-fill',
    شارژر: 'bi bi-lightning-charge',
    گلس: 'bi bi-shield-check',
    کاور: 'bi bi-phone-fill',
    سایر: 'bi bi-three-dots',
  }
  return icons[category] || 'bi bi-circle'
}
const getSortIcon = (sort) => {
  const icons = {
    جدیدترین: 'bi bi-clock-history',
    'قیمت (کم به زیاد)': 'bi bi-sort-numeric-down',
    'قیمت (زیاد به کم)': 'bi bi-sort-numeric-up',
  }
  return icons[sort] || 'bi bi-sort-down'
}

const sparkleStyle = (index) => {
  const angle = (index / 8) * 360
  const distance = 50
  return {
    transform: `rotate(${angle}deg) translate(${distance}px) rotate(-${angle}deg)`,
  }
}
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url('/src/assets/9947763.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.text-primary-emphasis {
  color: #94d0f3ff !important;
  font-weight: 400 !important;
}

/* Category Cards */
.category-card {
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.category-active {
  background: linear-gradient(135deg, #fdd90dff 0%, #caa00aff 100%);
  color: white;
  border-color: #000000ff;
  transform: scale(1.05);
  box-shadow: 0 10px 40px rgba(253, 189, 13, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: categoryPulse 2s infinite;
}

.category-inactive {
  background: white;
  border: 2px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-inactive:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #fdbd0dff;
}

/* Category Background Animation */
.category-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.category-card:hover .category-bg {
  transform: translateX(100%);
}

/* Active Indicator */
.active-indicator {
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  animation: sparkle 2s infinite;
}

.sparkle:nth-child(2n) {
  animation-delay: 0.5s;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes categoryPulse {
  0%,
  100% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1.08);
  }
}

/* Sort Dropdown */
.sort-dropdown {
  position: relative;
}

.sort-dropdown .btn {
  background: white;
  border: 2px solid #fdcd0dff;
  min-width: 200px;
}

.sort-icon-wrapper {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fdd50dff 0%, #ca940aff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.sort-text {
  text-align: start;
}

/* Dropdown Menu */
.dropdown-menu-center {
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

.menu-item-hover:hover {
  background: linear-gradient(135deg, #fddd0dff 0%, #ca900aff 100%);
  color: white;
  transform: translateX(5px);
}

.menu-icon {
  width: 24px;
  text-align: center;
}

/* Transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-rotate {
  transition: transform 0.3s ease;
}

.dropdown-toggle[aria-expanded='true'] .bi-chevron-down {
  transform: rotate(180deg);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(253, 185, 13, 0.3);
  color: black;
}

/* Cursor */
.cursor-pointer {
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .category-card {
    min-width: 80px !important;
    padding: 1rem !important;
  }

  .category-icon .fs-4 {
    font-size: 1.2rem !important;
  }

  .category-name {
    font-size: 0.8rem;
  }

  .sort-dropdown .btn {
    min-width: 180px;
  }
}
</style>
