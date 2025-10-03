<template>
  <div>
    <div class="position-relative overflow-hidden mb-4">
      <div class="hero-section position-relative py-5 rounded-4" style="min-height: 400px">
        <div class="container position-relative z-3">
          <div class="row justify-content-center text-center">
            <div class="col-lg-8 col-xl-7">
              <h1 class="display-4 fw-bold text-white mb-4">
                سرزمین ابری<br /><span class="text-primary-emphasis">همیشه با شما</span>
              </h1>
              <div
                class="input-group mx-auto shadow-lg rounded-pill overflow-hidden"
                style="max-width: 600px"
              >
                <button class="btn btn-primary px-4 d-flex align-items-center border-0">
                  <i class="bi bi-search"></i><span class="me-2 d-none d-sm-inline">جستجو</span>
                </button>
                <input
                  v-model="searchValue"
                  type="text"
                  class="form-control border-0 py-3 px-4"
                  placeholder="جستجو کن"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container px-0 mx-0">
      <!-- Filters Section -->
      <div class="row g-3 my-4 border align-items-center shadow-sm rounded-4 mx-1 pt-1 p-3">
        <!-- Categories -->
        <div class="col-lg-auto">
          <div class="d-flex flex-wrap gap-2">
            <button
              :class="{
                'btn-primary shadow-sm': category === selectedCategory,
                'btn-outline-primary': category !== selectedCategory,
              }"
              class="btn rounded px-4 py-2 fe-7 position-relative overflow-hidden"
              @click="updateSelectedCategory(category)"
              v-for="(category, index) in categoryList"
              :key="index"
            >
              <span class="position-relative z-1">{{ category }}</span>
            </button>
          </div>
        </div>
        <div class="col-lg-auto order-1 order-lg-2 me-lg-auto">
          <div class="dropdown">
            <button
              class="btn btn-outline-primary rounded px-3 py-2 dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-sort-down"></i><span class="fe-7">{{ selectedSortOption }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-start shadow-sm rounded-3">
              <li v-for="(sort, index) in SORT_OPTIONS" :key="index">
                <button
                  class="dropdown-item py-2 px-3 d-flex align-items-center gap-2"
                  @click="updateSelectedSortOption(sort)"
                >
                  <span class="fe-7 px-1 mx-1">{{ sort }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Content Section -->
      <div class="text-center py-5" v-if="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">در حال بارگیری...</span>
        </div>
      </div>
      <div v-else>
        <div class="row">
          <MenuItemCard
            v-if="filteredItems.length && filteredItems.length > 0"
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="list-item col-12 col-md-6 col-lg-4 pb-4"
            :menuItem="item"
            @show-details="handleShowDetails"
          />

          <div class="text-center py-5 display-4 mx-auto text-body-secondary mb-3 d-block">
            <i class="bi bi-emoji-frown"></i>
            <p class="lead text-body-secondary">هیچ آیتمی یافت نشد</p>
          </div>
        </div>
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
  SORT_NAME_A_Z,
  SORT_NAME_Z_A,
  SORT_PRICE_LOW_HIGH,
  SORT_PRICE_HIGH_LOW,
  SORT_OPTIONS,
} from '@/constants/constants'
const { showConfirm, showError, showSuccess } = useSwal()
const menuItems = reactive([])
const loading = ref(false)
const selectedCategory = ref('همه')
const selectedSortOption = ref(SORT_OPTIONS[0])
const searchValue = ref('')
const router = useRouter()
const categoryList = reactive(['همه', ...CATEGORIES])

const showModal = ref(false)
const selectedMenuItem = ref(null)

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
}
function updateSelectedSortOption(sort) {
  selectedSortOption.value = sort
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

  if (selectedSortOption.value == SORT_NAME_A_Z) {
    tempArray.sort((a, b) => a.name.localeCompare(b.name))
  }
  if (selectedSortOption.value == SORT_NAME_Z_A) {
    tempArray.sort((a, b) => b.name.localeCompare(a.name))
  }
  if (selectedSortOption.value == SORT_PRICE_LOW_HIGH) {
    tempArray.sort((a, b) => a.price - b.price)
  }
  if (selectedSortOption.value == SORT_PRICE_HIGH_LOW) {
    tempArray.sort((a, b) => b.price - a.price)
  }
  return tempArray
})

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
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url('/src/assets//hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.text-primary-emphasis {
  color: #94d0f3ff !important;
  font-weight: 400 !important;
}
</style>