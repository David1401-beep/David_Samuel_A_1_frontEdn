import { getClientes, createCliente, updateCliente, deleteCliente } from "../services/clientesService.js";

const tblClientes = document.getElementById("tblClientes");
const frmCliente = document.getElementById("frmCliente");
const idCliente = document.getElementById("idCliente");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtTelefono = document.getElementById("txtTelefono");
const txtEmail = document.getElementById("txtEmail");
const txtDireccion = document.getElementById("txtDireccion");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloForm = document.getElementById("tituloForm");
const alerta = document.getElementById("alerta");

let clientes = [];

document.addEventListener("DOMContentLoaded", loadClientes);

function mostrarAlerta(mensaje, tipo = "success") {
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadClientes() {
    try {
        clientes = (await getClientes()) ?? [];
        tblClientes.innerHTML = "";

        clientes.forEach((cliente) => {
            const fila = tblClientes.insertRow();
            fila.insertCell().textContent = cliente.nombre;
            fila.insertCell().textContent = cliente.apellido;
            fila.insertCell().textContent = cliente.telefono;
            fila.insertCell().textContent = cliente.email;
            fila.insertCell().textContent = cliente.direccion;
            fila.insertCell().innerHTML = `
                <button class="btn btn-warning btn-sm" onclick="addClienteData(${cliente.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removeCliente(${cliente.id})">Eliminar</button>`;
        });
    } catch (error) {
        mostrarAlerta("No se pudieron cargar los clientes: " + error.message, "danger");
    }
}

function validarCliente(cliente, id) {
    if (cliente.nombre === "" || cliente.apellido === "" || cliente.telefono === "") {
        return "Nombre, apellido y teléfono son obligatorios.";
    }
    if (!/^\d{8}$/.test(cliente.telefono)) {
        return "El teléfono debe tener 8 dígitos, solo números.";
    }
    if (cliente.email === "") {
        return "El email es obligatorio.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
        return "El email no tiene un formato válido.";
    }
    if (cliente.direccion === "") {
        return "La dirección es obligatoria.";
    }
    const repetido = clientes.some((c) =>
        String(c.email).toLowerCase() === cliente.email.toLowerCase() && String(c.id) !== id);
    if (repetido) {
        return "Ya existe un cliente con ese email.";
    }
    return "";
}

frmCliente.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = idCliente.value.trim();
    const cliente = {
        nombre: txtNombre.value.trim(),
        apellido: txtApellido.value.trim(),
        telefono: txtTelefono.value.trim(),
        email: txtEmail.value.trim(),
        direccion: txtDireccion.value.trim()
    };

    const error = validarCliente(cliente, id);
    if (error !== "") {
        mostrarAlerta(error, "danger");
        return;
    }

    try {
        if (id !== "") {
            await updateCliente(id, cliente);
            mostrarAlerta("Cliente actualizado correctamente.");
        } else {
            await createCliente(cliente);
            mostrarAlerta("Cliente guardado correctamente.");
        }
        resetForm();
        await loadClientes();
    } catch (error) {
        mostrarAlerta("Ocurrió un error: " + error.message, "danger");
    }
});

function resetForm() {
    frmCliente.reset();
    idCliente.value = "";
    tituloForm.textContent = "Agregar Cliente";
    btnGuardar.textContent = "Guardar Cliente";
    btnCancelar.classList.add("d-none");
}

btnCancelar.addEventListener("click", resetForm);

async function removeCliente(id) {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
        await deleteCliente(id);
        mostrarAlerta("Cliente eliminado correctamente.");
        resetForm();
        await loadClientes();
    } catch (error) {
        mostrarAlerta("No se pudo eliminar: " + error.message, "danger");
    }
}

function addClienteData(id) {
    const cliente = clientes.find((c) => String(c.id) === String(id));
    if (!cliente) return;

    idCliente.value = cliente.id;
    txtNombre.value = cliente.nombre;
    txtApellido.value = cliente.apellido;
    txtTelefono.value = cliente.telefono;
    txtEmail.value = cliente.email;
    txtDireccion.value = cliente.direccion ?? "";
    tituloForm.textContent = "Editar Cliente";
    btnGuardar.textContent = "Actualizar";
    btnCancelar.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

window.removeCliente = removeCliente;
window.addClienteData = addClienteData;
