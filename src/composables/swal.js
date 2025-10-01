import Swal from 'sweetalert2'

export function useSwal() {
  const showAlert = async (options) => {
    Swal.fire(options)
  }
  const showSuccess = async (message) => {
    return await showAlert({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    })
  }
  const showError = async (message) => {
    return await showAlert({
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    })
  }
  const showConfirm = async (message) => {
    return await showAlert({
      title: 'آیا اطمینان دارید؟',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'بله! بگذر',
    })
  }
  return { showError, showSuccess, showConfirm }
}
