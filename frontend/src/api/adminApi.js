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

            // Comprador anidado
            comprador: orden.comprador
                ? `${orden.comprador.nombre} ${orden.comprador.apellido}`
                : 'Cliente Web',

            email: orden.comprador?.email ?? 'Sin Email',
            telefono: orden.comprador?.telefono ?? 'Sin Teléfono',

            // Cantidad real de tickets
            cantidad_tickets: Array.isArray(orden.tickets)
                ? orden.tickets.length
                : 0,

            monto_total: Number(orden.total ?? 0),

            estado: orden.estado,

            // --- CORRECCIÓN 1: FECHA ---
            // Usamos 'fecha_orden' que es el nombre real en Django (models.py)
            fecha_creacion: orden.fecha_orden, 

            // --- CORRECCIÓN 2: MÉTODO DE PAGO ---
            // Como el backend no guarda esto, asumimos "Transferencia" para la vista
            metodo_pago: 'Transferencia Bancaria'
        }));
    } catch (error) {
        console.error("Error en getAllOrders:", error);
        return [];
    }
};

// --------------------------------------------------
// ESTADÍSTICAS DEL DASHBOARD
// --------------------------------------------------
export const getDashboardStats = async () => {
    // Capacidad total del evento (dato fijo para el cálculo)
    const TOTAL_CAPACIDAD = 200; 

    const orders = await getAllOrders();
    
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
        vendidas, // Órdenes confirmadas
        pendientes, // Órdenes pendientes
        disponibles: TOTAL_CAPACIDAD - ticketsOcupados, // Asientos libres
        ingresos // Dinero recaudado
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
        String(order.email).toLowerCase().includes(lowerQuery) ||
        String(order.comprador).toLowerCase().includes(lowerQuery)
    );
};

// --------------------------------------------------
// CONFIRMAR PAGO
// --------------------------------------------------
export const confirmPayment = async (id) => {
    try {
        const response = await fetch(`${API_URL}/ordenes/${id}/confirmar/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al confirmar pago');
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error en confirmPayment:", error);
        throw error;
    }
};

// --------------------------------------------------
// SIMULACIÓN DE ESCÁNER (PLACEHOLDER)
// --------------------------------------------------
export const validateTicketSimulated = async (type) => {
    // Simulamos un retraso de red de 0.5 segundos para realismo
    await new Promise(resolve => setTimeout(resolve, 500));

    const responses = {
        valid:   { status: 'VÁLIDO',   message: 'Ticket aceptado. ¡Bienvenido!', primer_uso: null },
        used:    { status: 'YA USADO', message: 'Este ticket ya fue utilizado.', primer_uso: '12/12/2025 18:30' },
        invalid: { status: 'INVÁLIDO', message: 'Ticket no reconocido en el sistema.', primer_uso: null }
    };

    return responses[type] || responses.invalid;
};