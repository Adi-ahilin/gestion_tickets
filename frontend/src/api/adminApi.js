// Archivo: src/api/adminApi.js

const API_URL = 'http://localhost:8000/api';

// --------------------------------------------------
// OBTENER TODAS LAS ÓRDENES
// --------------------------------------------------
export const getAllOrders = async () => {
    try {
        const response = await fetch(`${API_URL}/ordenes/`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener órdenes');
        }

        const data = await response.json();
        console.log('📦 Órdenes recibidas desde Django:', data);

        return data.map(orden => ({
            id: orden.id,

            // Comprador anidado (serializer.py confirmado)
            comprador: orden.comprador
                ? `${orden.comprador.nombre} ${orden.comprador.apellido}`
                : 'Cliente Web',

            email: orden.comprador?.email ?? 'Sin Email',

            // Cantidad real de tickets
            cantidad_tickets: Array.isArray(orden.tickets)
                ? orden.tickets.length
                : 0,

            monto_total: Number(orden.total ?? 0),

            estado: orden.estado,
            fecha_creacion: orden.fecha_creacion
        }));
    } catch (error) {
        console.error('❌ Error cargando órdenes:', error);
        return [];
    }
};

// --------------------------------------------------
// CONFIRMAR PAGO DE UNA ORDEN
// --------------------------------------------------
export const confirmPayment = async (orderId) => {
    try {
        const response = await fetch(
            `${API_URL}/ordenes/${orderId}/confirmar/`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Error al confirmar pago');
        }

        return true;
    } catch (error) {
        console.error('❌ Error confirmando pago:', error);
        return false;
    }
};

// --------------------------------------------------
// ESTADÍSTICAS DEL DASHBOARD
// --------------------------------------------------
export const getDashboardStats = async () => {
    const orders = await getAllOrders();

    const TOTAL_CAPACIDAD = 250;

    let vendidas = 0;
    let pendientes = 0;
    let ingresos = 0;
    let ticketsOcupados = 0;

    orders.forEach(order => {
        if (order.estado === 'CONFIRMADA') {
            vendidas++;
            ticketsOcupados += order.cantidad_tickets;
            ingresos += order.monto_total;
        } else {
            pendientes++;
        }
    });

    return {
        vendidas,
        pendientes,
        disponibles: TOTAL_CAPACIDAD - ticketsOcupados,
        ingresos
    };
};

// --------------------------------------------------
// BUSCADOR DE ÓRDENES
// --------------------------------------------------
export const findOrders = async (query) => {
    const orders = await getAllOrders();

    if (!query) return orders;

    const lowerQuery = query.toLowerCase();

    return orders.filter(order =>
        String(order.id).toLowerCase().includes(lowerQuery) ||
        String(order.email).toLowerCase().includes(lowerQuery)
    );
};

// --------------------------------------------------
// PLACEHOLDER (EVITA ERRORES EN OTRAS VISTAS)
// --------------------------------------------------
export const validateTicketSimulated = async (type) => {
    const responses = {
        valid:   { status: 'VÁLIDO',   message: 'Ticket aceptado. ¡Bienvenido!' },
        used:    { status: 'YA USADO', message: 'Este ticket ya fue utilizado.' },
        invalid: { status: 'INVÁLIDO', message: 'Ticket no válido o expirado.' }
    };
    // normaliza entrada y retorna la respuesta simulada
    return responses[type] || responses.invalid;
};