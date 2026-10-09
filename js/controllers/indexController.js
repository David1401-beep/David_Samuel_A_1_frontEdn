import { getClientes } from "../services/clientesService.js";
import { getVehiculos } from "../services/vehiculosService.js";
import { getReservas, createReserva, updateReserva, deleteReserva } from "../services/reservasService.js";

const ESTADOS = ["PENDIENTE", "CONFIRMADA", "CANCELADA", "FINALIZADA"];

const tblReservas = document.getElementById("tblReservas");
const frmReserva = document.getElementById("frmReserva");
const idReserva = document.getElementById("idReserva");
const cmbCliente = document.getElementById("cmbCliente");
const cmbVehiculo = document.getElementById("cmbVehiculo");
const txtNombreReserva = document.getElementById("txtNombreReserva");
const txtFecha = document.getElementById("txtFecha");
const txtPasajeros = document.getElementById("txtPasajeros");
const txtDias = document.getElementById("txtDias");
const lblTotal = document.getElementById("lblTotal");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloForm = document.getElementById("tituloForm");
const alerta = document.getElementById("alerta");

let clientes = [];
let vehiculos = [];
let reservas = [];

document.addEventListener("DOMContentLoaded", async function () {
    await loadSelects();
    await loadReservas();
});

function mostrarAlerta(mensaje, tipo = "success") {
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function clienteDe(reserva) {
    return reserva.cliente ?? clientes.find((c) => String(c.id) === String(reserva.idCliente));
}

function vehiculoDe(reserva) {
    return reserva.vehiculo ?? vehiculos.find((v) => String(v.id) === String(reserva.idVehiculo));
}

function textoVehiculo(vehiculo) {
    if (!vehiculo) return "";
    return [vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" ") || `Vehículo ${vehiculo.id}`;
}

function fechaDe(reserva) {
    return String(reserva.fechaReserva ?? "").substring(0, 10);
}

async function loadSelects() {
    try {
        clientes = (await getClientes()) ?? [];
        vehiculos = (await getVehiculos()) ?? [];

        clientes.forEach((cliente) => {
            cmbCliente.add(new Option(`${cliente.nombre} ${cliente.apellido}`, cliente.id));
        });
        vehiculos.forEach((vehiculo) => {
            cmbVehiculo.add(new Option(`${textoVehiculo(vehiculo)} (capacidad: ${vehiculo.capacidad})`, vehiculo.id));
        });
    } catch (error) {
        mostrarAlerta("No se pudieron cargar clientes y vehículos: " + error.message, "danger");
    }
}

async function loadReservas() {
    try {
        reservas = (await getReservas()) ?? [];
        tblReservas.innerHTML = "";

        reservas.forEach((reserva) => {
            const cliente = clienteDe(reserva);
            const opciones = ESTADOS.map((estado) =>
                `<option ${estado === reserva.estado ? "selected" : ""}>${estado}</option>`).join("");

            const fila = tblReservas.insertRow();
            fila.insertCell().textContent = reserva.nombreReserva;
            fila.insertCell().textContent = cliente ? `${cliente.nombre} ${cliente.apellido}` : "";
            fila.insertCell().textContent = textoVehiculo(vehiculoDe(reserva));
            fila.insertCell().textContent = fechaDe(reserva);
            fila.insertCell().textContent = reserva.cantidadPasajeros;
            fila.insertCell().textContent = reserva.cantidadDias;
            fila.insertCell().textContent = `$${Number(reserva.totalPago ?? 0).toFixed(2)}`;
            fila.insertCell().innerHTML = `
                <select class="form-select form-select-sm" onchange="changeEstado(${reserva.id}, this.value)">${opciones}</select>`;
            fila.insertCell().innerHTML = `
                <button class="btn btn-warning btn-sm" onclick="addReservaData(${reserva.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removeReserva(${reserva.id})">Eliminar</button>`;
        });
    } catch (error) {
        mostrarAlerta("No se pudieron cargar las reservas: " + error.message, "danger");
    }
}

function calcularTotal() {
    const vehiculo = vehiculos.find((v) => String(v.id) === cmbVehiculo.value);
    const dias = Number(txtDias.value);
    const total = vehiculo && dias > 0 ? Number(vehiculo.precioDia) * dias : 0;
    lblTotal.textContent = `$${total.toFixed(2)}`;
    return total;
}

cmbVehiculo.addEventListener("change", calcularTotal);
txtDias.addEventListener("input", calcularTotal);

function validarReserva(reserva) {
    if (!reserva.idCliente) return "Selecciona un cliente.";
    if (!reserva.idVehiculo) return "Selecciona un vehículo.";
    if (reserva.nombreReserva === "") return "El nombre de la reserva es obligatorio.";
    if (reserva.fechaReserva === "") return "La fecha de reserva es obligatoria.";
    if (!Number.isInteger(reserva.cantidadPasajeros) || reserva.cantidadPasajeros < 1) {
        return "La cantidad de pasajeros debe ser un número mayor a 0.";
    }
    if (!Number.isInteger(reserva.cantidadDias) || reserva.cantidadDias < 1) {
        return "La cantidad de días debe ser un número mayor a 0.";
    }
    return "";
}

frmReserva.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = idReserva.value.trim();
    const reserva = {
        idCliente: Number(cmbCliente.value),
        idVehiculo: Number(cmbVehiculo.value),
        nombreReserva: txtNombreReserva.value.trim(),
        fechaReserva: txtFecha.value,
        cantidadPasajeros: Number(txtPasajeros.value),
        cantidadDias: Number(txtDias.value),
        totalPago: calcularTotal()
    };

    const error = validarReserva(reserva);
    if (error !== "") {
        mostrarAlerta(error, "danger");
        return;
    }

    try {
        if (id !== "") {
            const actual = reservas.find((r) => String(r.id) === id);
            reserva.estado = actual.estado;
            await updateReserva(id, reserva);
            mostrarAlerta("Reserva actualizada correctamente.");
        } else {
            await createReserva(reserva);
            mostrarAlerta("Reserva registrada correctamente.");
        }
        resetForm();
        await loadReservas();
    } catch (error) {
        mostrarAlerta("Ocurrió un error: " + error.message, "danger");
    }
});

