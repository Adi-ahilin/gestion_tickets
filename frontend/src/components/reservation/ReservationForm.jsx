import React, { useState } from 'react';
import '../../styles/components/button.css'; // Importa estilos de botones
import '../../styles/base.css'; // Importa estilos base para formularios

// Lógica simulada (puedes mover esto a src/api/ más tarde)
const PRECIO_PREVENTA = 4500;
const PRECIO_GENERAL = 6000;
const FECHA_LIMITE_PREVENTA = new Date('2025-12-31T23:59:59');

const getCurrentTicketPrice = () => {
    const today = new Date();
    return today <= FECHA_LIMITE_PREVENTA ? PRECIO_PREVENTA : PRECIO_GENERAL;
};

const ReservationForm = ({ onNavigate }) => {
    const [formData, setFormData] = useState({ nombre: '', email: '', cantidad: 1 });
    const precio = getCurrentTicketPrice();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Reserva simulada para ${formData.cantidad} tickets. Total: $${(formData.cantidad * precio).toLocaleString()}`);
        onNavigate('dashboard');
    };

    return (
        <div className="panel-container" style={{background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%'}}>
            <button className="btn-back" onClick={() => onNavigate('dashboard')}>← Volver al Inicio</button>
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
                />

                <label>Email:</label>
                <input 
                    className="form-input" 
                    style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd'}}
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />

                <label>Cantidad:</label>
                <select 
                    className="form-select" 
                    style={{width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd'}}
                    value={formData.cantidad}
                    onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value)})}
                >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>

                <div style={{padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px', marginBottom: '20px'}}>
                    <strong>Total a Pagar: </strong> ${(formData.cantidad * precio).toLocaleString('es-CL')}
                </div>

                <button type="submit" className="btn btn-primary">Confirmar Reserva</button>
            </form>
        </div>
    );
};

export default ReservationForm;