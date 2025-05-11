// Función constructora para Movimiento
function Movimiento(nombre, tipo, monto) {
    // Validación básica de datos
    if (nombre.trim() === "") {
        throw new Error("El nombre no puede estar vacío.");
    }
    
    if (isNaN(monto) || monto <= 0) {
        throw new Error("El monto debe ser un número mayor a cero.");
    }
    
    if (tipo !== "ingreso" && tipo !== "egreso") {
        throw new Error("El tipo debe ser 'ingreso' o 'egreso'.");
    }
    
    // Propiedades del objeto
    this.nombre = nombre;
    this.tipo = tipo;
    this.monto = monto;
    this.fecha = new Date(); // Añadir fecha y hora del registro
}

// Método para formatear el monto
Movimiento.prototype.formatearMonto = function() {
    return `$${this.monto.toFixed(2)}`;
};

// Método para renderizar el movimiento en el DOM - HU3
Movimiento.prototype.render = function() {
    // Crear elemento contenedor
    const movimientoItem = document.createElement('div');
    movimientoItem.className = `movimiento-item ${this.tipo}`;
    
    // Formatear fecha
    const fecha = this.fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Crear contenido HTML
    movimientoItem.innerHTML = `
        <div class="movimiento-info">
            <div class="movimiento-nombre">${this.nombre}</div>
            <div class="movimiento-fecha">${fecha}</div>
        </div>
        <div class="movimiento-monto ${this.tipo}">${this.formatearMonto()}</div>
    `;
    
    return movimientoItem;
};

// Variables globales
let movimientos = []; // Array para guardar los movimientos (ahora son objetos)

// Función para registrar un nuevo movimiento
function registrarMovimiento() {
    try {
        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const monto = parseFloat(document.getElementById('monto').value);
        
        // Determinar el tipo seleccionado (usando radio buttons)
        const tipoIngreso = document.getElementById('tipo-ingreso');
        const tipo = tipoIngreso.checked ? 'ingreso' : 'egreso';
        
        // Crear un nuevo objeto Movimiento usando la función constructora
        const movimiento = new Movimiento(nombre, tipo, monto);
        
        // Agregar el movimiento al array
        movimientos.push(movimiento);
        
        // Limpiar el formulario
        document.getElementById('nombre').value = "";
        document.getElementById('monto').value = "";
        document.getElementById('tipo-ingreso').checked = true;
        
        // Actualizar el resumen
        mostrarResumen();
        
        // Habilitar los botones de funciones ahora que hay datos
        document.getElementById('btnListarNombres').disabled = false;
        document.getElementById('btnFiltrarEgresos').disabled = false;
        document.getElementById('btnBuscarMovimiento').disabled = false;
        
        // Mostrar mensaje de éxito
        mostrarAlerta(`Movimiento "${nombre}" registrado correctamente.`, "success");
        
        // Renderizar el movimiento en el DOM - Nueva funcionalidad de HU3
        mostrarUltimoMovimiento(movimiento);
        
        // Enfocar el campo nombre para el siguiente registro
        document.getElementById('nombre').focus();
    } catch (error) {
        // Capturar los errores lanzados por el constructor y mostrar alerta
        mostrarAlerta(error.message, "error");
    }
}

