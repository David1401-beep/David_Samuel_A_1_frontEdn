const API_URL = "http://localhost:8080/api/Clientes"

export async function getClientes(){
    try{
        const answer = await fetch (API_URL);
        const result = await answer.json();
        if(!answer.ok) throw new Error(result.message);
        return result.data;
    }catch (error){
        console.error("Error en getClientes: ", error);
        throw error;
    }
}

export async function createCliente(Clientes){
    try{
        const answer = await fetch(API_URL, {
            method: 'POST',
            headers: {
                "content-type" : "application/json"
            }, body: JSON.stringify(Clientes)
        });
        const result = await answer.json();
        if(!answer.ok) throw new Error(result.message);
        return result.data;
    }catch(error){
        console.error("Error en createClientes: ", error);
        throw error;
    }
}

export async function deleteCliente(id){
    try{
        const answer = await fetch('${API_URL}/${id}', {
            method: 'DELETE',
        });
        if(!answer.ok){
            const result = await answer.json();
            throw new Error (result.message);
        }return true;
    }catch(error){
        console.error("Error en deleteClientes: ", error);
        throw error;
    }
}

export async function getCliente(id){
    try{
        const answer = await fetch ('${API_URL}/${id}');
        const result = await answer.json();
        if(!answer.ok) throw new Error(result.message);
        return result.data;
    }catch (error){
        console.error("Error en getCliente: ", error);
        throw error;
    }
}

export async function updateCliente(Clientes){
    try{
        const answer = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                "content-type" : "application/json"
            }, body: JSON.stringify(Clientes)
        });
        const result = await answer.json();
        if(!answer.ok) throw new Error(result.message);
        return result.data;
    }catch(error){
        console.error("Error en updateCliente: ", error);
        throw error;
    }
}