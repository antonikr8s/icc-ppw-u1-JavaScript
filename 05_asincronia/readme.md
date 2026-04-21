# Práctica 03: Eventos en JavaScript

## 📌 Información General

- **Título:** Práctica 03: Eventos en JavaScript
- **Asignatura:** Programación y Plataformas Web
- **Carrera:** Ingeniería en Computación
- **Estudiante:** Carlos Antonio Gordillo Tenemaza
- **Semestre:** 5to Semestre

---

## 🛠️ Descripción

Este proyecto profundiza en la interactividad web mediante el manejo avanzado de **eventos** en JavaScript. La aplicación consta de dos módulos principales: un sistema de validación de formularios robusto y una lista de tareas dinámica. 

Se implementaron técnicas esenciales para el desarrollo profesional como la prevención de comportamientos por defecto (`preventDefault`), la validación de datos en tiempo real (eventos `blur` e `input`), y la optimización de recursos mediante la **Delegación de Eventos** (Event Delegation), permitiendo gestionar múltiples elementos interactivos con un solo escuchador en el nodo padre.

**Nota sobre la implementación y diseño:** Al igual que en la práctica anterior, el material base carecía de estilos y vinculación. Se integró manualmente la etiqueta `<link rel="stylesheet" href="css/styles.css">` en el `index.html` y se desarrolló íntegramente el archivo `styles.css` para proporcionar una interfaz moderna, con estados visuales claros para errores, botones activos y tareas completadas.

---

## 🧑‍💻 Capturas de Pantalla

### 1. Validación en acción
Muestra los mensajes de error dinámicos que aparecen cuando los campos del formulario no cumplen con los requisitos mínimos de validación.

![Vista Accion](./assets/01-validacion.png)

### 2. Formulario procesado
Muestra la interfaz tras un envío exitoso mediante el atajo de teclado, visualizando el resumen de los datos recibidos y el reseteo automático de los campos.

![Vista Formulario](./assets/02-formulario-enviado.png)

### 3. Event delegation funcionando
Muestra el sistema de tareas dinámico en funcionamiento, permitiendo la gestión de múltiples elementos mediante un único escuchador de eventos en el contenedor padre.

![Vista Event](./assets/03-delegacion.png)

### 4. Contador de tareas actualizado
Demuestra la actualización automática en tiempo real del contador de tareas pendientes conforme se agregan o eliminan elementos de la lista.

![Vista Contador](./assets/04-contador-tareas-actualizado.png)

### 5. Tareas completadas
Refleja el cambio de estado visual (texto tachado y estilo grisáceo) al interactuar con el DOM para marcar una tarea como finalizada.

![Vista Completadas](./assets/05-tareas-completadas.png)

---

## 💻 Fragmentos de Código Relevantes

### 1. Validación de formulario con `preventDefault()`
Se intercepta el evento de envío para validar todos los campos antes de permitir el procesamiento de los datos.

```javascript
formulario.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita la recarga de la página

  const nombreValido = validarNombre();
  const emailValido = validarEmail();
  // ... validación del resto de campos

  if (nombreValido && emailValido && asuntoValido && mensajeValido) {
    mostrarResultado();
    resetearFormulario();
    return;
  }
  // Foco automático en el primer error encontrado
  if (!nombreValido) inputNombre.focus();
});
```

### 2. Atajo de teclado (Ctrl + Enter)
Implementación de un atajo de productividad que permite enviar el formulario utilizando combinaciones de teclas globales.

```javascript
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    formulario.requestSubmit(); // Dispara el evento submit con sus validaciones
  }
});
```

### 3. Event Delegation en la lista de tareas
Uso de un único listener en el contenedor padre para gestionar acciones de "eliminar" y "completar" en elementos creados dinámicamente.

```javascript
listaTareas.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  const item = e.target.closest('li');
  const id = Number(item.dataset.id);

  if (action === 'eliminar') {
    tareas = tareas.filter((tarea) => tarea.id !== id);
    renderizarTareas();
  }

  if (action === 'toggle') {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
    renderizarTareas();
  }
});
```