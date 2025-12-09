import React, { useState } from 'react';
import '../../styles/components/button.css';
import '../../styles/base.css';

// 1. IMPORTAMOS LA API REAL (Esto es lo que faltaba)
import { createOrder, getCurrentTicketPrice } from '../../api/reservationApi';

const ReservationForm = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ nombre: '', email: '', cantidad: 1 });
    const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras carga

    // 2. Usamos el precio real de la API
    const precio = getCurrentTicketPrice();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Bloqueamos el botón

        try {
            // 3. Llamamos a la función real que conecta con Django
            // Nota: enviamos 'cantidad_tickets' porque así lo espera nuestra reservationApi
            await createOrder({
                nombre: formData.nombre,
                email: formData.email,
                cantidad_tickets: formData.cantidad 
            });

            // Si no da error, mostramos éxito
            alert(`✅ ¡Reserva Exitosa!\nTe hemos enviado un correo a ${formData.email}`);
            onNavigate('dashboard');

        } catch (error) {
            // Si falla, mostramos el error real
            console.error(error);
            alert("❌ Hubo un error al procesar tu reserva. Revisa la consola para más detalles.");
        } finally {
            setLoading(false); // Desbloqueamos el botón
        }
    };

    return (
        <div className="panel-container" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%'}}>
            <button className="btn-back" onClick={() => onNavigate('dashboard')} disabled={loading}>
                ← Volver al Inicio
            </button>
            <h2 style={{color: '#4a0e8f', textAlign: 'center', marginBottom: '20px'}}>Portal de Compra</h2>
            
            <form onSubmit={handleSubmit}>
                <label>Nombre Completo:</label>
                <input 
                    className="form-input" 
                    style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd'}}
                    type="text" 
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    disabled={loading}
                />

                <label>Email:</label>
                <input 
                    className="form-input" 
                    style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd'}}
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    disabled={loading}
                />

                <label>Cantidad:</label>
                <select 
                    className="form-select" 
                    style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd'}}
                    value={formData.cantidad}
                    onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value)})}
                    disabled={loading}
                >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>

                <div style={{padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px', marginBottom: '20px'}}>
                    <strong>Total a Pagar: </strong> ${(formData.cantidad * precio).toLocaleString('es-CL')}
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer'}}
                >
                    {loading ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
            </form>
        </div>
    );
};

export default ReservationForm;