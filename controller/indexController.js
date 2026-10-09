import { getCliente, createCliente, deleteCliente, getClientes, updateCliente } from "../services/clientesServices.js";

const tblClientes = document.getElementById(tblClientes);
const txtNombre = document.getElementById(txtNombre);
const txtDireccion = document.getElementById(txtDireccion);
const txtApellido= document.getElementById(txtApellido);
const txtCliente = document.getElementById(txtCliente);
const txtEmail = document.getElementById(txtEmail);
const btnCancelar = document.getElementById(btnCancelar);
const btnAggCliente = document.getElementById(btnAggCliente);
const frmAggUsusario = document.getElementById(frmAggUsusario);

document.addEventListener("DOMContentLoaded", async function(){
    await loadClientes();
    try{
        const Clientes = await getClientes();
        tblClientes.innerHTML = "";
        Clientes.foreach((Clientes)=>{
            tblClientes.innerHTML += `
            <tr>
                <td>${Clientes.txtNombre}</td>
                <td>${Clientes.txtApellido}</td>
                <td>${Clientes.txtEmail}</td>
                <td>${Clientes.txtCliente}</td>
                <td>
                <button class = "btn btn-warning btn-sm" onclick = "addClienteData (${Cliente.Clientes})">Editar</button>
                <button class = "btn btn-danger btn-sm" onclick = "removeCliente (${Cliente.Clientes})">Eliminar</button>
                </td>
            </tr>`;
        });
    }
    catch (error){
        alert ("No se puede cargar: "+ error.message);
        throw error;
    }
});

frmAggCliente.addEventListener("submit", async function(event){
        event.preventDefault();
        const id = idCliente.value.trim();
        const Nombre = txtNombre.value.trim();
        const Apellido = txtApellido.value.trim();
        const Cliente = txtCliente.value.trim();
        const Email = txtEmail.value.trim();
        const Direccion = txtDireccion.value.trim();

        if (Nombre === "" || Apellido === "" || Cliente === "" || Email === "" || Direccion === ""){
            alert (`todos los campos son obligatorios`);
            return;
        }
        const Clientes = {
            Nombre: Nombre,
            Apellido: Apellido,
            Cliente: Cliente,
            Email: Email, 
            Direccion: Direccion
        };
        try{
            if(id !== ""){
                await updateCliente(id, Cliente)
                alert ("Actualizado")
            }else{
                await createCliente(Cliente);
                alert("guardado");
            }resetForm();
            await loadClientes();
        }catch (error){
            alert("Ocurrio un error: " + error.message);
        }
});

function resetForm(){
    frmAggUsusario.reset();
    idCliente.value= "";
    btnAggCliente.textContent = "Guardar Entidad";
    btnCancelar.classList.add("d-none");
}

btnCancelar.addEventListener("click", function(event){
    event.preventDefault();
    resetForm();
});

async function removeCliente(id){
    const confirmDelete = confirm("Eliminar?");
    if(!confirmDelete) return;
    try{
        await deleteCliente(id);
        alert ("Eliminada");
        resetForm();
        await loadClientes();
    }catch (error){
        alert (error.message);
    }
}

async function addClienteData(id){
    try{
        const Cliente = await getCliente(id);
        idCliente.value = Cliente.id;
        txtNombre.value = Cliente.Nombre;
        txtApellido.value = Cliente.Apellido;
        txtCliente.value = Cliente.Cliente;
        txtEmail.value = Cliente.Email;
        txtDireccion.value = Cliente.Direccion;
        btnAggCliente.textContent = "Actualizar";
        btnCancelar.classList.remove("d-none");
    }catch (error){
        alert("no se pudo cargar: " + error.message);
    }
}

window.removeCliente = removeCliente;
window.addClienteData = addClienteData;