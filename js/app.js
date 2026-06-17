// Funcion para mostrar una pantalla y ocultar las demas
function mostrarPantalla(idPantalla) {
    const pantallas = document.querySelectorAll(".pantalla");

    pantallas.forEach(function(pantalla) {
        pantalla.classList.remove("activa");
    });

    document.getElementById(idPantalla).classList.add("activa");
}

// Capturamos los botones principales
const btnHacerReserva = document.getElementById("btnHacerReserva");
const btnAccesoAdmin = document.getElementById("btnAccesoAdmin");

const btnVolverInicio1 = document.getElementById("btnVolverInicio1");
const btnVolverInicio2 = document.getElementById("btnVolverInicio2");
const btnVolverInicio3 = document.getElementById("btnVolverInicio3");

const btnVerListaReservas = document.getElementById("btnVerListaReservas");
const btnVolverDashboard = document.getElementById("btnVolverDashboard");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const buscarReserva = document.getElementById("buscarReserva");
let idReservaEditando = null; 

// Eventos de navegacion
btnHacerReserva.addEventListener("click", function() {
    mostrarPantalla("pantallaFormulario");
});

btnAccesoAdmin.addEventListener("click", function() {
    mostrarPantalla("pantallaLogin");
});

btnVolverInicio1.addEventListener("click", function() {
    mostrarPantalla("pantallaInicio");
});

btnVolverInicio2.addEventListener("click", function() {
    mostrarPantalla("pantallaInicio");
});

btnVolverInicio3.addEventListener("click", function() {
    mostrarPantalla("pantallaInicio");
});

btnVerListaReservas.addEventListener("click", function() {
    mostrarListaReservas();
    mostrarPantalla("pantallaLista");
});
buscarReserva.addEventListener("input", function() {
    mostrarListaReservas(buscarReserva.value);
});

btnVolverDashboard.addEventListener("click", function() {
    mostrarPantalla("pantallaDashboard");
});

btnCerrarSesion.addEventListener("click", function() {
    mostrarPantalla("pantallaInicio");
});

const formReserva = document.getElementById("formReserva");

formReserva.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombreCliente = document.getElementById("nombreCliente").value;
    const fechaReserva = document.getElementById("fechaReserva").value;
    const horaReserva = document.getElementById("horaReserva").value;
    const cantidadPersonas = parseInt(document.getElementById("cantidadPersonas").value);
    const idMesa = parseInt(document.getElementById("mesaReserva").value);

    if (idReservaEditando !== null) {
       actualizarReservaPorId(
           idReservaEditando,
           fechaReserva,
           horaReserva,
           cantidadPersonas,
           idMesa
        );

        idReservaEditando = null;
        document.querySelector("#formReserva button[type='submit']").textContent = "Confirmar Reserva";

        formReserva.reset();
        actualizarDashboard();
        mostrarListaReservas(buscarReserva.value);
        mostrarPantalla("pantallaLista");

        return;
    }



    const resultado = registrarReserva(
        nombreCliente,
        fechaReserva,
        horaReserva,
        cantidadPersonas,
        idMesa
    );

    if (resultado.estado === false) {
        document.getElementById("mensajeReserva").textContent = resultado.mensaje;
        return;
    }

    const mesa = obtenerMesaPorId(resultado.reserva.id_mesa);

    document.getElementById("confNombre").textContent = "👤 " + resultado.cliente.nombre;
    document.getElementById("confFecha").textContent = "📅 " + resultado.reserva.fecha_reserva;
    document.getElementById("confHora").textContent = "🕒 " + resultado.reserva.hora_reserva;
    document.getElementById("confPersonas").textContent = "👥 " + resultado.reserva.cantidad_personas + " personas";
    document.getElementById("confMesa").textContent = "🍽️ Mesa " + mesa.numero_mesa;

    formReserva.reset();
    document.getElementById("mensajeReserva").textContent = "";

    actualizarDashboard();
    mostrarPantalla("pantallaConfirmacion");
});


const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const usuario = document.getElementById("usuarioAdmin").value;
    const password = document.getElementById("passwordAdmin").value;

    if (usuario === "admin@reservaya.com" && password === "admin123") {
        document.getElementById("mensajeLogin").textContent = "";
        formLogin.reset();
        actualizarDashboard();
        mostrarPantalla("pantallaDashboard");
    } else {
        document.getElementById("mensajeLogin").textContent = "Usuario o contraseña incorrectos.";
    }
});

