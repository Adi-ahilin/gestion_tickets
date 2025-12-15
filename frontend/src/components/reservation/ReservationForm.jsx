import React, { useState } from 'react';
import { createOrder, getCurrentTicketPrice } from '../../api/reservationApi';
import { FECHA_EVENTO, HORA_EVENTO, PRECIO_PREVENTA } from '../../core/types';
import '../../styles/pages/ReservationForm.css';

const ReservationForm = ({ onNavigate }) => {
    // Estado del formulario y la reserva
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ 
        nombre: '', 
        apellido: '', // ← NUEVO CAMPO
        email: '', 
        cantidad: 1, 
        metodo: 'Transferencia Bancaria'
    });
    const [order, setOrder] = useState(null); // Almacena la orden confirmada por la API
    const [loading, setLoading] = useState(false); 

    // Lógica de negocio
    const precio = getCurrentTicketPrice();
    const isPreventa = precio === PRECIO_PREVENTA;
    // El cálculo del total a pagar es correcto
    const totalPagar = data.cantidad * precio; 

    const handleNext = () => {
        // Validación básica para el paso 1
        if(step === 1 && (!data.nombre || !data.apellido || !data.email || data.cantidad <= 0)) {
             alert("Por favor complete los datos obligatorios.");
             return;
        }
        setStep(step + 1);
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // Llama a la API (createOrder ya fue corregida para devolver un monto_total numérico)
            const newOrder = await createOrder(data);
            
            // AÑADIDO: Aseguramos que la fecha de creación esté presente para mostrarla
            // Si la API no devuelve fecha_creacion, usamos la fecha actual
            const orderWithDate = {
                ...newOrder,
                fecha_creacion: newOrder.fecha_creacion || new Date()
            };
            
            setOrder(orderWithDate);
            setStep(3); // Pasa al paso de confirmación exitosa
        } catch (error) {
            console.error("Error al confirmar reserva:", error);
            alert("Hubo un error al procesar la reserva. Por favor, intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // --- Sub-componentes visuales ---

    const EventInfoCard = () => (
        <div className="event-card">
            <h2 className="event-title">Gala Anual 2025 - Academia de Danza</h2>
            <div className="event-info-row">
                <span><span className="info-icon">📅</span> {FECHA_EVENTO}</span>
                <span><span className="info-icon">🕒</span> {HORA_EVENTO}</span>
            </div>
            {isPreventa && (
                <div className="preventa-alert">
                    <strong>🎉 ¡Preventa Activa!</strong><br/>
                    Precio especial: ${precio.toLocaleString('es-CL')} hasta el 18/12/2025
                </div>
            )}
        </div>
    );

    const Stepper = () => (
        <div className="stepper">
            <div className={`step-item ${step >= 1 ? 'step-bg-active' : 'step-bg-inactive'}`}>1</div>
            <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-item ${step >= 2 ? 'step-bg-active' : 'step-bg-inactive'}`}>2</div>
            <div className={`step-connector ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step-item ${step >= 3 ? 'step-bg-active' : 'step-bg-inactive'}`}>3</div>
        </div>
    );

    // Paso 1: Datos del Comprador
    const renderStep1 = () => (
        <>
            <h3 className="form-title">Datos del Comprador</h3>

            <label className="input-label">Nombre *</label>
            <input
                className="input-control"
                placeholder="Ej: María"
                value={data.nombre}
                onChange={e => setData({...data, nombre: e.target.value})}
            />

            {/* --- NUEVO CAMPO APELLIDO --- */}
            <label className="input-label">Apellido *</label>
            <input
                className="input-control"
                placeholder="Ej: González"
                value={data.apellido}
                onChange={e => setData({...data, apellido: e.target.value})}
            />

            <label className="input-label">Email *</label>
            <input
                className="input-control"
                type="email"
                placeholder="correo@ejemplo.com"
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
            />
            
            <label className="input-label">Cantidad de Tickets *</label>
            <select
                className="input-control"
                value={data.cantidad}
                onChange={e => setData({...data, cantidad: parseInt(e.target.value)})}
            >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ticket(s)</option>)}
            </select>
            
            <div className="total-pay-box">
                <div className="total-label">Total a pagar: ${totalPagar.toLocaleString('es-CL')}</div>
                <div className="total-desc">Precio {isPreventa ? 'preventa' : 'general'}: ${precio.toLocaleString('es-CL')} por ticket</div>
            </div>

            <button className="btn-next" onClick={handleNext}>Continuar</button>
        </>
    );

    // Paso 2: Método de Pago
    const renderStep2 = () => (
        <>
            <h3 className="form-title">Método de Pago</h3>
            <div style={{marginBottom:'20px'}}>
                <label 
                    className={`payment-option ${data.metodo === 'Transferencia Bancaria' ? 'selected' : ''}`}
                    onClick={() => setData({...data, metodo:'Transferencia Bancaria'})}
                >
                    <input type="radio" name="pay" checked={data.metodo === 'Transferencia Bancaria'} readOnly className="radio-custom" />
                    <div><strong>Transferencia Bancaria</strong><br/><small style={{color:'#6b7280'}}>Recibirás los datos bancarios por email</small></div>
                </label>
                <label 
                    className={`payment-option ${data.metodo === 'Efectivo en Academia' ? 'selected' : ''}`}
                    onClick={() => setData({...data, metodo:'Efectivo en Academia'})}
                >
                    <input type="radio" name="pay" checked={data.metodo === 'Efectivo en Academia'} readOnly className="radio-custom" />
                    <div><strong>Efectivo en Academia</strong><br/><small style={{color:'#6b7280'}}>Pago presencial en horario de atención</small></div>
                </label>
            </div>

            <div style={{display:'flex', gap:'10px'}}>
                <button className="btn-back" onClick={() => setStep(1)} style={{flex: 1}}>Atrás</button>
                <button className="btn-next" onClick={handleConfirm} disabled={loading} style={{flex: 1}}>
                    {loading ? 'Confirmando...' : 'Confirmar Reserva'}
                </button>
            </div>
        </>
    );

    // Paso 3: Confirmación
    const renderStep3 = () => (
        <div className="success-card-content">
            <div className="check-icon">✓</div>
            <h2 className="success-text">¡Reserva Confirmada!</h2>

            <div className="order-detail-box">
                <div className="order-number">{order.id}</div> 
                <small className="order-label">Número de Orden</small>
                
                <div className="detail-row">
                    <span className="detail-key">Comprador:</span>
                    <span>{data.nombre} {data.apellido}</span>
                </div>
                <div className="detail-row"><span className="detail-key">Email:</span> <span>{data.email}</span></div>
                <div className="detail-row"><span className="detail-key">Tickets:</span> <span>{data.cantidad}</span></div>
                <div className="detail-row"><span className="detail-key">Total:</span> <span>${order.monto_total.toLocaleString('es-CL')}</span></div>
                <div className="detail-row"><span className="detail-key">Método:</span> <span>{data.metodo}</span></div>
                <div className="detail-row"><span className="detail-key">Fecha:</span> <span>{new Date(order.fecha_creacion).toLocaleString('es-CL')}</span></div>
            </div>

            <div className="warning-payment">
                <strong>⏰ Tiempo para pagar: 48 horas</strong><br/>
                Hemos enviado las instrucciones de pago a tu email
            </div>
            
            <button className="btn-next" style={{marginTop:'20px'}} onClick={() => onNavigate('dashboard')}>
                Volver al Inicio
            </button>
        </div>
    );

    return (
        <div className="reserva-layout">
            <div className="portal-header">
                <span className="portal-title">Portal de Compra</span>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>🏠 Inicio</button>
            </div>

            <div className="portal-content">
                <EventInfoCard />
                <Stepper />

                <div className="form-card">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;
