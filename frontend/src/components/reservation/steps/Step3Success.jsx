import React from 'react';

const Step3Success = ({ order, buyerData, onNavigate }) => {
    // Protección por si la orden llega vacía (aunque no debería pasar)
    if (!order) return null;

    return (
        <div className="success-card-content">
            <div className="check-icon">✓</div>
            <h2 className="success-text">¡Reserva Confirmada!</h2>

            <div className="order-detail-box">
                <div className="order-number">{order.id}</div> 
                <small className="order-label">Número de Orden</small>
                
                <div className="detail-row">
                    <span className="detail-key">Comprador:</span>
                    <span>{buyerData.nombre} {buyerData.apellido}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Email:</span> 
                    <span>{buyerData.email}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Tickets:</span> 
                    <span>{buyerData.cantidad}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Total:</span> 
                    {/* Usamos order.monto_total si viene del backend, o calculamos un fallback */}
                    <span>${(order.monto_total || 0).toLocaleString('es-CL')}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Método:</span> 
                    <span>{buyerData.metodo}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-key">Fecha:</span> 
                    <span>{new Date(order.fecha_creacion).toLocaleString('es-CL')}</span>
                </div>
            </div>

            <div className="warning-payment">
                <strong>⏰ Tiempo para pagar: 48 horas</strong><br/>
                Hemos enviado las instrucciones de pago a tu email
            </div>
            
            <button 
                className="btn-next" 
                style={{marginTop:'20px'}} 
                onClick={() => onNavigate('dashboard')}
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default Step3Success;