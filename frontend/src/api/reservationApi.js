import { EstadoOrden, PRECIO_PREVENTA, PRECIO_GENERAL, FECHA_LIMITE_PREVENTA } from '../core/types';

export const getCurrentTicketPrice = () => {
    const today = new Date();
    return today <= FECHA_LIMITE_PREVENTA ? PRECIO_PREVENTA : PRECIO_GENERAL;
};

export const createOrder = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return {
        id: `DANZA2025-${Math.floor(Math.random() * 8999) + 1000}`,
        ...data,
        monto_total: data.cantidad_tickets * getCurrentTicketPrice(),
        estado: EstadoOrden.PENDIENTE
    };
};