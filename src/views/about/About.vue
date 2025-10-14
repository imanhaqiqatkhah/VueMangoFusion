<template>
  <section id="scroll">
    <div class="container px-4 px-lg-5">
      <div class="row gx-4 gx-lg-5 align-items-center my-5">
        <!-- متن و محتوا در سمت چپ -->
        <div class="col-lg-8">
          <div class="text-content">
            <h1 class="mb-4"><span style="color: orange">چرا</span> موبایل محدث2؟</h1>
            <p class="lead mb-4 text-body-secondary" style="text-align: justify; font-size: 17px">
              در موبایل محدث 2، ما با ارائه‌ی جدیدترین مدل‌های گوشی‌های هوشمند از برندهای معتبر
              دنیا، تجربه‌ای متفاوت از خرید را برای شما فراهم می‌کنیم. تمامی محصولات با تضمین اصالت،
              قیمت مناسب و خدمات پس از فروش ارائه می‌شوند. اگر به دنبال کیفیت، تنوع و اطمینان در
              خرید موبایل هستید، فروشگاه ما مقصد ایده‌آل شماست.✨
            </p>
          </div>
        </div>

        <!-- تصویر در سمت راست -->
        <div class="col-lg-4 mt-4 mt-lg-0">
          <div class="image-container text-center">
            <img
              class="img-fluid rounded"
              src="/src/assets/iPhone-16-Pro-PNG-Image (1).png"
              alt="گوشی موبایل آیفون 16 پرو"
              style="max-height: 300px; object-fit: contain"
            />
          </div>
        </div>
      </div>

      <div class="row gx-4 gx-lg-5 text-center">
        <div class="col-md-4 mb-5">
          <div class="card h-100 service-card">
            <div class="card-body">
              <div class="icon-wrapper mb-3">
                <i class="bi bi-shield-check"></i>
              </div>
              <h2 class="card-title fw-bold text-dark">تضمین اصالت کالا</h2>
              <p class="card-text text-muted">
                تمامی محصولات با گارانتی اصلی و تضمین اصالت ارائه می‌شوند. خیالتان از بابت اصل بودن
                کالا راحت باشد.
              </p>
            </div>
            <div class="card-footer bg-transparent border-0">
              <a class="btn btn-warning btn-sm custom-btn" href="#!">
                اطلاعات بیشتر
                <i class="bi bi-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-5">
          <div class="card h-100 service-card">
            <div class="card-body">
              <div class="icon-wrapper mb-3">
                <i class="bi bi-truck"></i>
              </div>
              <h2 class="card-title fw-bold text-dark">تحویل سریع</h2>
              <p class="card-text text-muted">
                ارسال سریع به تمام نقاط کشور در کمترین زمان ممکن. سرویس تحویل درب منزل در شوشتر و
                سایر شهرستان‌ها.
              </p>
            </div>
            <div class="card-footer bg-transparent border-0">
              <a class="btn btn-warning btn-sm custom-btn" href="#!">
                اطلاعات بیشتر
                <i class="bi bi-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-5">
          <div class="card h-100 service-card">
            <div class="card-body">
              <div class="icon-wrapper mb-3">
                <i class="bi bi-headset"></i>
              </div>
              <h2 class="card-title fw-bold text-dark">پشتیبانی 24/7</h2>
              <p class="card-text text-muted">
                پشتیبانی تمام وقت حتی در روزهای تعطیل. مشاوره رایگان قبل و بعد از خرید در خدمت شما
                هستیم.
              </p>
            </div>
            <div class="card-footer bg-transparent border-0">
              <a class="btn btn-warning btn-sm custom-btn" href="#!">
                اطلاعات بیشتر
                <i class="bi bi-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- Call to Action -->
      <div class="row mt-1 text-center">
        <div class="col-12">
          <div class="card bg-warning border-0 shadow">
            <div class="card-body py-3">
              <p class="m-0 fs-5">با موبایل محدث2 در ارتباط باشید</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
.service-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffbf00ff, #a76a28ff, #ffc107);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffb30020, #ff9d0010);
  transition: all 0.3s ease;
}

.service-card:nth-child(1) .icon-wrapper {
  background: linear-gradient(135deg, #ffdd0020, #ffbb0010);
}

.service-card:nth-child(2) .icon-wrapper {
  background: linear-gradient(135deg, #a7852820, #a76c2810);
}

.service-card:nth-child(3) .icon-wrapper {
  background: linear-gradient(135deg, #ffc10720, #ffc10710);
}

.icon-wrapper i {
  font-size: 2rem;
  transition: all 0.3s ease;
}

.service-card:nth-child(1) .icon-wrapper i {
  color: #ff8c00ff;
}

.service-card:nth-child(2) .icon-wrapper i {
  color: #a7a728ff;
}

.service-card:nth-child(3) .icon-wrapper i {
  color: #3a2c00ff;
}

.service-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.service-card:hover .icon-wrapper i {
  transform: scale(1.2);
}

.custom-btn {
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.custom-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.custom-btn:hover::before {
  left: 100%;
}

.custom-btn:hover {
  transform: translateX(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.card-text {
  text-align: justify;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* انیمیشن ظاهر شدن */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-card {
  animation: fadeInUp 0.6s ease forwards;
}

.service-card:nth-child(2) {
  animation-delay: 0.2s;
}

.service-card:nth-child(3) {
  animation-delay: 0.4s;
}
</style>


