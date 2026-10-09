const API_URL = "http://localhost:8080/api/vehiculos";

async function peticion(url, opciones) {
    let answer;
    try {
        answer = await fetch(url, opciones);
    } catch (error) {
        throw new Error("No se pudo conectar con el servidor.");
    }

    const texto = await answer.text();
    let result = null;
    try {
        result = texto ? JSON.parse(texto) : null;
    } catch (error) {
        result = texto;
    }

    if (!answer.ok) {
        const mensaje = typeof result === "string"
            ? result
            : result?.message || result?.mensaje || result?.error;
        throw new Error(mensaje || "Ocurrió un error en la petición.");
    }

    return result?.data ?? result;
}

export async function getVehiculos() {
    return peticion(API_URL);
}