function actualizarDashboard() {
    const reservasHoy = obtenerReservasHoy();
    const mesasOcupadasHoy = obtenerMesasOcupadasHoy();
    const proximasReservas = obtenerProximasReservas();

    document.getElementById("totalReservasHoy").textContent = reservasHoy.length;
    document.getElementById("totalMesasOcupadas").textContent = mesasOcupadasHoy;

    const contenedorProximas = document.getElementById("proximasReservas");
    contenedorProximas.innerHTML = "";

    if (proximasReservas.length === 0) {
        contenedorProximas.innerHTML = "<p>No hay próximas reservas.</p>";
        return;
    }

    proximasReservas.forEach(function(reserva) {
        const cliente = obtenerClientePorId(reserva.id_cliente);
        const mesa = obtenerMesaPorId(reserva.id_mesa);

        const item = document.createElement("div");
        item.classList.add("item-reserva");

        item.innerHTML = `
            <h4>${cliente.nombre}</h4>
            <p>${reserva.hora_reserva} - Mesa ${mesa.numero_mesa} - ${reserva.cantidad_personas} personas</p>
        `;

        contenedorProximas.appendChild(item);
    });
}

function mostrarListaReservas(filtro = "") {
    const contenedorLista = document.getElementById("listaReservas");
    contenedorLista.innerHTML = "";

    const textoFiltro = filtro.toLowerCase();

    const reservasFiltradas = reservas.filter(function(reserva) {
        const cliente = obtenerClientePorId(reserva.id_cliente);
        const mesa = obtenerMesaPorId(reserva.id_mesa);
        const estado = obtenerEstadoPorId(reserva.id_estado);

        return (
            cliente.nombre.toLowerCase().includes(textoFiltro) ||
            reserva.fecha_reserva.includes(textoFiltro) ||
            String(mesa.numero_mesa).includes(textoFiltro) ||
            estado.nombre_estado.toLowerCase().includes(textoFiltro)
        );
    });

    if (reservasFiltradas.length === 0) {
        contenedorLista.innerHTML = "<p>No se encontraron reservas.</p>";
        return;
    }

    reservasFiltradas.forEach(function(reserva) {
        const cliente = obtenerClientePorId(reserva.id_cliente);
        const mesa = obtenerMesaPorId(reserva.id_mesa);
        const estado = obtenerEstadoPorId(reserva.id_estado);

        const item = document.createElement("div");
        item.classList.add("item-reserva");

        item.innerHTML = `
            <h4>${cliente.nombre}</h4>
            <p>Fecha: ${reserva.fecha_reserva}</p>
            <p>Hora: ${reserva.hora_reserva}</p>
            <p>Mesa: ${mesa.numero_mesa}</p>
            <p>Personas: ${reserva.cantidad_personas}</p>
            <p>Estado: ${estado.nombre_estado}</p>

            <div class="acciones-reserva">
                <button class="btn-editar" onclick="editarReserva(${reserva.id_reserva})">
                    Editar 
                </button>
                <button class="btn-eliminar" onclick="eliminarReserva(${reserva.id_reserva})">
                    Eliminar
                </button>
            </div>
        
        `;

        contenedorLista.appendChild(item);
    });
}

function eliminarReserva(idReserva) { 
    const confirmar =confirm("¿Estas seguro de eliminar esta reserva?"); 

    if (confirmar === false) {
        return;
    }

    eliminarReservaPorId(idReserva);
    mostrarListaReservas(buscarReserva.value);
    actualizarDashboard();

    alert("Reserva eliminada correctamente...");
}

function editarReserva(idReserva) { 
    const reserva = obtenerReservaPorId(idReserva);
    const cliente = obtenerClientePorId(reserva.id_cliente);

    idReservaEditando = idReserva; 

    document.getElementById("nombreCliente").value = cliente.nombre; 
    document.getElementById("fechaReserva").value = reserva.fecha_reserva; 
    document.getElementById("horaReserva").value = reserva.hora_reserva;
    document.getElementById("cantidadPersonas").value = reserva.cantidad_personas;
    document.getElementById("mesaReserva").value = reserva.id_mesa;

    document.querySelector("#formReserva button[type= 'submit']").textContent = "Actualizar Reserva";

    mostrarPantalla("pantallaFormulario"); 
}



window.addEventListener("load", function() {
    cargarDatosJSON();
});