// Variables globales para guardar la informacion del JSON
let clientes = [];
let mesas = [];
let estadosReserva = [];
let reservas = [];

const CLAVE_DATOS = "reservaya_datos"; 

// Funcion para cargar los datos desde el archivo JSON
async function cargarDatosJSON() {
    try {
        const datosLocales = cargarDatosLocalStorage();

        if (datosLocales !== null) {
            clientes = datosLocales.clientes;
            mesas = datosLocales.mesas;
            estadosReserva = datosLocales.estados_reserva;
            reservas = datosLocales.reservas;

            cargarMesasEnFormulario();
            console.log("Datos cargados desde localStorage:", datosLocales);
            return;
        
        }

        const respuesta = await fetch("data/reservas.json");
        const datos = await respuesta.json(); 

        clientes = datos.clientes; 
        mesas = datos.mesas;
        estadosReserva = datos.estados_reserva;
        reservas = datos.reservas; 

        guardarDatosLocalStorage();
        cargarMesasEnFormulario();

        console.log("Datos cargados desde JSON:", datos);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
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
    guardarDatosLocalStorage();

    return {
        estado: true,
        mensaje: "Reserva registrada correctamente.",
        reserva: nuevaReserva,
        cliente: nuevoCliente
    };
}

// Funcion para obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;
}

// Funcion para obtener las reservas de hoy
function obtenerReservasHoy() {
    const fechaActual = obtenerFechaActual();

    return reservas.filter(function(reserva) {
        return reserva.fecha_reserva === fechaActual;
    });
}

// Funcion para obtener la cantidad de mesas ocupadas hoy
function obtenerMesasOcupadasHoy() {
    const reservasHoy = obtenerReservasHoy();
    const mesasOcupadas = [];

    reservasHoy.forEach(function(reserva) {
        if (!mesasOcupadas.includes(reserva.id_mesa)) {
            mesasOcupadas.push(reserva.id_mesa);
        }
    });

    return mesasOcupadas.length;
}

// Funcion para obtener proximas reservas
function obtenerProximasReservas() {
    const fechaActual = obtenerFechaActual();

    return reservas.filter(function(reserva) {
        return reserva.fecha_reserva >= fechaActual;
    });
}

// Función para eliminar una reserva por ID
function eliminarReservaPorId(idReserva) {
    reservas = reservas.filter(function(reserva) {
        return reserva.id_reserva !== idReserva;
    });

    guardarDatosLocalStorage();
}

// Función para obtener una reserva por ID
function obtenerReservaPorId(idReserva) {
    return reservas.find(function(reserva) {
        return reserva.id_reserva === idReserva;
    });
}

// Función para actualizar una reserva existente 
function actualizarReservaPorId(idReserva, fecha, hora, cantidadPersonas, idMesa) {
    reservas.forEach(function(reserva) {
        if (reserva.id_reserva === idReserva) {
            reserva.fecha_reserva = fecha;
            reserva.hora_reserva = hora;
            reserva.cantidad_personas = cantidadPersonas;
            reserva.id_mesa = idMesa;
        }
    });

    guardarDatosLocalStorage();
}

// Función para guardar los datos en LocalStorage 
function guardarDatosLocalStorage (){
    const datos = {
        clientes: clientes,
        mesas: mesas,
        estados_reserva: estadosReserva,
        reservas: reservas
    };

    localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
}

// Función para cargar datos guardados en LocalStorage
function cargarDatosLocalStorage() { 
    const datosGuardados = localStorage.getItem(CLAVE_DATOS); 

    if (datosGuardados === null) {
        return null;

    }

    return JSON.parse(datosGuardados); 
}
