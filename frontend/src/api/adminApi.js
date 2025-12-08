import { EstadoOrden, EstadoTicket } from '../core/types';

export const validateTicketSimulated = async (type) => {
    const responses = {
        valid: { status: 'VÁLIDO', message: 'Ticket aceptado. ¡Bienvenido!' },
        used: { status: 'YA USADO', message: 'Este ticket ya fue utilizado.' },
        invalid: { status: 'INVÁLIDO', message: 'Ticket no válido o expirado.' }
    };
    return responses[type] || responses.invalid;
};

// --- MOCK DE DATOS ---
export const mockOrders = [
    {
        id: 'DANZA2025-0001',
        comprador: 'María González',
        email: 'maria@email.com',
        cantidad_tickets: 2,
        monto_total: 9000,
        fecha_creacion: new Date(),
        estado: EstadoOrden.PENDIENTE,
        fecha_confirmacion: null,
    },
    {
        id: 'DANZA2025-0002',
        comprador: 'Juan Pérez',
        email: 'juan@email.com',
        cantidad_tickets: 4,
        monto_total: 18000,
        fecha_creacion: new Date(),
        estado: EstadoOrden.CONFIRMADA,
        fecha_confirmacion: new Date(),
    },
    {
        id: 'DANZA2025-0003',
        comprador: 'Ana Silva',
        email: 'ana@email.com',
        cantidad_tickets: 1,
        monto_total: 4500,
        fecha_creacion: new Date(),
        estado: EstadoOrden.PENDIENTE,
        fecha_confirmacion: null,
    },
    // Orden extra para probar paginación o scroll
    {
        id: 'DANZA2025-0004',
        comprador: 'Carlos Díaz',
        email: 'carlos@email.com',
        cantidad_tickets: 3,
        monto_total: 13500,
        fecha_creacion: new Date(),
        estado: EstadoOrden.CONFIRMADA,
        fecha_confirmacion: new Date(),
    }
    
];

export const mockTickets = [
    // Datos simulados para el escáner (no afectan esta vista directamente)
    { id: 1, orden_id: 'DANZA2025-0002', codigo_hash: 'QR-VALID-101', estado: EstadoTicket.VIGENTE, fecha_uso: null },
];

// --- FUNCIONES DE LÓGICA DE NEGOCIO ---

// Obtener todas las órdenes
export const getAllOrders = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockOrders];
};

// Buscar órdenes por ID, Nombre o Email
export const findOrders = async (query) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!query) return mockOrders;

    const lowerQuery = query.toLowerCase();
    return mockOrders.filter(order => 
        order.id.toLowerCase().includes(lowerQuery) ||
        order.comprador.toLowerCase().includes(lowerQuery) ||
        order.email.toLowerCase().includes(lowerQuery)
    );
};

// Confirmar pago
export const confirmPayment = async (orderId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1 && mockOrders[orderIndex].estado === EstadoOrden.PENDIENTE) {
        mockOrders[orderIndex].estado = EstadoOrden.CONFIRMADA;
        mockOrders[orderIndex].fecha_confirmacion = new Date();
        return mockOrders[orderIndex];
    }
    return null;
};

// Calcular estadísticas en tiempo real
export const getDashboardStats = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalCapacidad = 250; 
    let vendidas = 0; // Órdenes confirmadas (o tickets, depende de regla de negocio)
    let pendientes = 0;
    let ingresos = 0;
    let ticketsOcupados = 0;

    mockOrders.forEach(o => {
        if (o.estado === EstadoOrden.CONFIRMADA) {
            vendidas++; 
            ticketsOcupados += o.cantidad_tickets;
            ingresos += o.monto_total;
        } else if (o.estado === EstadoOrden.PENDIENTE) {
            pendientes++;
        }
    });

    return {
        vendidas: ticketsOcupados, // Mostramos tickets vendidos o transacciones vendidas según prefieras
        pendientes, // Transacciones pendientes
        disponibles: totalCapacidad - ticketsOcupados,
        ingresos
    };
};

// Funciones placeholder para compatibilidad con otros módulos
export const runExpirationCheck = async () => [];
export const runReminderEmailSender = async () => [];
export const validateTicketAccess = async () => ({ status: 'INVÁLIDO' });