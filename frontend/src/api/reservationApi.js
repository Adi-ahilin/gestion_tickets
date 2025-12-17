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
        
        const paqueteParaDjango = {
            nombre: data.nombre,       // Usamos el nombre real
            apellido: data.apellido,   // Usamos el apellido real
            email: data.email,
            telefono: data.telefono,      // Valor por defecto
            cantidad: parseInt(data.cantidad)
        };
        // -----------------------

        console.log("📦 Enviando a Django:", paqueteParaDjango);

        // 2. PETICIÓN POST AL BACKEND
        const response = await fetch(`${API_URL}/reservar/`, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(paqueteParaDjango)
        });

        // 3. MANEJO DE ERRORES
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
        
        return {
            ...result,
            monto_total: result.monto_total || (paqueteParaDjango.cantidad * getCurrentTicketPrice())
        };

    } catch (error) {
        console.error("🚨 Error en createOrder:", error);
        throw error;
    }
};