// Función para mostrar el último movimiento añadido
function mostrarUltimoMovimiento(movimiento) {
    // Verificar si existe la sección de movimientos recientes
    let seccionMovimientos = document.querySelector('.movimientos-recientes');
    
    // Si no existe, crearla
    if (!seccionMovimientos) {
        seccionMovimientos = document.createElement('section');
        seccionMovimientos.className = 'movimientos-recientes';
        
        // Crear título
        const titulo = document.createElement('h2');
        titulo.innerHTML = '<i class="fas fa-receipt"></i> Movimientos Recientes';
        
        // Crear contenedor para los items
        const contenedor = document.createElement('div');
        contenedor.className = 'movimientos-lista';
        
        // Agregar elementos a la sección
        seccionMovimientos.appendChild(titulo);
        seccionMovimientos.appendChild(contenedor);
        
        // Insertar en el DOM después del dashboard
        document.querySelector('.dashboard').after(seccionMovimientos);
        
        // Aplicar estilos
        aplicarEstilosMovimientosRecientes();
    }
    
    // Obtener el contenedor de movimientos
    const contenedorMovimientos = seccionMovimientos.querySelector('.movimientos-lista');
    
    // Usar el método render del prototipo para obtener el elemento HTML
    const movimientoElement = movimiento.render();
    
    // Insertar al inicio de la lista
    if (contenedorMovimientos.firstChild) {
        contenedorMovimientos.insertBefore(movimientoElement, contenedorMovimientos.firstChild);
    } else {
        contenedorMovimientos.appendChild(movimientoElement);
    }
    
    // Limitar a mostrar los 5 movimientos más recientes
    if (contenedorMovimientos.children.length > 5) {
        contenedorMovimientos.removeChild(contenedorMovimientos.lastChild);
    }
}

// Aplicar estilos a la sección de movimientos recientes
function aplicarEstilosMovimientosRecientes() {
    const estilos = `
        .movimientos-recientes {
            background-color: white;
            border-radius: var(--card-radius);
            box-shadow: var(--shadow);
            padding: 20px;
            margin-top: 20px;
            grid-column: span 2;
        }
        
        .movimientos-recientes h2 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--dark-text);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .movimientos-recientes h2 i {
            color: var(--primary-color);
        }
        
        .movimientos-lista {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .movimiento-item {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid transparent;
            transition: var(--transition);
        }
        
        .movimiento-item.ingreso {
            border-left-color: var(--income-color);
        }
        
        .movimiento-item.egreso {
            border-left-color: var(--expense-color);
        }
        
        .movimiento-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .movimiento-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .movimiento-nombre {
            font-weight: 500;
            color: var(--dark-text);
        }
        
        .movimiento-fecha {
            font-size: 0.85rem;
            color: var(--medium-text);
        }
        
        .movimiento-monto {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .movimiento-monto.ingreso {
            color: var(--income-color);
        }
        
        .movimiento-monto.egreso {
            color: var(--expense-color);
        }
        
        @media (max-width: 768px) {
            .movimientos-recientes {
                grid-column: span 1;
            }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = estilos;
    document.head.appendChild(styleElement);
}

// Función para mostrar alertas temporales
function mostrarAlerta(mensaje, tipo) {
    // Crear elemento de alerta
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alerta ${tipo}`;
    
    // Icono según el tipo
    let icono = tipo === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    
    // Contenido de la alerta
    alertaDiv.innerHTML = `<i class="${icono}"></i> ${mensaje}`;
    
    // Añadir a la página
    document.querySelector('.app-container').prepend(alertaDiv);
    
    // Aplicar estilo específico según el tipo
    if (tipo === 'error') {
        alertaDiv.style.backgroundColor = '#fee2e2';
        alertaDiv.style.color = '#b91c1c';
        alertaDiv.style.borderLeft = '4px solid #b91c1c';
    } else {
        alertaDiv.style.backgroundColor = '#d1fae5';
        alertaDiv.style.color = '#065f46';
        alertaDiv.style.borderLeft = '4px solid #065f46';
    }
    
    // Estilos comunes
    alertaDiv.style.padding = '12px 15px';
    alertaDiv.style.marginBottom = '15px';
    alertaDiv.style.borderRadius = '6px';
    alertaDiv.style.display = 'flex';
    alertaDiv.style.alignItems = 'center';
    alertaDiv.style.gap = '8px';
    alertaDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    alertaDiv.style.animation = 'fadeIn 0.3s ease';
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        alertaDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            alertaDiv.remove();
        }, 300);
    }, 3000);
}