function resetForm() {
    frmReserva.reset();
    idReserva.value = "";
    tituloForm.textContent = "Nueva Reserva";
    btnGuardar.textContent = "Guardar Reserva";
    btnCancelar.classList.add("d-none");
    calcularTotal();
}

btnCancelar.addEventListener("click", resetForm);

async function changeEstado(id, estado) {
    const reserva = reservas.find((r) => String(r.id) === String(id));
    if (!reserva) return;

    try {
        await updateReserva(id, {
            idCliente: reserva.idCliente ?? reserva.cliente?.id,
            idVehiculo: reserva.idVehiculo ?? reserva.vehiculo?.id,
            nombreReserva: reserva.nombreReserva,
            fechaReserva: fechaDe(reserva),
            cantidadPasajeros: reserva.cantidadPasajeros,
            cantidadDias: reserva.cantidadDias,
            totalPago: reserva.totalPago,
            estado: estado
        });
        mostrarAlerta(`Estado cambiado a ${estado}.`);
    } catch (error) {
        mostrarAlerta("No se pudo cambiar el estado: " + error.message, "danger");
    }
    await loadReservas();
}

async function removeReserva(id) {
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
        await deleteReserva(id);
        mostrarAlerta("Reserva eliminada correctamente.");
        resetForm();
        await loadReservas();
    } catch (error) {
        mostrarAlerta("No se pudo eliminar: " + error.message, "danger");
    }
}

function addReservaData(id) {
    const reserva = reservas.find((r) => String(r.id) === String(id));
    if (!reserva) return;

    idReserva.value = reserva.id;
    cmbCliente.value = reserva.idCliente ?? reserva.cliente?.id ?? "";
    cmbVehiculo.value = reserva.idVehiculo ?? reserva.vehiculo?.id ?? "";
    txtNombreReserva.value = reserva.nombreReserva;
    txtFecha.value = fechaDe(reserva);
    txtPasajeros.value = reserva.cantidadPasajeros;
    txtDias.value = reserva.cantidadDias;
    calcularTotal();
    tituloForm.textContent = "Editar Reserva";
    btnGuardar.textContent = "Actualizar";
    btnCancelar.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.changeEstado = changeEstado;
window.removeReserva = removeReserva;
window.addReservaData = addReservaData;
