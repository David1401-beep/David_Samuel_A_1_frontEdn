const API_URL = "http://localhost:8080/api/reservas";

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

export async function getReservas() {
    return peticion(API_URL);
}

export async function createReserva(reserva) {
    return peticion(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
    });
}

export async function updateReserva(id, reserva) {
    return peticion(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
    });
}

export async function deleteReserva(id) {
    return peticion(`${API_URL}/${id}`, { method: "DELETE" });
}
