'use strict';

/* =========================
    COMPONENTES
========================= */

/**
 * Componente para renderizar una tarjeta de post
 * Construye el elemento usando la API del DOM (createElement)
 * @param {object} post - Objeto con los datos del post
 * @returns {HTMLElement} - Elemento article del DOM
 */
function PostCard(post) {
  // Crear el contenedor principal
    const article = document.createElement('article');
    article.className = 'post-card fade-in';
    article.dataset.id = post.id;

  // Crear el header
    const header = document.createElement('div');
    header.className = 'post-card-header';

    const title = document.createElement('h3');
    title.className = 'post-card-title';
    title.textContent = post.title;

    const badge = document.createElement('span');
    badge.className = 'post-card-id';
    badge.textContent = `#${post.id}`;

    header.appendChild(title);
    header.appendChild(badge);

  // Crear el body
    const body = document.createElement('p');
    body.className = 'post-card-body';
    body.textContent = post.body;

  // Crear el footer con botones
    const footer = document.createElement('div');
    footer.className = 'post-card-footer';

    const btnEditar = document.createElement('button');
    btnEditar.className = 'btn-editar';
    btnEditar.textContent = 'Editar';
    btnEditar.dataset.action = 'editar';
    btnEditar.dataset.id = post.id;

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.dataset.action = 'eliminar';
    btnEliminar.dataset.id = post.id;

    footer.appendChild(btnEditar);
    footer.appendChild(btnEliminar);

  // Ensamblar el article
    article.appendChild(header);
    article.appendChild(body);
    article.appendChild(footer);

    return article;
}

/**
 * Componente de spinner de carga
 * @returns {HTMLElement} - Elemento div del DOM
 */
function Spinner() {
    const container = document.createElement('div');
    container.className = 'loading';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    const texto = document.createElement('p');
    texto.textContent = 'Cargando posts...';

    container.appendChild(spinner);
    container.appendChild(texto);

    return container;
}

/**
 * Componente de mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeError(mensaje) {
    const container = document.createElement('div');
    container.className = 'error';

    const titulo = document.createElement('strong');
    titulo.textContent = 'Error';

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    container.appendChild(titulo);
    container.appendChild(texto);

    return container;
}

/**
 * Componente de mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeExito(mensaje) {
    const container = document.createElement('div');
    container.className = 'success';

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    container.appendChild(texto);

    return container;
}

/**
 * Componente de estado vacío
 * @returns {HTMLElement} - Elemento div del DOM
 */
function EstadoVacio() {
    const container = document.createElement('div');
    container.className = 'estado-vacio';

    const texto = document.createElement('p');
    texto.textContent = 'No hay posts para mostrar';

    container.appendChild(texto);

    return container;
}

/**
 * Mostrar mensaje temporal
 * @param {HTMLElement} contenedor - Elemento donde mostrar el mensaje
 * @param {HTMLElement} elemento - Elemento del mensaje (MensajeError o MensajeExito)
 * @param {number} duracion - Duración en ms (0 = no auto-ocultar)
 */
function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
    contenedor.innerHTML = '';
    contenedor.appendChild(elemento);
    contenedor.classList.remove('oculto');

    if (duracion > 0) {
        setTimeout(() => {
            contenedor.classList.add('oculto');
        }, duracion);
    }
}

/**
 * Limpiar contenedor y renderizar lista de posts
 * @param {array} posts - Array de posts a renderizar
 * @param {HTMLElement} contenedor - Elemento DOM donde renderizar
 */
function renderizarPosts(posts, contenedor) {
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    if (posts.length === 0) {
        contenedor.appendChild(EstadoVacio());
        return;
    }
    
    // Crear y agregar cada post
    posts.forEach(post => {
        contenedor.appendChild(PostCard(post));
    });
}