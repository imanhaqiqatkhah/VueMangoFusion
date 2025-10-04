import { toJalaali, toGregorian } from 'jalaali-js'

export function usePersianDate() {
  const toPersianDate = (date = new Date()) => {
    const gregorianDate = new Date(date)
    const jalaali = toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1,
      gregorianDate.getDate(),
    )

    return `${jalaali.jy}/${jalaali.jm}/${jalaali.jd}`
  }

  const toPersianDateWithTime = (date = new Date()) => {
    const gregorianDate = new Date(date)
    const jalaali = toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1,
      gregorianDate.getDate(),
    )

    const time = gregorianDate.toLocaleTimeString('fa-IR')
    return `${jalaali.jy}/${jalaali.jm}/${jalaali.jd} - ${time}`
  }

  const getPersianMonthName = (monthNumber) => {
    const months = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ]
    return months[monthNumber - 1] || ''
  }

  const toPersianDateFormatted = (date = new Date()) => {
    const gregorianDate = new Date(date)
    const jalaali = toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1,
      gregorianDate.getDate(),
    )

    return `${jalaali.jd} ${getPersianMonthName(jalaali.jm)} ${jalaali.jy}`
  }

  return {
    toPersianDate,
    toPersianDateWithTime,
    toPersianDateFormatted,
    getPersianMonthName,
  }
}
