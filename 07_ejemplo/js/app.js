'use strict'
//clave con la cual se guarda en localStorage
const STORAGE_KEY = 'tareas';

//elementos del DOM
const input = document.querySelector("#input-tarea");
const btnAdd = document.querySelector("#btn-agregar");//se usa # para buscar el id
const lista = document.querySelector("#lista-tareas");
const btnLimpiar = document.querySelector("#btn-limpiar");

//variable de memoria del listado
let tareas = [];

function loadStorage() {
    const datos = localStorage.getItem(STORAGE_KEY);//select * from tareas, estoy leyendo las llaves (tareas)
    return datos ? JSON.parse(datos) : [];//operador ternario if(datos)
}

function saveTarea() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas))
}

function agregarTarea(texto) {

    if (!texto.trim()) return;
    
    const nuevaTarea = {
        id: Date.now(),
        texto: texto.trim(),
        completada: false
    }

    tareas.push(nuevaTarea);
    saveTarea();
    renderizar();
    input.value = '';
    input.focus();
}

function eliminarTarea(id) {

    /* FIND
    const tarea = tareas.find(t => t.id === id);//entender, la usaremos bastante
    if (tarea) {
        tareas.remove(tarea);
    }
        */

    // FILTER
    tareas = tareas.filter(t => t.id !== id)
    saveTarea();
    renderizar();
}

function toggleTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
    }
    saveTarea();
    renderizar();
}

function limpiarTodo() {
    if (tareas.length === 0) return;//tamanio es igual a cero, salgo del metodo, caso contrario, si tenemos 2 casi 3 tareas
    if (confirm('Estas seguro??')) {
        tareas = [];
        saveTarea();
        renderizar();
    }
}

function renderizar() {
  
  lista.innerHTML = '';//vaciar

  if (tareas.length === 0) { //si esta vacio
    const vacio = document.createElement('p');
    //creo un document tipo P
    vacio.className = 'vacio';
    vacio.textContent = 'No hay tareas. ¡Agrega una!';
    lista.appendChild(vacio);//agrega el elemento p
    btnLimpiar.disabled = true;//boton limpiar esta deshabilitado (true) porque no hay nada que limpiar
    return;
  }

  btnLimpiar.disabled = false;// si tiene elementos, al boton lo habilito

  tareas.forEach(tarea => {//para cada tarea del listado
    const item = document.createElement('div');//creo un elemento tipo div
    item.className = 'item-tarea';
    if (tarea.completada) {
      item.classList.add('completada');
    }

    const texto = document.createElement('span');
    texto.className = 'texto-tarea';
    texto.textContent = tarea.texto;
    texto.addEventListener('click', () => toggleTarea(tarea.id));

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

    item.appendChild(texto);
    item.appendChild(btnEliminar);
    lista.appendChild(item);
  });
}

btnAdd.addEventListener('click', () => {
  agregarTarea(input.value);
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    agregarTarea(input.value);
  }
});

btnLimpiar.addEventListener('click', limpiarTodo);


// Cargar tareas guardadas al abrir la página
tareas = loadStorage();
renderizar();
input.focus();