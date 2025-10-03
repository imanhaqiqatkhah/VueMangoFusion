<template>
  <nav class="navbar navbar-expand-md rounded-3 mx-auto my-2 w-100 bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: APP_ROUTE_NAMES.HOME }">
        <img
          src="@/assets/logo.png"
          alt="logo"
          width="160"
          height="30"
          class="d-inline-block align-text-top ms-2"
        />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.HOME }"
              >خانه</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.ORDER_LIST }"
              >سفارشات
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-light"
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
                  >آیتم های منو</router-link
                >
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  aria-current="page"
                  :to="{ name: APP_ROUTE_NAMES.MANAGE_ORDER_ADMIN }"
                  >مدیریت سفارشات</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav me-auto small">
          <li class="nav-item">
            <router-link
              class="nav-link text-light position-relative"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.CART }"
              ><i class="bi bi-cart3"></i>
              <span
                class="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
                >{{ cartStore.cartCount }}</span
              >
            </router-link>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link
              class="nav-link text-light"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.SIGN_IN }"
              >ورود
            </router-link>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link
              class="nav-link text-light"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.SIGN_UP }"
              >ثبت نام
            </router-link>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <button
              class="nav-link text-light px-2"
              aria-current="page"
              @click="authStore.signOut()"
            >
              خروج
            </button>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-light"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-laptop"></i>
            </a>
            <ul class="dropdown-menu text-center">
              <li>
                <button
                  class="dropdown-item"
                  aria-current="page"
                  @click="themeStore.setTheme('light')"
                >
                  <i class="bi bi-sun"></i> روشن
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  aria-current="page"
                  @click="themeStore.setTheme('dark')"
                >
                  <i class="bi bi-moon-fill"></i> تاریک
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useThemeStore } from '@/stores/storeTheme'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
const cartStore = useCartStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
</script>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
</style>