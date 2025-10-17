<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <div class="text-center">
              <img src="/src/assets/mini-logo.png" alt="logo" width="150px;" />
            </div>
            <h2 class="text-center mb-4">انتخاب روش ثبت نام</h2>

            <!-- 🔥 تغییر: جایگزینی فرم با دکمه‌های مجزا -->
            <div class="text-center">
              <!-- دکمه ثبت نام با تلفن -->
              <router-link
                :to="{ name: APP_ROUTE_NAMES.PHONE_SIGN_UP }"
                class="btn btn-warning w-100 mb-3 py-3"
              >
                <i class="bi bi-phone me-2"></i>
                ثبت نام با شماره تلفن
              </router-link>

              <div class="text-muted small my-3">یا</div>

              <!-- دکمه ثبت نام با ایمیل -->
              <router-link
                :to="{ name: APP_ROUTE_NAMES.EMAIL_SIGN_UP }"
                class="btn btn-outline-warning w-100 py-3"
              >
                <i class="bi bi-envelope me-2"></i>
                ثبت نام با ایمیل
              </router-link>
            </div>

            <div class="text-center mt-4">
              <p class="text-muted small mb-2">هر دو روش نیازمند:</p>
              <div class="d-flex justify-content-center gap-3 small text-muted">
                <span><i class="bi bi-person me-1"></i>نام کامل</span>
                <span><i class="bi bi-envelope me-1"></i>ایمیل</span>
                <span><i class="bi bi-phone me-1"></i>شماره تلفن</span>
                <span><i class="bi bi-lock me-1"></i>رمز عبور</span>
              </div>
            </div>

            <div class="text-center mt-4">
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_IN }" class="text-decoration-none">
                حساب دارید؟ ورود
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
</script>

<style scoped>
* {
  direction: rtl;
  font-family: 'Yekan';
}

.btn {
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>