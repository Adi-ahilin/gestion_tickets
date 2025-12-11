// Archivo: src/api/reservationApi.js
import { PRECIO_PREVENTA, PRECIO_GENERAL, FECHA_LIMITE_PREVENTA, EstadoOrden } from '../core/types';

// URL base de tu backend Django
const API_URL = 'http://localhost:8000/api'; 

export const getCurrentTicketPrice = () => {
    const today = new Date();
    return today <= FECHA_LIMITE_PREVENTA ? PRECIO_PREVENTA : PRECIO_GENERAL;
};

/**
 * Función corregida para manejar la simulación asíncrona y devolver todos los datos.
 */
export const createOrder = async (data) => {
    // Simula demora de red
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    const precioUnitario = getCurrentTicketPrice();
    // CRUCIAL: Usamos data.cantidad, no data.cantidad_tickets
    const monto = data.cantidad * precioUnitario; 

    // Se devuelven todos los datos del formulario, esenciales para el resumen final.
    return {
        id: `DANZA2025-${Math.floor(Math.random() * 8999) + 1000}`,
        nombre: data.nombre,
        email: data.email,
        cantidad: data.cantidad,
        metodo: data.metodo,
        monto_total: monto, // Ahora 'monto' es un número válido
        estado: EstadoOrden.PENDIENTE,
        fecha_creacion: new Date()
    };
};

