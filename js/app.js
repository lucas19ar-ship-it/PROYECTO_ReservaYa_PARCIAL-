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
    mostrarPantalla("pantallaLista");
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

    mostrarPantalla("pantallaConfirmacion");
});

window.addEventListener("load", function() {
    cargarDatosJSON();
});