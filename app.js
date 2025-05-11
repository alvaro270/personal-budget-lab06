// Función constructora base para Movimiento
function Movimiento(nombre, monto) {
  // Validación básica de datos comunes
  if (nombre.trim() === "") {
    throw new Error("El nombre no puede estar vacío.");
  }

  if (isNaN(monto) || monto <= 0) {
    throw new Error("El monto debe ser un número mayor a cero.");
  }

  // Propiedades comunes
  this.nombre = nombre;
  this.monto = monto;
  this.fecha = new Date(); // Añadir fecha y hora del registro
}

// Métodos comunes en el prototipo de Movimiento
Movimiento.prototype.formatearMonto = function () {
  return `$${this.monto.toFixed(2)}`;
};

// Método para renderizar el movimiento en el DOM
Movimiento.prototype.render = function () {
  // Crear elemento contenedor
  const movimientoItem = document.createElement("div");
  movimientoItem.className = `movimiento-item ${this.tipo}`;

  // Formatear fecha
  const fecha = this.fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Crear contenido HTML
  movimientoItem.innerHTML = `
        <div class="movimiento-info">
            <div class="movimiento-nombre">${this.nombre}</div>
            <div class="movimiento-fecha">${fecha}</div>
        </div>
        <div class="movimiento-monto ${
          this.tipo
        }">${this.formatearMonto()}</div>
    `;

  return movimientoItem;
};

// Función constructora para Ingreso (hereda de Movimiento)
function Ingreso(nombre, monto) {
  // Llamar al constructor padre con this
  Movimiento.call(this, nombre, monto);

  // Propiedad específica de Ingreso
  this.tipo = "ingreso";
}

// Establecer la herencia prototipal
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

// Métodos específicos para Ingreso
Ingreso.prototype.validarIngreso = function () {
  // Validaciones específicas para ingresos
  // Por ejemplo, podríamos validar categorías de ingresos en el futuro
  return true;
};

// Función constructora para Egreso (hereda de Movimiento)
function Egreso(nombre, monto) {
  // Llamar al constructor padre con this
  Movimiento.call(this, nombre, monto);

  // Propiedad específica de Egreso
  this.tipo = "egreso";
}

// Establecer la herencia prototipal
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

// Métodos específicos para Egreso
Egreso.prototype.validarEgreso = function () {
  // Validaciones específicas para egresos
  // Por ejemplo, comprobar si hay suficiente saldo
  const saldoActual = calcularSaldoActual();
  if (saldoActual < this.monto) {
    console.warn("⚠️ Advertencia: Este egreso supera tu saldo actual.");
    // Podríamos lanzar un error o simplemente advertir al usuario
  }
  return true;
};

// Variables globales
let movimientos = []; // Array para guardar los movimientos (ahora son objetos)

// Función para calcular el saldo actual (utilizada en validarEgreso)
function calcularSaldoActual() {
  let saldo = 0;
  movimientos.forEach((movimiento) => {
    if (movimiento.tipo === "ingreso") {
      saldo += movimiento.monto;
    } else {
      saldo -= movimiento.monto;
    }
  });
  return saldo;
}

// Función para registrar un nuevo movimiento
function registrarMovimiento() {
  try {
    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value;
    const monto = parseFloat(document.getElementById("monto").value);

    // Determinar el tipo seleccionado (usando radio buttons)
    const tipoIngreso = document.getElementById("tipo-ingreso");
    const tipo = tipoIngreso.checked ? "ingreso" : "egreso";

    // Crear el objeto apropiado según el tipo (usando herencia)
    let movimiento;

    if (tipo === "ingreso") {
      movimiento = new Ingreso(nombre, monto);
      movimiento.validarIngreso(); // Validaciones específicas
    } else {
      movimiento = new Egreso(nombre, monto);
      movimiento.validarEgreso(); // Validaciones específicas
    }

    // Agregar el movimiento al array
    movimientos.push(movimiento);

    // Limpiar el formulario
    document.getElementById("nombre").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("tipo-ingreso").checked = true;

    // Actualizar el resumen
    mostrarResumen();

    // Habilitar los botones de funciones ahora que hay datos
    document.getElementById("btnListarNombres").disabled = false;
    document.getElementById("btnFiltrarEgresos").disabled = false;
    document.getElementById("btnBuscarMovimiento").disabled = false;

    // Mostrar mensaje de éxito
    mostrarAlerta(
      `Movimiento "${nombre}" registrado correctamente.`,
      "success"
    );

    // Renderizar el movimiento en el DOM
    mostrarUltimoMovimiento(movimiento);

    // Enfocar el campo nombre para el siguiente registro
    document.getElementById("nombre").focus();
  } catch (error) {
    // Capturar los errores lanzados por el constructor y mostrar alerta
    mostrarAlerta(error.message, "error");
  }
}

