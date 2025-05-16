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
    icon: 'success',
    title: message,
    timer: 2000,
    showConfirmButton: false
  });
};

export const showError = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title,
    text
  });
};

export const showConfirm = (text, title = '') => {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  });
};