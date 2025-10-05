export const CATEGORIES = [
  'دیتاسنتر ایران',
  'دیتاسنتر آمریکا',
  'دیتاسنتر اروپا',
  'دیتاسنتر اقیانوسیه',
]

export const SORT_PRICE_LOW_HIGH = 'قیمت از پایین به بالا'
export const SORT_PRICE_HIGH_LOW = 'قیمت از بالا به پایین'
export const SORT_NAME_A_Z = 'حروف الفبا از پایین به بالا'
export const SORT_NAME_Z_A = 'حروف الفبا از بالا به پایین'

export const SORT_OPTIONS = [SORT_NAME_A_Z, SORT_NAME_Z_A, SORT_PRICE_LOW_HIGH, SORT_PRICE_HIGH_LOW]

// constants.js
export const ROLES = ['Customer', 'Admin']

// مپینگ نقش‌ها به فارسی
export const ROLES_PERSIAN = {
  Customer: 'مشتری',
  Admin: 'مدیر',
}

// برای نمایش در dropdown
export const ROLE_OPTIONS = [
  { value: 'Customer', label: 'مشتری' },
  { value: 'Admin', label: 'مدیر' },
]

// constants.js
export const ORDER_STATUS_CONFIRMED = 'Confirmed'
export const ORDER_STATUS_READY_FOR_PICKUP = 'Ready for Pickup'
export const ORDER_STATUS_COMPLETED = 'Completed'
export const ORDER_STATUS_CANCELLED = 'Cancelled'

export const ORDER_STATUS = [
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CANCELLED,
]

// مپینگ وضعیت‌ها به فارسی
export const ORDER_STATUS_PERSIAN = {
  [ORDER_STATUS_CONFIRMED]: 'تأیید شده',
  [ORDER_STATUS_READY_FOR_PICKUP]: 'آماده تحویل',
  [ORDER_STATUS_COMPLETED]: 'تکمیل شده',
  [ORDER_STATUS_CANCELLED]: 'لغو شده',
}

// برای نمایش در dropdown
export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS_CONFIRMED, label: 'تأیید شده' },
  { value: ORDER_STATUS_READY_FOR_PICKUP, label: 'آماده تحویل' },
  { value: ORDER_STATUS_COMPLETED, label: 'تکمیل شده' },
  { value: ORDER_STATUS_CANCELLED, label: 'لغو شده' },
]