// Función para mostrar el último movimiento añadido
function mostrarUltimoMovimiento(movimiento) {
  // Verificar si existe la sección de movimientos recientes
  let seccionMovimientos = document.querySelector(".movimientos-recientes");

  // Si no existe, crearla
  if (!seccionMovimientos) {
    seccionMovimientos = document.createElement("section");
    seccionMovimientos.className = "movimientos-recientes";

    // Crear título
    const titulo = document.createElement("h2");
    titulo.innerHTML = '<i class="fas fa-receipt"></i> Movimientos Recientes';

    // Crear contenedor para los items
    const contenedor = document.createElement("div");
    contenedor.className = "movimientos-lista";

    // Agregar elementos a la sección
    seccionMovimientos.appendChild(titulo);
    seccionMovimientos.appendChild(contenedor);

    // Insertar en el DOM después del dashboard
    document.querySelector(".dashboard").after(seccionMovimientos);
  }

  // Obtener el contenedor de movimientos
  const contenedorMovimientos =
    seccionMovimientos.querySelector(".movimientos-lista");

  // Usar el método render del prototipo para obtener el elemento HTML
  const movimientoElement = movimiento.render();

  // Insertar al inicio de la lista
  if (contenedorMovimientos.firstChild) {
    contenedorMovimientos.insertBefore(
      movimientoElement,
      contenedorMovimientos.firstChild
    );
  } else {
    contenedorMovimientos.appendChild(movimientoElement);
  }

  // Limitar a mostrar los 5 movimientos más recientes
  if (contenedorMovimientos.children.length > 5) {
    contenedorMovimientos.removeChild(contenedorMovimientos.lastChild);
  }
}

// Función para mostrar alertas temporales
function mostrarAlerta(mensaje, tipo) {
  // Crear elemento de alerta
  const alertaDiv = document.createElement("div");
  alertaDiv.className = `alerta ${tipo}`;

  // Icono según el tipo
  let icono =
    tipo === "error" ? "fas fa-exclamation-circle" : "fas fa-check-circle";

  // Contenido de la alerta
  alertaDiv.innerHTML = `<i class="${icono}"></i> ${mensaje}`;

  // Añadir a la página
  document.querySelector(".app-container").prepend(alertaDiv);

  // Agregar clase para animación de fadeOut después de 3 segundos
  setTimeout(() => {
    alertaDiv.classList.add("fadeOut");
    setTimeout(() => {
      alertaDiv.remove();
    }, 300);
  }, 3000);
}

// Método para mostrar el resumen
function mostrarResumen() {
  // Variables para el resumen
  let totalMovimientos = movimientos.length;
  let saldoTotal = 0;
  let totalIngresos = 0;
  let totalEgresos = 0;

  // Usar un forEach para calcular totales con los objetos Movimiento
  movimientos.forEach((movimiento) => {
    if (movimiento.tipo === "ingreso") {
      saldoTotal += movimiento.monto;
      totalIngresos += movimiento.monto;
    } else {
      saldoTotal -= movimiento.monto;
      totalEgresos += movimiento.monto;
    }
  });

  // Mostrar los totales en la UI
  document.getElementById("totalMovimientos").textContent = totalMovimientos;
  document.getElementById("saldoTotal").textContent =
    formatearMonto(saldoTotal);
  document.getElementById("totalIngresos").textContent =
    formatearMonto(totalIngresos);
  document.getElementById("totalEgresos").textContent =
    formatearMonto(totalEgresos);

  // Cambiar el color del saldo total según sea positivo o negativo
  const saldoElement = document.getElementById("saldoTotal");
  if (saldoTotal < 0) {
    saldoElement.style.color = "#fecaca";
  } else {
    saldoElement.style.color = "white";
  }
}

