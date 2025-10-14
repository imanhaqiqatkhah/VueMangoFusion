<template>
  <footer class="custom-footer rounded">
    <!-- بخش اصلی فوتر -->
    <div class="footer-main py-1">
      <div class="container">
        <div class="row gx-4 rounded-3">
          <!-- اطلاعات تماس -->
          <div class="col-lg-4 col-md-6">
            <div class="footer-section">
              <div class="footer-title d-flex mb-3">
                <i class="bi bi-geo-alt-fill ms-1"></i>
                <h5>آدرس فروشگاه</h5>
              </div>
              <div class="footer-content text-end text-md-start">
                <p class="mb-2">
                  <i class="bi bi-geo me-2"></i>
                  ایران، خوزستان، شهر شوشتر، خیابان طالقانی، موبایل محدث، شعبه2
                </p>
                <p class="mb-2">
                  <i class="bi bi-telephone me-2"></i>
                  09044110410
                </p>
                <p class="mb-0" style="font-family: sans-serif">
                  <i class="bi bi-envelope me-2"></i>
                  info@mobilemohades2.ir
                </p>
              </div>
            </div>
          </div>
          <!-- لینک های سریع -->
          <div class="col-lg-3 col-md-6 col-6">
            <div class="footer-section">
              <div class="footer-title d-flex align-items-center">
                <i class="bi bi-link-45deg ms-1 mt-1"></i>
                <h5>لینک های سریع</h5>
              </div>
              <ul class="footer-links list-unstyled">
                <li class="mb-2">
                  <router-link :to="{ name: APP_ROUTE_NAMES.HOME }" class="footer-link">
                    <i class="bi bi-chevron-left me-2"></i>
                    خانه
                  </router-link>
                </li>
                <li class="mb-2">
                  <router-link :to="{ name: APP_ROUTE_NAMES.SHOP }" class="footer-link">
                    <i class="bi bi-chevron-left me-2"></i>
                    فروشگاه
                  </router-link>
                </li>
                <li class="mb-2">
                  <router-link :to="{ name: APP_ROUTE_NAMES.ABOUT }" class="footer-link">
                    <i class="bi bi-chevron-left me-2"></i>
                    درباره ما
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: APP_ROUTE_NAMES.CONTACT }" class="footer-link">
                    <i class="bi bi-chevron-left me-2"></i>
                    تماس با ما
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <!-- شبکه های اجتماعی -->
          <div class="col-lg-5 col-md-6 col-6">
            <div class="footer-section me-3">
              <div class="footer-title d-flex align-items-center mb-3">
                <i class="bi bi-upc ms-1 mt-1"></i>
                <h5>شبکه های اجتماعی</h5>
              </div>
              <div class="social-section">
                <div class="social-grid">
                  <a
                    href="https://instagram.com/mobile_mohades2"
                    target="_blank"
                    class="social-item"
                  >
                    <i class="bi bi-instagram"></i>
                  </a>
                  <a href="https://t.me/mobile_mohades2" target="_blank" class="social-item">
                    <i class="bi bi-telegram"></i>
                  </a>
                  <a href="https://wa.me/989044110410" target="_blank" class="social-item">
                    <i class="bi bi-whatsapp"></i>
                  </a>
                  <a href="mailto:imanhaqiqatkhah@gmail.com" target="_blank" class="social-item">
                    <i class="bi bi-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- بخش کپی رایت -->
    <div class="footer-bottom py-3 rounded">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start">
            <p class="mb-0 copyright-text">
              <i class="bi bi-c-circle me-1"></i>
              کلیه حقوق برای موبایل محدث2 محفوظ است
            </p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <p class="mb-0 developer-text">
              طراحی و توسعه توسط
              <span class="developer-name">imanHaqiqatKhah</span>
              <i class="bi bi-code-slash ms-1"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
</script>
<style scoped>
* {
  direction: rtl;
}
.custom-footer {
  background: linear-gradient(135deg, #ffbb00ff 0%, #ffb300ff 100%);
  color: #fff;
  font-family: Yekan, sans-serif;
  direction: rtl;
  border-top: 3px solid #ffc107;
}

.footer-main {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.footer-section {
  padding: 1rem 0;
}

.footer-title {
  color: #000000ff;
  border-bottom: 2px solid rgba(255, 193, 7, 0.3);
  padding-bottom: 0.5rem;
}

.footer-title h5 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-title i {
  font-size: 1.3rem;
}

.footer-content p {
  color: #383838ff;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
}

.footer-content i {
  color: #000000ff;
  margin-left: 0.5rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.footer-links {
  margin: 0;
}

.footer-link {
  color: #4e4e4eff;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.3rem 0;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: #835a08ff;
  transform: translateX(-5px);
}

.footer-link i {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.footer-link:hover i {
  transform: translateX(-3px);
}

.social-section p {
  color: #999999;
  font-size: 0.9rem;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 300px;
}

.social-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #908473ff;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.social-item:hover {
  background: #ffc107;
  color: #1a1a1a;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright-text,
.developer-text {
  color: #ffffffff;
  font-size: 0.85rem;
  margin: 0;
}

.developer-name {
  color: #ffc107;
  font-weight: 600;
}

/* انیمیشن‌ها */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-section {
  animation: fadeInUp 0.6s ease forwards;
}

.footer-section:nth-child(1) {
  animation-delay: 0.1s;
}
.footer-section:nth-child(2) {
  animation-delay: 0.2s;
}
.footer-section:nth-child(3) {
  animation-delay: 0.3s;
}

/* ریسپانسیو - موبایل */
@media (max-width: 768px) {
  .footer-main {
    padding: 2rem 0;
  }

  /* همه بخش‌های فوتر در موبایل سمت راست */
  .footer-section {
    text-align: right !important;
    margin-bottom: 2rem;
  }

  .footer-title {
    justify-content: flex-start !important;
  }

  .footer-content p {
    justify-content: flex-start !important;
  }

  .footer-links {
    text-align: right !important;
  }

  .footer-link {
    justify-content: flex-start !important;
  }

  .social-section {
    text-align: right !important;
  }

  .social-grid {
    margin: 0;
    justify-items: start;
  }

  .footer-bottom .row > div {
    text-align: center !important;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .social-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    justify-items: start;
  }

  .social-item {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}
</style>