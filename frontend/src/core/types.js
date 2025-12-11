// ====================================================================
// CORE: ENUMS E INTERFACES (Modelos de datos del sistema)
// ====================================================================

// Estados posibles para una Orden de Compra
export const EstadoOrden = {
    PENDIENTE: 'Pendiente', 
    CONFIRMADA: 'Confirmada', 
    EXPIRADA: 'Expirada', 
};

// Estados posibles para un Ticket individual
export const EstadoTicket = {
    VIGENTE: 'Vigente',
    UTILIZADO: 'Utilizado',
    ANULADO: 'Anulado',
};

// ====================================================================
// CONFIGURACIÓN DE NEGOCIO (Precios y Fechas)
// ====================================================================

// Configuración de la Preventa según tu requerimiento
export const PRECIO_PREVENTA = 4500;
export const PRECIO_GENERAL = 6000;

// Fecha límite exacta: 19 de Diciembre de 2025 a las 23:59:59
export const FECHA_LIMITE_PREVENTA = new Date('2025-12-19T23:59:59'); 

// Datos informativos del evento para mostrar en el Portal
export const FECHA_EVENTO = "19 Diciembre 2025";
export const HORA_EVENTO = "20:00 hrs";