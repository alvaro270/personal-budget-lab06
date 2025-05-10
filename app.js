// Variables básicas usando let
let movimientos = []; // Array para guardar los movimientos

// Función para registrar un nuevo movimiento
function registrarMovimiento() {
    // Obtener valores del formulario
    let nombre = document.getElementById('nombre').value;
    let tipo = document.getElementById('tipo').value;
    let monto = parseFloat(document.getElementById('monto').value);
    
    // Validar los datos básicos
    if (nombre === "") {
        alert("Error: El nombre no puede estar vacío.");
        return;
    }
    
    if (isNaN(monto) || monto <= 0) {
        alert("Error: El monto debe ser un número mayor que cero.");
        return;
    }
    
    // Crear un objeto simple para el movimiento
    let movimiento = {
        nombre: nombre,
        tipo: tipo,
        monto: monto
    };
    
    // Agregar el movimiento al array
    movimientos.push(movimiento);
    
    // Limpiar el formulario
    document.getElementById('nombre').value = "";
    document.getElementById('monto').value = "";
    
    // Actualizar el resumen
    mostrarResumen();
    
    // Habilitar los botones de funciones ahora que hay datos
    document.getElementById('btnListarNombres').disabled = false;
    document.getElementById('btnFiltrarEgresos').disabled = false;
    document.getElementById('btnBuscarMovimiento').disabled = false;
    
    // Mostrar mensaje de éxito
    alert("Movimiento registrado correctamente.");
}

// Función para mostrar el resumen
function mostrarResumen() {
    // Variables para el resumen
    let totalMovimientos = movimientos.length;
    let saldoTotal = 0;
    let totalIngresos = 0;
    let totalEgresos = 0;
    
    // Usar un bucle for para calcular totales
    for (let i = 0; i < movimientos.length; i++) {
        if (movimientos[i].tipo === "ingreso") {
            saldoTotal = saldoTotal + movimientos[i].monto;
            totalIngresos = totalIngresos + movimientos[i].monto;
        } else {
            saldoTotal = saldoTotal - movimientos[i].monto;
            totalEgresos = totalEgresos + movimientos[i].monto;
        }
    }
    
    // Mostrar el resumen en la página
    let resumenDiv = document.getElementById('resumen');
    let resultadoHTML = "";
    resultadoHTML += "<h3>Resumen Final</h3>";
    resultadoHTML += "<p>Total de movimientos: " + totalMovimientos + "</p>";
    resultadoHTML += "<p>Saldo total: $" + saldoTotal.toFixed(2) + "</p>";
    resultadoHTML += "<h4>Desglose por tipo:</h4>";
    resultadoHTML += "<p>- Ingresos: $" + totalIngresos.toFixed(2) + "</p>";
    resultadoHTML += "<p>- Egresos: $" + totalEgresos.toFixed(2) + "</p>";
    
    resumenDiv.innerHTML = resultadoHTML;
}

// HU1 - Listar nombres de movimientos usando map()
function listarNombresMovimientos() {
    // Verificar que haya movimientos
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados.");
        return [];
    }
    
    // Usar map() para obtener solo los nombres de movimientos
    let nombres = movimientos.map(function(movimiento) {
        return movimiento.nombre;
    });
    
    // Mostrar resultado en consola
    console.log("Nombres de movimientos registrados:");
    console.log(nombres);
    
    // Mostrar resultado en la interfaz
    let resultadoDiv = document.getElementById('resultadoOperaciones');
    resultadoDiv.innerHTML = "<h4>Nombres de movimientos registrados:</h4>";
    resultadoDiv.innerHTML += "<p>[" + nombres.join(", ") + "]</p>";
    
    return nombres; // Retornar el resultado para mantener la función pura
}