// Formatear cantidades monetarias (función global)
function formatearMonto(valor) {
  return `$${valor.toFixed(2)}`;
}

// HU1 - Listar nombres de movimientos usando map()
function listarNombresMovimientos() {
  // Verificar que haya movimientos
  if (movimientos.length === 0) {
    mostrarAlerta("No hay movimientos registrados.", "error");
    return [];
  }

  // Usar map() para obtener solo los nombres de los objetos Movimiento
  const nombres = movimientos.map((movimiento) => movimiento.nombre);

  // Mostrar resultados en la UI
  const resultadoDiv = document.getElementById("resultadoOperaciones");
  let contenidoHTML = `
        <h2><i class="fas fa-clipboard-list"></i> Resultados</h2>
        <div class="result-content">
            <h3>Nombres de movimientos registrados:</h3>
            <ul class="movement-list">
    `;

  nombres.forEach((nombre) => {
    contenidoHTML += `<li>${nombre}</li>`;
  });

  contenidoHTML += `
            </ul>
        </div>
    `;

  resultadoDiv.innerHTML = contenidoHTML;

  // Mostrar en consola para depuración
  console.log("Nombres de movimientos:", nombres);

  return nombres;
}

// HU2 - Filtrar egresos mayores a $100 usando filter()
function filtrarEgresosMayores100() {
  // Verificar que haya movimientos
  if (movimientos.length === 0) {
    mostrarAlerta("No hay movimientos registrados.", "error");
    return [];
  }

  // Usar filter() para obtener egresos > $100
  const egresosMayores = movimientos.filter(
    (movimiento) => movimiento.tipo === "egreso" && movimiento.monto > 100
  );

  // Mostrar resultados en la UI
  const resultadoDiv = document.getElementById("resultadoOperaciones");
  let contenidoHTML = `
        <h2><i class="fas fa-clipboard-list"></i> Resultados</h2>
        <div class="result-content">
            <h3>Egresos mayores a $100:</h3>
    `;

  if (egresosMayores.length === 0) {
    contenidoHTML += `<p>No se encontraron egresos mayores a $100.</p>`;
  } else {
    contenidoHTML += `<ul class="movement-list">`;
    egresosMayores.forEach((movimiento) => {
      contenidoHTML += `
                <li>
                    <strong>${movimiento.nombre}</strong> - 
                    <span class="monto-egreso">${movimiento.formatearMonto()}</span>
                </li>
            `;
    });
    contenidoHTML += `</ul>`;
  }

  contenidoHTML += `</div>`;
  resultadoDiv.innerHTML = contenidoHTML;

  // Mostrar en consola para depuración
  console.log("Egresos mayores a $100:", egresosMayores);

  return egresosMayores;
}

