let mesCalendario = new Date().getMonth();
let anioCalendario = new Date().getFullYear();

const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Funcion para crear un calendario simple con las reservas registradas
function generarCalendario() {
    const contenedorCalendario = document.getElementById("calendario");
    const tituloCalendario = document.getElementById("tituloCalendario");

    contenedorCalendario.innerHTML = "";
    tituloCalendario.textContent = nombresMeses[mesCalendario] + " " + anioCalendario;

    const ultimoDiaMes = new Date(anioCalendario, mesCalendario + 1, 0);
    const cantidadDias = ultimoDiaMes.getDate();

    for (let dia = 1; dia <= cantidadDias; dia++) {
        const fechaTexto = anioCalendario + "-" +
            String(mesCalendario + 1).padStart(2, "0") + "-" +
            String(dia).padStart(2, "0");

        const reservasDelDia = reservas.filter(function(reserva) {
            return reserva.fecha_reserva === fechaTexto;
        });

        const celdaDia = document.createElement("div");
        celdaDia.classList.add("dia-calendario");

        let contenido = `<strong>${dia}</strong>`;

        reservasDelDia.forEach(function(reserva) {
            const cliente = obtenerClientePorId(reserva.id_cliente);
            const mesa = obtenerMesaPorId(reserva.id_mesa);

            contenido += `
                <span class="reserva-dia">
                    ${reserva.hora_reserva} - ${cliente.nombre} - M${mesa.numero_mesa}
                </span>
            `;
        });

        celdaDia.innerHTML = contenido;
        contenedorCalendario.appendChild(celdaDia);
    }
}

// Funcion para ir al mes anterior
function irMesAnterior() {
    mesCalendario--;

    if (mesCalendario < 0) {
        mesCalendario = 11;
        anioCalendario--;
    }

    generarCalendario();
}

// Funcion para ir al mes siguiente
function irMesSiguiente() {
    mesCalendario++;

    if (mesCalendario > 11) {
        mesCalendario = 0;
        anioCalendario++;
    }

    generarCalendario();
}