// Función para mostrar el resumen
function mostrarResumen() {
    // Variables para el resumen
    let totalMovimientos = movimientos.length;
    let saldoTotal = 0;
    let totalIngresos = 0;
    let totalEgresos = 0;
    
    // Usar un forEach para calcular totales con los objetos Movimiento
    movimientos.forEach(movimiento => {
        if (movimiento.tipo === "ingreso") {
            saldoTotal += movimiento.monto;
            totalIngresos += movimiento.monto;
        } else {
            saldoTotal -= movimiento.monto;
            totalEgresos += movimiento.monto;
        }
    });
    
    // Mostrar los totales en la UI
    document.getElementById('totalMovimientos').textContent = totalMovimientos;
    document.getElementById('saldoTotal').textContent = formatearMonto(saldoTotal);
    document.getElementById('totalIngresos').textContent = formatearMonto(totalIngresos);
    document.getElementById('totalEgresos').textContent = formatearMonto(totalEgresos);
    
    // Cambiar el color del saldo total según sea positivo o negativo
    const saldoElement = document.getElementById('saldoTotal');
    if (saldoTotal < 0) {
        saldoElement.style.color = '#fecaca';
    } else {
        saldoElement.style.color = 'white';
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
    const nombres = movimientos.map(movimiento => movimiento.nombre);
    
    // Mostrar resultados en la UI
    const resultadoDiv = document.getElementById('resultadoOperaciones');
    let contenidoHTML = `
        <h2><i class="fas fa-clipboard-list"></i> Resultados</h2>
        <div class="result-content">
            <h3>Nombres de movimientos registrados:</h3>
            <ul class="movement-list">
    `;
    
    nombres.forEach(nombre => {
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
    const egresosMayores = movimientos.filter(movimiento => 
        movimiento.tipo === "egreso" && movimiento.monto > 100
    );
    
    // Mostrar resultados en la UI
    const resultadoDiv = document.getElementById('resultadoOperaciones');
    let contenidoHTML = `
        <h2><i class="fas fa-clipboard-list"></i> Resultados</h2>
        <div class="result-content">
            <h3>Egresos mayores a $100:</h3>
    `;
    
    if (egresosMayores.length === 0) {
        contenidoHTML += `<p>No se encontraron egresos mayores a $100.</p>`;
    } else {
        contenidoHTML += `<ul class="movement-list">`;
        egresosMayores.forEach(movimiento => {
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
    
    // Aplicar estilos a los montos de egresos
    const montosEgreso = document.querySelectorAll('.monto-egreso');
    montosEgreso.forEach(monto => {
        monto.style.color = '#ef4444';
        monto.style.fontWeight = '600';
    });
    
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
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
    
    // Aplicar estilos al diálogo
    const dialog = document.getElementById('searchDialog');
    const searchInput = document.getElementById('searchInput');
    const cancelButton = document.getElementById('cancelSearch');
    const confirmButton = document.getElementById('confirmSearch');
    
    // Estilos del diálogo
    Object.assign(dialog.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        animation: 'fadeIn 0.3s ease'
    });
    
    // Estilos del contenido
    Object.assign(dialog.querySelector('.search-dialog-content').style, {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    });
    
    // Estilos del título
    Object.assign(dialog.querySelector('h3').style, {
        marginBottom: '15px',
        color: '#1f2937',
        fontSize: '1.2rem'
    });
    
    // Estilos del formulario
    Object.assign(dialog.querySelector('.search-form').style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    });
    
    // Estilos de los botones
    Object.assign(dialog.querySelector('.search-buttons').style, {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
    });
    
    // Estilos específicos de los botones
    Object.assign(cancelButton.style, {
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        padding: '10px 15px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer'
    });
    
    Object.assign(confirmButton.style, {
        backgroundColor: '#6366f1',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer'
    });
    
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
        const movimientoEncontrado = movimientos.find(movimiento => 
            movimiento.nombre.toLowerCase() === nombreBuscado.toLowerCase()
        );
        
        // Mostrar resultados en la UI
        const resultadoDiv = document.getElementById('resultadoOperaciones');
        let contenidoHTML = `
            <h2><i class="fas fa-clipboard-list"></i> Resultados</h2>
            <div class="result-content">
                <h3>Búsqueda por nombre: "${nombreBuscado}"</h3>
        `;
        
        if (movimientoEncontrado) {
            // Determinar la clase y el icono según el tipo
            const tipoClase = movimientoEncontrado.tipo === 'ingreso' ? 'ingreso' : 'egreso';
            const tipoIcono = movimientoEncontrado.tipo === 'ingreso' ? 'arrow-up' : 'arrow-down';
            
            contenidoHTML += `
                <div class="movement-details">
                    <div class="movement-header ${tipoClase}">
                        <i class="fas fa-${tipoIcono}"></i>
                        <span>${movimientoEncontrado.tipo.charAt(0).toUpperCase() + movimientoEncontrado.tipo.slice(1)}</span>
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
        
        // Aplicar estilos adicionales
        if (movimientoEncontrado) {
            const movementDetails = document.querySelector('.movement-details');
            const movementHeader = document.querySelector('.movement-header');
            const montoElement = document.querySelector('.monto');
            
            Object.assign(movementDetails.style, {
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '15px',
                marginTop: '15px',
                border: '1px solid #e5e7eb'
            });
            
            Object.assign(movementHeader.style, {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '4px',
                marginBottom: '10px',
                fontSize: '0.85rem',
                fontWeight: '500'
            });
            
            if (movimientoEncontrado.tipo === 'ingreso') {
                Object.assign(movementHeader.style, {
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#065f46'
                });
                
                Object.assign(montoElement.style, {
                    color: '#10b981',
                    fontWeight: '600',
                    fontSize: '1.2rem'
                });
            } else {
                Object.assign(movementHeader.style, {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#b91c1c'
                });
                
                Object.assign(montoElement.style, {
                    color: '#ef4444',
                    fontWeight: '600',
                    fontSize: '1.2rem'
                });
            }
        } else {
            const notFound = document.querySelector('.not-found');
            
            Object.assign(notFound.style, {
                textAlign: 'center',
                padding: '30px 0',
                color: '#6b7280'
            });
            
            Object.assign(notFound.querySelector('i').style, {
                fontSize: '3rem',
                marginBottom: '10px',
                opacity: '0.5'
            });
        }
        
        // Mostrar en consola para depuración
        console.log("Búsqueda por nombre:", nombreBuscado, movimientoEncontrado);
    }
    
    // Event listeners para los botones
    confirmButton.addEventListener('click', realizarBusqueda);
    cancelButton.addEventListener('click', () => dialog.remove());
    
    // También permitir la búsqueda con Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
}

// Configuración inicial de la página
function inicializar() {
    // Estilizar la página
    aplicarEstilosAdicionales();
    
    // Desactivar botones hasta que haya movimientos
    document.getElementById('btnListarNombres').disabled = true;
    document.getElementById('btnFiltrarEgresos').disabled = true;
    document.getElementById('btnBuscarMovimiento').disabled = true;
    
    // Configurar eventos de botones
    document.getElementById('btnRegistrar').addEventListener('click', registrarMovimiento);
    document.getElementById('btnListarNombres').addEventListener('click', listarNombresMovimientos);
    document.getElementById('btnFiltrarEgresos').addEventListener('click', filtrarEgresosMayores100);
    document.getElementById('btnBuscarMovimiento').addEventListener('click', buscarMovimientoPorNombre);
    
    // Permitir enviar el formulario con Enter
    document.getElementById('monto').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            registrarMovimiento();
        }
    });
    
    // Animaciones CSS para los elementos
    const keyframes = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);
}

// Función para aplicar estilos adicionales
function aplicarEstilosAdicionales() {
    // Aplicar estilos a la lista de resultados
    const estilosLista = `
        .movement-list {
            list-style-type: none;
            padding: 0;
            margin-top: 15px;
        }
        
        .movement-list li {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .movement-list li:last-child {
            border-bottom: none;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = estilosLista;
    document.head.appendChild(styleElement);
}

// Ejecutar la inicialización cuando se carga la página
window.onload = inicializar;