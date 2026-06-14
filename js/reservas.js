// Variables globales para guardar la informacion del JSON
let clientes = [];
let mesas = [];
let estadosReserva = [];
let reservas = [];

// Funcion para cargar los datos desde el archivo JSON
async function cargarDatosJSON() {
    try {
        const respuesta = await fetch("data/reservas.json");
        const datos = await respuesta.json();

        clientes = datos.clientes;
        mesas = datos.mesas;
        estadosReserva = datos.estados_reserva;
        reservas = datos.reservas;

        cargarMesasEnFormulario();
        console.log("Datos cargados correctamente:", datos);
    } catch (error) {
        console.error("Error al cargar el JSON:", error);
    }
}

// Funcion para llenar el select de mesas
function cargarMesasEnFormulario() {
    const selectMesa = document.getElementById("mesaReserva");

    selectMesa.innerHTML = '<option value="">Mesa 1, 2, 3...</option>';

    mesas.forEach(function(mesa) {
        const opcion = document.createElement("option");
        opcion.value = mesa.id_mesa;
        opcion.textContent = "Mesa " + mesa.numero_mesa + " - " + mesa.capacidad + " personas";
        selectMesa.appendChild(opcion);
    });
}

// Funcion para buscar un cliente por su ID
function obtenerClientePorId(idCliente) {
    return clientes.find(function(cliente) {
        return cliente.id_cliente === idCliente;
    });
}

// Funcion para buscar una mesa por su ID
function obtenerMesaPorId(idMesa) {
    return mesas.find(function(mesa) {
        return mesa.id_mesa === idMesa;
    });
}

// Funcion para buscar un estado por su ID
function obtenerEstadoPorId(idEstado) {
    return estadosReserva.find(function(estado) {
        return estado.id_estado === idEstado;
    });
}

// Funcion para registrar una nueva reserva
function registrarReserva(nombreCliente, fecha, hora, cantidadPersonas, idMesa) {
    // Validar si ya existe una reserva para la misma mesa, fecha y hora
    const existeReserva = reservas.some(function(reserva) {
        return reserva.id_mesa === idMesa &&
               reserva.fecha_reserva === fecha &&
               reserva.hora_reserva === hora;
    });

    if (existeReserva) {
        return {
            estado: false,
            mensaje: "La mesa ya esta reservada en esa fecha y hora."
        };
    }

    // Crear nuevo cliente
    const nuevoCliente = {
        id_cliente: clientes.length + 1,
        nombre: nombreCliente,
        telefono: "",
        correo: ""
    };

    clientes.push(nuevoCliente);

    // Crear nueva reserva
    const nuevaReserva = {
        id_reserva: reservas.length + 1,
        id_cliente: nuevoCliente.id_cliente,
        id_mesa: idMesa,
        id_estado: 2,
        fecha_reserva: fecha,
        hora_reserva: hora,
        cantidad_personas: cantidadPersonas
    };

    reservas.push(nuevaReserva);

    return {
        estado: true,
        mensaje: "Reserva registrada correctamente.",
        reserva: nuevaReserva,
        cliente: nuevoCliente
    };
}

