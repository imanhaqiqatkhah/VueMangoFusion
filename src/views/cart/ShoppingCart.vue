<template>
  <div class="container py-3">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4 text-primary">سبد شما</h2>
        <div class="text-center py-4">
          <div class="mb-4">
            <i class="bi bi-cart" style="font-size: 2rem"></i>
          </div>
          <h3 class="h5 mb-3">سبد شما خالی است</h3>
          <p class="h5 mb-3">انگار سبد شما خالی است، برای خرید زودتر اقدام کن</p>
          <button class="btn btn-primary"><i class="bi bi-arrow-right-square"></i></button>
        </div>
        <div>
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th scope="col" class="pe-4 fw-light" style="width: 30%">آیتم</th>
                      <th scope="col" class="text-center fw-light" style="width: 15%">قیمت</th>
                      <th scope="col" class="" style="width: 45%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="pe-4">
                        <div class="d-flex align-items-center gap-3">
                          <img
                            src="https://placehold.co/50x50"
                            class="img-fluid rounded d-none d-md-block"
                            style="width: 50px; height: 50px; object-fit: cover"
                          />
                          <span class="fw-medium">نام</span>
                        </div>
                      </td>
                      <td class="text-center align-middle">$$$</td>
                      <td class="align-middle">
                        <div class="input-group input-group-sm justify-content-center" style="">
                          <button class="btn btn-outline-secondary" type="button">
                            <i class="bi bi-plus"></i>
                          </button>
                          <input
                            type="text"
                            class="form-control text-center px-2"
                            readonly
                            style="max-width: 50px"
                          />
                          <button class="btn btn-outline-secondary" type="button">
                            <i class="bi bi-dash"></i></button
                          ><button class="btn btn-sm btn-outline-danger mx-md-4 mx-1">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary">
                  <i class="bi bi-arrow-right-square mx-1"></i><span class="">ادامه خرید</span>
                </button>
                <button class="btn btn-outline-danger">
                  <i class="bi bi-trash mx-1"></i><span class="">حذف سبد</span>
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <h4 class="card-title h6 mb-3">سفارش الان</h4>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-body-secondary"> آیتم ها (0)</span>
                    <span>$$$</span>
                  </div>
                  <hr />
                  <div class="d-flex justify-content-between mb-3">
                    <span class="fw-bold">قیمت کلی</span>
                    <span class="fw-bold test-primary">$$$</span>
                  </div>
                  <button class="btn btn-primary w-100" @click="checkout">
                    <i class="bi bi-cash-stack"></i>اقدام برای پرداخت
                  </button>
                  <div class="text-center mt-1">
                    <span class="text-danger">سفارش شما تا نیم ساعت دیگر آماده است</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>