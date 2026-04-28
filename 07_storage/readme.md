# Práctica 07: Web Storage y Persistencia

## 📌 Información General

- **Título:** Práctica 07: Web Storage y Persistencia
- **Asignatura:** Programación y Plataformas Web
- **Carrera:** Ingeniería en Computación
- **Estudiante:** Carlos Antonio Gordillo Tenemaza
- **Semestre:** 5to Semestre

---

## 🛠️ Descripción

Este proyecto es una aplicación interactiva de Lista de Tareas (To-Do List) diseñada para demostrar la implementación de la **persistencia de datos** en el navegador utilizando **Web Storage API (`localStorage`)**. La aplicación permite mantener el estado de las tareas y las preferencias del usuario (tema visual claro/oscuro) incluso después de recargar la página o cerrar el navegador.

El proyecto se centra en aplicar buenas prácticas de desarrollo web moderno sin el uso de frameworks:
1. **Patrón de Servicio:** Separación completa de la lógica de persistencia de datos (`storage.js`) de la lógica de renderizado e interfaz (`app.js`).
2. **Manejo Seguro del DOM:** Construcción dinámica de la interfaz utilizando estrictamente la API `document.createElement` y `textContent`, previniendo vulnerabilidades XSS al evitar por completo el uso de `innerHTML` para la inserción de datos de usuario.
3. **Serialización JSON y Manejo de Errores:** Uso correcto de `JSON.stringify()` y `JSON.parse()` para almacenar objetos complejos, implementando bloques `try/catch` para evitar fallos si el almacenamiento está restringido o lleno.

---

## 💻 Fragmentos de Código Destacado

### 1. Patrón de Servicio para Web Storage
Encapsulación de las operaciones de lectura/escritura y serialización segura de datos.
```javascript
const TareaStorage = {
  CLAVE: 'tareas_lista',

  getAll() {
    try {
      const datos = localStorage.getItem(this.CLAVE);
      if (!datos) return [];
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error al leer tareas:', error);
      return [];
    }
  },

  guardar(tareas) {
    try {
      localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  }
};
```


### 2. Creación Segura de Elementos DOM
Uso de `createElement` para garantizar la seguridad al renderizar datos ingresados por el usuario.
```javascript
function crearElementoTarea(tarea) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = tarea.id;

  // Se utiliza textContent en lugar de innerHTML para escapar caracteres automáticamente
  const span = document.createElement('span');
  span.className = 'task-item__text';
  span.textContent = tarea.texto; 

  // ... ensamblaje de checkbox, botones y event listeners ...
  li.appendChild(span);
  
  return li;
}
```

### 3. Persistencia de Preferencias (Tema)
Lectura de `localStorage` para aplicar dinámicamente variables CSS según la elección del usuario.
```javascript
function aplicarTema(nombreTema) {
  const tema = TEMAS[nombreTema];
  if (tema) {
    Object.entries(tema).forEach(([propiedad, valor]) => {
      document.documentElement.style.setProperty(propiedad, valor);
    });
  }
  
  // Persistir la selección del usuario
  TemaStorage.setTema(nombreTema);
}
```


## 🧑‍💻 Capturas de Pantalla

### 1. Lista con datos
**Descripción:** Interfaz principal mostrando los ítems (tareas) creados por el usuario, visibles y renderizados correctamente en el DOM de forma dinámica.

![Vista Lista](./assets/01-)


### 2. Persistencia
**Descripción:** Comprobación de persistencia. Tras recargar la pestaña del navegador (F5), la lista de tareas y sus estados se mantienen intactos, demostrando la correcta lectura desde el localStorage en la inicialización.
![Vista Persistencia](./assets/02-)

### 3. Tema oscuro
**Descripción:** Aplicación con el cambio de tema oscuro aplicado mediante la modificación de las variables CSS root, estado que también persiste en el Web Storage.
![Vista Tema](./assets/03-)

### 4. DevTools Application
**Descripción:** Pestaña 'Application' de las herramientas de desarrollador (DevTools) del navegador. Se evidencia la sección 'Local Storage' mostrando las claves tareas_lista (con el array en formato JSON stringificado) y tema_app.
![Vista DevTools](./assets/04-)

### 5. Lista con datos
**Descripción:** Capturas de los archivos principales storage.js y app.js, demostrando la organización en patrón de servicio, el CRUD funcional y el uso correcto de las APIs del navegador.
![Vista ListaDatos](./assets/05-)