// HU3 - Buscar movimiento por nombre usando find()
function buscarMovimientoPorNombre() {
  // Verificar que haya movimientos
  if (movimientos.length === 0) {
    mostrarAlerta("No hay movimientos registrados.", "error");
    return null;
  }

  // Crear un diálogo personalizado para la búsqueda
  const dialogHTML = `
        <div class="search-dialog" id="searchDialog">
            <div class="search-dialog-content">
                <h3>Buscar Movimiento</h3>
                <div class="search-form">
                    <div class="input-with-icon">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Nombre del movimiento">
                    </div>
                    <div class="search-buttons">
                        <button id="cancelSearch" class="btn-secondary">Cancelar</button>
                        <button id="confirmSearch" class="btn-primary">Buscar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Insertar el diálogo en el DOM
  document.body.insertAdjacentHTML("beforeend", dialogHTML);

  // Obtener referencias a los elementos del diálogo
  const dialog = document.getElementById("searchDialog");
  const searchInput = document.getElementById("searchInput");
  const cancelButton = document.getElementById("cancelSearch");
  const confirmButton = document.getElementById("confirmSearch");

  // Enfocar el input de búsqueda
  searchInput.focus();

  // Función para ejecutar la búsqueda
  function realizarBusqueda() {
    const nombreBuscado = searchInput.value.trim();

    if (!nombreBuscado) {
      mostrarAlerta("Debes ingresar un nombre para buscar.", "error");
      return;
    }

    // Cerrar el diálogo
    dialog.remove();

    // Usar find() para localizar un movimiento por su nombre
    const movimientoEncontrado = movimientos.find(
      (movimiento) =>
        movimiento.nombre.toLowerCase() === nombreBuscado.toLowerCase()
    );

    // Mostrar resultados en la UI
    const resultadoDiv = document.getElementById("resultadoOperaciones");
    let contenidoHTML = `
            <h2><i class="fas fa-clipboard-list"></i> Resultados</h2>
            <div class="result-content">
                <h3>Búsqueda por nombre: "${nombreBuscado}"</h3>
        `;

    if (movimientoEncontrado) {
      // Determinar la clase y el icono según el tipo
      const tipoClase = movimientoEncontrado.tipo;
      const tipoIcono =
        movimientoEncontrado.tipo === "ingreso" ? "arrow-up" : "arrow-down";

      contenidoHTML += `
                <div class="movement-details">
                    <div class="movement-header ${tipoClase}">
                        <i class="fas fa-${tipoIcono}"></i>
                        <span>${
                          movimientoEncontrado.tipo.charAt(0).toUpperCase() +
                          movimientoEncontrado.tipo.slice(1)
                        }</span>
                    </div>
                    <h4>${movimientoEncontrado.nombre}</h4>
                    <div class="movement-info">
                        <span class="monto ${tipoClase}">${movimientoEncontrado.formatearMonto()}</span>
                    </div>
                </div>
            `;
    } else {
      contenidoHTML += `
                <div class="not-found">
                    <i class="fas fa-search"></i>
                    <p>No se encontró ningún movimiento con el nombre "${nombreBuscado}".</p>
                </div>
            `;
    }

    contenidoHTML += `</div>`;
    resultadoDiv.innerHTML = contenidoHTML;

    // Mostrar en consola para depuración
    console.log("Búsqueda por nombre:", nombreBuscado, movimientoEncontrado);
  }

  // Event listeners para los botones
  confirmButton.addEventListener("click", realizarBusqueda);
  cancelButton.addEventListener("click", () => dialog.remove());

  // También permitir la búsqueda con Enter
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      realizarBusqueda();
    }
  });
}

// Configuración inicial de la página
function inicializar() {
  // Desactivar botones hasta que haya movimientos
  document.getElementById("btnListarNombres").disabled = true;
  document.getElementById("btnFiltrarEgresos").disabled = true;
  document.getElementById("btnBuscarMovimiento").disabled = true;

  // Configurar eventos de botones
  document
    .getElementById("btnRegistrar")
    .addEventListener("click", registrarMovimiento);
  document
    .getElementById("btnListarNombres")
    .addEventListener("click", listarNombresMovimientos);
  document
    .getElementById("btnFiltrarEgresos")
    .addEventListener("click", filtrarEgresosMayores100);
  document
    .getElementById("btnBuscarMovimiento")
    .addEventListener("click", buscarMovimientoPorNombre);

  // Permitir enviar el formulario con Enter
  document.getElementById("monto").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      registrarMovimiento();
    }
  });
}

// Ejecutar la inicialización cuando se carga la página
window.onload = inicializar;
