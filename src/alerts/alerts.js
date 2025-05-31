import Swal from 'sweetalert2';
import './alerts.css'

// Configuración base para tus alertas
const baseConfig = {
  customClass: {
    popup: 'my-swal-popup',
    title: 'my-swal-title',
    confirmButton: 'my-swal-confirm-btn',
    cancelButton: 'my-swal-cancel-btn',
  },
  buttonsStyling: false, // Necesario para que los customClass se apliquen
  background: '#fefefe', // Puedes usar una variable CSS también
};

// Alerta genérica
export const showAlert = (options = {}) => {
  return Swal.fire({ ...baseConfig, ...options });
};

// Confirmación
export const showSuccess = (message) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};

export const showError = (title, text) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};

export const showConfirm = (text) => {
  return Swal.fire({
    ...baseConfig,
    html: text,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    width: '320px',
    background: '#e4e4e4',
    customClass: {
      ...baseConfig.customClass,
      popup: 'my-swal-popup-small',
      title: '', // se omite el título
    },
    buttonsStyling: false,
  });
};
