// Archivo: src/api/reservationApi.js
import { PRECIO_PREVENTA, PRECIO_GENERAL, FECHA_LIMITE_PREVENTA } from '../core/types';

// URL base de tu backend Django
const API_URL = 'http://localhost:8000/api'; 

export const getCurrentTicketPrice = () => {
    const today = new Date();
    return today <= FECHA_LIMITE_PREVENTA ? PRECIO_PREVENTA : PRECIO_GENERAL;
};

export const createOrder = async (data) => {
    console.log("🚀 Iniciando creación de orden...", data);

    try {
        // 1. ADAPTACIÓN DE DATOS (Frontend -> Backend)
        // Django pide nombre y apellido separados, pero el form solo da uno.
        const nombreCompleto = data.nombre.split(" ");
        const nombre = nombreCompleto[0];
        const apellido = nombreCompleto.slice(1).join(" ") || "SinApellido";

        // Preparamos el paquete exacto que pide tu views.py
        const paqueteParaDjango = {
            nombre: nombre,
            apellido: apellido,
            email: data.email,
            telefono: "00000000", // Valor por defecto porque el form no pide teléfono
            cantidad: parseInt(data.cantidad) // Django pide 'cantidad', React tenía 'cantidad' (antes era cantidad_tickets en versiones previas, pero el componente actual usa 'cantidad')
        };

        console.log("📦 Enviando a Django:", paqueteParaDjango);

        // 2. LLAMADA AL SERVIDOR
        // Usamos '/reservar/' porque así está definido en tu urls.py
        const response = await fetch(`${API_URL}/reservar/`, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(paqueteParaDjango)
        });

        // 3. MANEJO DE ERRORES ROBUSTO
        if (!response.ok) {

            
            const textBody = await response.text(); 
            let errorData;
            try {
                errorData = JSON.parse(textBody);
            } catch (e) {
                errorData = { detail: textBody };
            }
            console.error("❌ Error del servidor:", errorData);
            throw new Error(JSON.stringify(errorData));
        }

        const result = await response.json();
        console.log("✅ Éxito:", result);
        
        // Adaptamos la respuesta del backend para que el frontend la entienda
        // El frontend espera 'monto_total' y 'id', asegúrate de que 'result' los tenga o adáptalos aquí.
        return {
            ...result,
            // Si el backend devuelve 'monto_total', úsalo, sino calcúlalo o usa un valor por defecto si es necesario para la vista
            monto_total: result.monto_total || (paqueteParaDjango.cantidad * getCurrentTicketPrice())
        };

    } catch (error) {
        console.error("💥 Error en createOrder:", error);
        throw error;
    }
};