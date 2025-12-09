import { EstadoOrden, PRECIO_PREVENTA, PRECIO_GENERAL, FECHA_LIMITE_PREVENTA } from '../core/types';

export const validateTicketSimulated = async (type) => {
    const responses = {
        valid:   { status: 'VÁLIDO',   message: 'Ticket aceptado. ¡Bienvenido!' },
        used:    { status: 'YA USADO', message: 'Este ticket ya fue utilizado.' },
        invalid: { status: 'INVÁLIDO', message: 'Ticket no válido o expirado.' }
    };
    // normaliza entrada y retorna la respuesta simulada
    return responses[type] || responses.invalid;
};

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

// --- MOCK DE DATOS (Coincidiendo con tu diseño visual) ---
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

// --- FUNCIONES LÓGICAS ---

export const getAllOrders = async () => {
    // Simula carga de datos
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockOrders];
};

export const findOrders = async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!query) return mockOrders;

    const lowerQuery = query.toLowerCase();
    return mockOrders.filter(order => 
        order.id.toLowerCase().includes(lowerQuery) ||
        order.comprador.toLowerCase().includes(lowerQuery) ||
        order.email.toLowerCase().includes(lowerQuery)
    );
};

export const confirmPayment = async (orderId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1 && mockOrders[orderIndex].estado === EstadoOrden.PENDIENTE) {
        mockOrders[orderIndex].estado = EstadoOrden.CONFIRMADA;
        mockOrders[orderIndex].fecha_confirmacion = new Date();
        return mockOrders[orderIndex];
    }
    return null;
};

export const getDashboardStats = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalCapacidad = 250; 
    let vendidas = 0;
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
        vendidas: vendidas, // Cantidad de órdenes exitosas
        pendientes, 
        disponibles: totalCapacidad - ticketsOcupados,
        ingresos
    };
};

// Placeholders para evitar errores de importación en otros archivos
export const runExpirationCheck = async () => [];
export const runReminderEmailSender = async () => [];
export const validateTicketAccess = async () => ({ status: 'INVÁLIDO' });
