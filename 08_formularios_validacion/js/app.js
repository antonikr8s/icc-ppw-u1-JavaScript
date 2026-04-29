'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */

const formRegistro = document.querySelector('#form-registro');
const inputPassword = document.querySelector('#password');
const inputConfirmarPassword = document.querySelector('#confirmar_password');
const inputTelefono = document.querySelector('#telefono');
const passwordStrength = document.querySelector('#password-strength');
const btnEnviar = document.querySelector('#btn-enviar');
const btnLimpiar = document.querySelector('#btn-limpiar');
const mensajeEstado = document.querySelector('#mensaje-estado');
const resultadoRegistro = document.querySelector('#resultado-registro');

/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Validar un campo individual y mostrar feedback visual
 * @param {HTMLElement} campo - Campo a validar
 */
function validarCampoConFeedback(campo) {
  // 6.2.1: Llamar a ValidacionService.validarCampo(campo) y guardar en resultado
  const resultado = ValidacionService.validarCampo(campo);

  // 6.2.2: Si no es válido, llamar a mostrarError(campo, resultado.error)
  if (!resultado.valido) {
    mostrarError(campo, resultado.error);
  }
  // 6.2.3: Si es válido, llamar a limpiarError(campo)
  else {
    limpiarError(campo);
  }
}

/**
 * Actualizar el indicador de fuerza de contraseña
 * @param {string} password - Contraseña a evaluar
 */
function actualizarIndicadorFuerza(password) {
  if (!password) {
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';
    return;
  }

  // 6.2.4: Llamar a ValidacionService.evaluarFuerzaPassword(password)
  const fuerza = ValidacionService.evaluarFuerzaPassword(password);

  // 6.2.5: Actualizar textContent y className del indicador
  passwordStrength.textContent = `Fortaleza: ${fuerza.nivel}`;
  passwordStrength.className = `password-strength ${fuerza.clase}`;
}

/**
 * Verificar si todos los campos requeridos están llenos (excluyendo el checkbox)
 * @param {HTMLFormElement} form - Formulario a verificar
 * @returns {boolean} - true si todos los campos requeridos tienen valor
 */
function verificarCamposLlenos(form) {
  // Seleccionamos los campos requeridos, pero excluimos específicamente los de tipo checkbox
  const camposRequeridos = form.querySelectorAll('[required]:not([type="checkbox"])');
  
  return [...camposRequeridos].every(campo => {
    return campo.value.trim() !== '';
  });
}

/**
 * Actualizar estado del botón de enviar
 * @param {HTMLFormElement} form - Formulario
 */
function actualizarBotonEnviar(form) {
  // 6.2.6: Llamar a verificarCamposLlenos y deshabilitar el botón si no están todos llenos
  const todosLlenos = verificarCamposLlenos(form);
  btnEnviar.disabled = !todosLlenos;
}

/**
 * Procesar el envío del formulario
 * @param {FormData} formData - Datos del formulario
 */
function procesarEnvio(formData) {
  // 6.3.1: Convertir FormData a objeto con Object.fromEntries
  const datos = Object.fromEntries(formData);

  // 6.3.2: Agregar el checkbox manualmente (FormData solo incluye si está checked)
  datos.terminos = formRegistro.querySelector('#terminos').checked;

  // Simular envío (aquí iría fetch a un servidor)
  console.log('Datos a enviar:', datos);

  // Mostrar mensaje de éxito
  mostrarMensajeTemporal(
    mensajeEstado,
    MensajeExito('Registro completado exitosamente. Los datos se muestran abajo.'),
    5000
  );

  // Renderizar resultado
  renderizarResultado(datos, resultadoRegistro);

  // Limpiar formulario
  formRegistro.reset();

  // Limpiar clases de validación
  const campos = formRegistro.querySelectorAll('input, select, textarea');
  campos.forEach(campo => {
    campo.classList.remove('campo--valido', 'campo--error');
  });

  // Limpiar indicador de contraseña
  passwordStrength.textContent = '';
  passwordStrength.className = 'password-strength';

  // Actualizar botón
  actualizarBotonEnviar(formRegistro);

  // Scroll al resultado
  resultadoRegistro.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================
   EVENT LISTENERS
========================= */

// Submit del formulario
formRegistro.addEventListener('submit', (e) => {
  e.preventDefault();

  // 7.1.1: Validar todos los campos con ValidacionService.validarFormulario
  const formularioValido = ValidacionService.validarFormulario(formRegistro);

  // 7.1.2: Si NO es válido, mostrar mensaje de error
  if (!formularioValido) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError('Por favor, corrige los errores en el formulario antes de continuar.'),
      5000
    );
    
    // Hacer scroll al primer campo con error
    const primerError = formRegistro.querySelector('.campo--error');
    if (primerError) {
      primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primerError.focus();
    }
    
    return;
  }

  // 7.1.3: Si es válido, crear FormData y llamar a procesarEnvio
  const formData = new FormData(formRegistro);
  procesarEnvio(formData);
});