// HU2 - Filtrar egresos mayores a $100 usando filter()
function filtrarEgresosMayores100() {
    // Verificar que haya movimientos
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados.");
        return [];
    }
    
    // Usar filter() para obtener solo los egresos > $100
    let egresosMayores = movimientos.filter(function(movimiento) {
        return movimiento.tipo === "egreso" && movimiento.monto > 100;
    });
    
    // Mostrar resultado en consola
    console.log("Egresos mayores a $100:");
    console.log(egresosMayores);
    
    // Mostrar resultado en la interfaz
    let resultadoDiv = document.getElementById('resultadoOperaciones');
    resultadoDiv.innerHTML = "<h4>Egresos mayores a $100:</h4>";
    
    if (egresosMayores.length === 0) {
        resultadoDiv.innerHTML += "<p>No se encontraron egresos mayores a $100.</p>";
    } else {
        let listaHTML = "<ul>";
        for (let i = 0; i < egresosMayores.length; i++) {
            listaHTML += "<li>" + egresosMayores[i].nombre + " - $" + egresosMayores[i].monto.toFixed(2) + "</li>";
        }
        listaHTML += "</ul>";
        resultadoDiv.innerHTML += listaHTML;
    }
    
    return egresosMayores; // Retornar el resultado para mantener la función pura
}

// HU3 - Buscar movimiento por nombre usando find()
function buscarMovimientoPorNombre() {
    // Verificar que haya movimientos
    if (movimientos.length === 0) {
        alert("No hay movimientos registrados.");
        return null;
    }
    
    // Pedir al usuario el nombre a buscar
    let nombreBuscado = prompt("Ingrese el nombre del movimiento a buscar:");
    
    if (!nombreBuscado) {
        return null; // El usuario canceló o no ingresó nada
    }
    
    // Usar find() para localizar un movimiento por su nombre
    let movimientoEncontrado = movimientos.find(function(movimiento) {
        return movimiento.nombre === nombreBuscado;
    });
    
    // Mostrar resultado en consola
    console.log("Buscar movimiento por nombre: '" + nombreBuscado + "'");
    
    // Mostrar resultado en la interfaz
    let resultadoDiv = document.getElementById('resultadoOperaciones');
    resultadoDiv.innerHTML = "<h4>Búsqueda por nombre: '" + nombreBuscado + "'</h4>";
    
    if (movimientoEncontrado) {
        console.log("Resultado encontrado:");
        console.log(movimientoEncontrado);
        
        resultadoDiv.innerHTML += "<p>Resultado encontrado:</p>";
        resultadoDiv.innerHTML += "<ul>";
        resultadoDiv.innerHTML += "<li>Nombre: " + movimientoEncontrado.nombre + "</li>";
        resultadoDiv.innerHTML += "<li>Tipo: " + movimientoEncontrado.tipo + "</li>";
        resultadoDiv.innerHTML += "<li>Monto: $" + movimientoEncontrado.monto.toFixed(2) + "</li>";
        resultadoDiv.innerHTML += "</ul>";
    } else {
        console.log("No se encontró ningún movimiento con el nombre: " + nombreBuscado);
        resultadoDiv.innerHTML += "<p>No se encontró ningún movimiento con ese nombre.</p>";
    }
    
    return movimientoEncontrado; // Retornar el resultado para mantener la función pura
}

// Configuración inicial de la página
function inicializar() {
    // Desactivar botones hasta que haya movimientos
    document.getElementById('btnListarNombres').disabled = true;
    document.getElementById('btnFiltrarEgresos').disabled = true;
    document.getElementById('btnBuscarMovimiento').disabled = true;
    
    // Configurar eventos de botones
    document.getElementById('btnRegistrar').addEventListener('click', registrarMovimiento);
    document.getElementById('btnListarNombres').addEventListener('click', listarNombresMovimientos);
    document.getElementById('btnFiltrarEgresos').addEventListener('click', filtrarEgresosMayores100);
    document.getElementById('btnBuscarMovimiento').addEventListener('click', buscarMovimientoPorNombre);
}

// Ejecutar la inicialización cuando se carga la página
window.onload = inicializar;