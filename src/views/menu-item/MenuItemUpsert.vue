<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="spinner-grow text-primary" style="width: 2.5rem; height: 2.5rem" role="status">
      <span class="visually-hidden">در حال بارگیری...</span>
    </div>
  </div>
  <div class="container">
    <div class="mx-auto">
      <div class="mb-4 border-bottom d-flex justify-content-between align-items-center py-3">
        <h3 class="fw-semibold text-primary">افزودن منو</h3>
        <div class="d-flex gap-3">
          <button
            type="submit"
            form="menuForm"
            class="btn btn-primary btn-sm gap-2 rounded-1 px-4 py-2"
          >
            <span class="spinner-border spinner-border-sm ms-2"></span>
            افزودن آیتم
          </button>
          <button type="button" class="btn btn-outline border btn-sm gap-2 rounded-1 px-4 py-2">
            کنسل
          </button>
        </div>
      </div>
      <div class="alert alert-danger pb-0">
        لطفا ارور ها را برطرف کنید
        <ul>
          <li>ارور</li>
        </ul>
      </div>
      <form enctype="multipart/form-data" class="needs-validation" id="menuForms">
        <div class="row g-4">
          <div class="col-lg-7">
            <div class="d-flex flex-column g-12">
              <div class="mb-3">
                <label for="name" class="form-label">نام منو</label>
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  placeholder="نام منو را وارد کنید"
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">توضیحات منو</label>
                <textarea
                  id="description"
                  rows="3"
                  placeholder="برای آیتم توضیح دهید"
                  class="form-control"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="specialTag" class="form-label">برچسب ویژه (اختیاری)</label>
                <input
                  type="text"
                  id="specialTag"
                  class="form-control"
                  placeholder="برچسب ویژه را وارد کنید"
                />
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">قیمت</label>
                <input id="price" class="form-control" />
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div>
              <img
                src=""
                class="img-fluid w-100 mb-3 rounded"
                style="aspect-ratio: 1/1; object-fit: cover"
              />
              <div class="mb-3">
                <label for="image" class="form-label">تصویر منو</label>
                <input type="file" id="image" class="form-control" accept="image/*" />
                <div class="form-text">فایل انتخاب شده باید تصویر باشد</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: Yekan;
  direction: rtl;
}
</style>