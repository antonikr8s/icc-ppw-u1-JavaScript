'use strict';

/* =========================
   SIMULADOR DE PETICIONES (Paso 4)
========================= */

const log = document.getElementById('log');
const resultados = document.getElementById('resultados');

let tiempoSecuencial = 0;
let tiempoParalelo = 0;

function simularPeticion(nombre, tiempoMin = 500, tiempoMax = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const tiempoDelay = Math.floor(Math.random() * (tiempoMax - tiempoMin + 1)) + tiempoMin;

    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({
          nombre,
          tiempo: tiempoDelay,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, tiempoDelay);
  });
}

function formatearTiempo(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function mostrarLog(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

/* =========================
   CARGA SECUENCIAL Y PARALELA (Paso 5)
========================= */

async function cargarSecuencial() {
  mostrarLog('🔄 Iniciando carga secuencial...', 'info');
  resultados.classList.remove('visible');
  
  const inicio = performance.now();

  try {
    const usuario = await simularPeticion('Usuario', 500, 1000);
    mostrarLog(`✓ ${usuario.nombre} cargado en ${formatearTiempo(usuario.tiempo)}`, 'success');

    const posts = await simularPeticion('Posts', 700, 1500);
    mostrarLog(`✓ ${posts.nombre} cargados en ${formatearTiempo(posts.tiempo)}`, 'success');

    const comentarios = await simularPeticion('Comentarios', 600, 1200);
    mostrarLog(`✓ ${comentarios.nombre} cargados en ${formatearTiempo(comentarios.tiempo)}`, 'success');

    const fin = performance.now();
    const total = fin - inicio;
    tiempoSecuencial = total;

    mostrarLog(`✅ Secuencial completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();

  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }
}

async function cargarParalelo() {
  mostrarLog('🔄 Iniciando carga paralela...', 'info');
  resultados.classList.remove('visible');
  
  const inicio = performance.now();

  try {
    const promesas = [
      simularPeticion('Usuario', 500, 1000),
      simularPeticion('Posts', 700, 1500),
      simularPeticion('Comentarios', 600, 1200)
    ];

    const resultadosPromesas = await Promise.all(promesas);

    resultadosPromesas.forEach((resultado) => {
      mostrarLog(`✓ ${resultado.nombre} cargado en ${formatearTiempo(resultado.tiempo)}`, 'success');
    });

    const fin = performance.now();
    const total = fin - inicio;
    tiempoParalelo = total;

    mostrarLog(`✅ Paralelo completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();

  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }
}

function mostrarComparativa() {
  if (tiempoSecuencial > 0 && tiempoParalelo > 0) {
    const diferencia = tiempoSecuencial - tiempoParalelo;
    const porcentaje = ((diferencia / tiempoSecuencial) * 100).toFixed(1);

    resultados.innerHTML = `
      <h3>📊 Comparativa de Rendimiento</h3>
      <p><strong>Carga Secuencial:</strong> ${formatearTiempo(tiempoSecuencial)}</p>
      <p><strong>Carga Paralela:</strong> ${formatearTiempo(tiempoParalelo)}</p>
      <p><strong>Diferencia:</strong> ${formatearTiempo(diferencia)} (${porcentaje}% más rápido)</p>
    `;
    resultados.classList.add('visible');
  }
}

function limpiarLog() {
  log.innerHTML = '';
  resultados.classList.remove('visible');
  tiempoSecuencial = 0;
  tiempoParalelo = 0;
}

// Conectar eventos
document.getElementById('btn-secuencial').addEventListener('click', cargarSecuencial);
document.getElementById('btn-paralelo').addEventListener('click', cargarParalelo);
document.getElementById('btn-limpiar').addEventListener('click', limpiarLog);