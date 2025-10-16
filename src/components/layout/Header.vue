<template>
  <nav class="navbar navbar-expand-md rounded-3 mx-auto my-2 w-100 bg-warning">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: APP_ROUTE_NAMES.HOME }" @click="closeNavbar">
        <img
          src="@/assets/logo.png"
          alt="logo"
          width="130"
          height="40"
          class="d-inline-block align-text-top ms-2"
        />
      </router-link>

      <!-- سبد خرید برای موبایل - بالای دکمه منو -->
      <div class="d-md-none me-auto ms-3">
        <router-link
          class="nav-link position-relative p-0"
          aria-current="page"
          :to="{ name: APP_ROUTE_NAMES.CART }"
          @click="closeNavbar"
        >
          <i class="bi bi-cart3 fs-5"></i>
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style="font-size: 0.6rem"
          >
            {{ cartStore.cartCount }}
          </span>
        </router-link>
      </div>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        ref="toggler"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent" ref="navbar">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.HOME }"
              @click="closeNavbar"
              >خانه</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.CONTACT }"
              @click="closeNavbar"
              >تماس با ما</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.ORDER_LIST }"
              @click="closeNavbar"
              >سفارشات</router-link
            >
          </li>
          <li class="nav-item dropdown" v-if="authStore.isAdmin">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ادمین
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  class="dropdown-item"
                  aria-current="page"
                  :to="{ name: APP_ROUTE_NAMES.MENU_ITEM_LIST }"
                  @click="closeNavbar"
                  >آیتم های منو</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  aria-current="page"
                  :to="{ name: APP_ROUTE_NAMES.MANAGE_ORDER_ADMIN }"
                  @click="closeNavbar"
                  >مدیریت سفارشات</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav me-auto small">
          <!-- سبد خرید برای دسکتاپ - مخفی در موبایل -->
          <li class="nav-item d-none d-md-block">
            <router-link
              class="nav-link position-relative"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.CART }"
              @click="closeNavbar"
            >
              <i class="bi bi-cart3"></i>
              <span
                class="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ cartStore.cartCount }}
              </span>
            </router-link>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.SIGN_IN }"
              @click="closeNavbar"
              >ورود</router-link
            >
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.SIGN_UP }"
              @click="closeNavbar"
              >ثبت نام</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <button class="nav-link px-2" aria-current="page" @click="handleSignOut">خروج</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useSwal } from '@/composables/swal'

const cartStore = useCartStore()
const authStore = useAuthStore()
const { showConfirm, showSuccess } = useSwal()

const toggler = ref(null)
const navbar = ref(null)

const closeNavbar = () => {
  // Simple method - check if navbar is open on mobile and close it
  const navbar = document.getElementById('navbarSupportedContent')
  const toggler = document.querySelector('.navbar-toggler')

  if (navbar && toggler && window.innerWidth < 768) {
    // Check if navbar is currently open
    if (navbar.classList.contains('show')) {
      // Close navbar by triggering click on toggler
      toggler.click()
    }
  }
}

const handleSignOut = async () => {
  try {
    const confirmResult = await showConfirm('آیا از خروج اطمینان دارید؟')

    if (confirmResult.isConfirmed) {
      closeNavbar()
      cartStore.clearCart()
      await authStore.signOut()
      showSuccess('با موفقیت خارج شدید')
    }
  } catch (error) {
    console.log('Error in sign out:', error)
  }
}
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
</style>