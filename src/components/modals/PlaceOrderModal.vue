<template>
  <div
    class="position-fixed top-0 end-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
    style="z-index: 1050"
  >
    <div
      class="bg-body p-4 rounded-4 shadow-lg mx-3 overflow-auto"
      style="max-width: 500px; width: 100%; max-height: 90vh"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold m-0">تکمیل سفارش شما</h4>
        <button class="btn"><i class="bi bi-x-circle"></i></button>
      </div>
      <div class="alert alert-danger" role="alert"><span class="d-block">ارور</span></div>
      <form>
        <div class="mb-3">
          <label for="pickupName" class="form-label">نام</label>
          <input type="text" class="form-control" id="pickupName" />
        </div>

        <div class="mb-3">
          <label for="pickupPhoneNumber">شماره تلفن</label>
          <input type="tel" class="form-control" id="pickupPhoneNumber" />
        </div>
        <div class="mb-4">
          <label for="pickupEmail" class="form-label">ایمیل</label>
          <input type="email" class="form-control" id="pickupEmail" />
        </div>

        <div class="bg-body-tertiary rounded-3 p-3 mb-4">
          <h5 class="fw-bold mb-3">سفارش شما</h5>
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-medium">نام</span>
              <div class="d-flex align-items-center gap-3">
                <span class="fw-medium">تعداد</span>
                <span class="fw-medium">قیمت</span>
              </div>
            </div>
            <div class="border-top pt-3 mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">قیمت کل</span>
                <span class="fw-bold fe-5">تومان</span>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-start gap-2">
          <button type="button" class="btn btn-outline-secondary px-4">کنسل</button>
          <button tabindex="submit" class="btn btn-primary px-4">
            <span class="d-flex align-items-center gap-2">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">در حال بارگیری...</span>
              </div>
              در حال پردازش </span
            ><span> سفارش </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
* {
  direction: rtl;
  font-family: Yekan;
}
</style>