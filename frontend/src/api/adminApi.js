// Archivo: src/api/adminApi.js
const API_URL = 'http://localhost:8000/api';

// --- FUNCIONES REALES ---

export const getAllOrders = async () => {
    try {
        const response = await fetch(`${API_URL}/ordenes/`);
        if (!response.ok) throw new Error('Error al obtener órdenes');
        const data = await response.json();
        
        // Mapeamos los datos de Django para tu tabla
        return data.map(orden => ({
            id: orden.id,
            comprador: orden.comprador_nombre || orden.nombre || 'Cliente Web',
            email: orden.email || orden.comprador_email || 'Sin Email',
            cantidad_tickets: orden.cantidad || 0,
            monto_total: orden.total || 0,
            estado: orden.estado,
            fecha_creacion: orden.fecha_creacion
        }));
    } catch (error) {
        console.error("Error cargando órdenes:", error);
        return [];
    }
};

export const confirmPayment = async (orderId) => {
    try {
        const response = await fetch(`${API_URL}/ordenes/${orderId}/confirmar/`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Error al confirmar pago');
        return true;
    } catch (error) {
        console.error("Error confirmando pago:", error);
        return false;
    }
};

export const getDashboardStats = async () => {
    const orders = await getAllOrders();
    const totalCapacidad = 250; 
    let vendidas = 0;
    let pendientes = 0;
    let ingresos = 0;
    let ticketsOcupados = 0;

    orders.forEach(o => {
        if (o.estado === 'CONFIRMADA') {
            vendidas++; 
            ticketsOcupados += o.cantidad_tickets;
            ingresos += parseFloat(o.monto_total);
        } else {
            pendientes++;
        }
    });

    return { vendidas, pendientes, disponibles: totalCapacidad - ticketsOcupados, ingresos };
};

export const findOrders = async (query) => {
    const orders = await getAllOrders();
    if (!query) return orders;
    const lowerQuery = query.toLowerCase();
    return orders.filter(order => 
        String(order.id).toLowerCase().includes(lowerQuery) ||
        String(order.email).toLowerCase().includes(lowerQuery)
    );
};

// Placeholders para evitar errores
export const validateTicketSimulated = async () => ({ status: 'INVÁLIDO', message: 'Simulación' });