// Validar campo al perder el foco
formRegistro.addEventListener('focusout', (e) => {
  if (e.target.matches('input, select, textarea')) {
    validarCampoConFeedback(e.target);
  }
});

// Limpiar error al empezar a escribir
formRegistro.addEventListener('input', (e) => {
  if (e.target.matches('input, textarea')) {
    // Solo limpiar el error, no validar aún
    const errorDiv = e.target.parentElement.querySelector('.error-mensaje');
    if (errorDiv && errorDiv.textContent) {
      limpiarError(e.target);
    }
  }
  
  // Actualizar botón
  actualizarBotonEnviar(formRegistro);
});

// Actualizar fuerza de contraseña en tiempo real
inputPassword.addEventListener('input', (e) => {
  actualizarIndicadorFuerza(e.target.value);
});

// Aplicar máscara de teléfono
inputTelefono.addEventListener('input', (e) => {
  aplicarMascaraTelefono(e.target);
});

// Revalidar confirmación de contraseña cuando cambia la contraseña principal
inputPassword.addEventListener('input', () => {
  if (inputConfirmarPassword.value) {
    validarCampoConFeedback(inputConfirmarPassword);
  }
});

// Limpiar formulario
btnLimpiar.addEventListener('click', () => {
  if (confirm('¿Estás seguro de que deseas limpiar el formulario?')) {
    formRegistro.reset();
    
    // Limpiar todas las validaciones visuales
    const campos = formRegistro.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
      campo.classList.remove('campo--valido', 'campo--error');
      const errorDiv = campo.parentElement.querySelector('.error-mensaje');
      if (errorDiv) {
        errorDiv.textContent = '';
      }
    });

    // Limpiar indicador de contraseña
    passwordStrength.textContent = '';
    passwordStrength.className = 'password-strength';

    // Limpiar resultado
    limpiarResultado(resultadoRegistro);

    // Ocultar mensaje de estado
    mensajeEstado.classList.add('oculto');

    // Actualizar botón
    actualizarBotonEnviar(formRegistro);

    // Focus en el primer campo
    document.querySelector('#nombre').focus();
  }
});

const STORAGE_KEY = 'form_borrador';

// 1. Guardar progreso automáticamente al escribir
formRegistro.addEventListener('input', () => {
  const datos = Object.fromEntries(new FormData(formRegistro));
  // Agregamos manualmente el checkbox porque FormData no lo captura si está vacío
  datos.terminos = document.querySelector('#terminos').checked;
  
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
});

// 2. Restaurar los datos al recargar la página
window.addEventListener('DOMContentLoaded', () => {
  const borrador = sessionStorage.getItem(STORAGE_KEY);
  if (!borrador) return;

  const datos = JSON.parse(borrador);
  Object.entries(datos).forEach(([name, value]) => {
    const campo = formRegistro.querySelector(`[name="${name}"]`);
    if (campo) {
      if (campo.type === 'checkbox') {
        campo.checked = value;
      } else {
        campo.value = value;
      }
      // Validar visualmente el campo restaurado
      validarCampoConFeedback(campo);
    }
  });
  
  // Actualizar la fuerza de la contraseña y el botón
  actualizarIndicadorFuerza(inputPassword.value);
  actualizarBotonEnviar(formRegistro);
});

/* =========================
   INICIALIZACIÓN
========================= */

// Deshabilitar botón inicialmente
actualizarBotonEnviar(formRegistro);

// Focus en el primer campo
document.querySelector('#nombre').focus();