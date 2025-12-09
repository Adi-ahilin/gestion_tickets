import { EstadoOrden, PRECIO_PREVENTA, PRECIO_GENERAL, FECHA_LIMITE_PREVENTA } from '../core/types';

/**
 * Determina el precio del ticket basado en la fecha actual.
 * Compara contra la fecha límite de preventa definida en types.js.
 */
export const getCurrentTicketPrice = () => {
    const today = new Date();
    // Si la fecha actual es menor o igual a la fecha límite, aplica preventa
    return today <= FECHA_LIMITE_PREVENTA ? PRECIO_PREVENTA : PRECIO_GENERAL;
};

/**
 * Simula la creación de una orden en el backend.
 * Recibe los datos del formulario, calcula el total y retorna la orden creada.
 */
export const createOrder = async (data) => {
    // Simula una pequeña demora de red (800ms) para dar realismo a la UI
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    // Calcula monto final asegurando que el precio sea el del servidor (simulado)
    const precioUnitario = getCurrentTicketPrice();
    const monto = data.cantidad_tickets * precioUnitario;

    // Construye el objeto de la orden
    return {
        id: `DANZA2025-${Math.floor(Math.random() * 8999) + 1000}`, // Genera ID tipo DANZA2025-XXXX
        ...data, // nombre, email, cantidad_tickets, metodo_pago
        monto_total: monto,
        estado: EstadoOrden.PENDIENTE,
        fecha_creacion: new Date()
    };
};