import React from 'react';

const Step1BuyerData = ({ data, handleText, handlePhone, handleChange, totalPagar, precio, isPreventa, onNext }) => {
    return (
        <>
            <h3 className="form-title">Datos del Comprador</h3>
            
            <label className="input-label">Nombre *</label>
            <input className="input-control" placeholder="Ej: María" value={data.nombre} 
                   onChange={(e) => handleText(e, 'nombre')} />

            <label className="input-label">Apellido *</label>
            <input className="input-control" placeholder="Ej: González" value={data.apellido} 
                   onChange={(e) => handleText(e, 'apellido')} />

            <label className="input-label">Email *</label>
            <input className="input-control" type="email" placeholder="correo@ejemplo.com" value={data.email} 
                   onChange={(e) => handleChange('email', e.target.value)} />

            <label className="input-label">Teléfono (8 dígitos) *</label>
            <input className="input-control" type="tel" placeholder="Ej: 12345678" value={data.telefono} 
                   onChange={handlePhone} />

            <label className="input-label">Cantidad de Tickets *</label>
            <select className="input-control" value={data.cantidad} 
                    onChange={(e) => handleChange('cantidad', parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ticket(s)</option>)}
            </select>

            <div className="total-pay-box">
                <div className="total-label">Total a pagar: ${totalPagar.toLocaleString('es-CL')}</div>
                <div className="total-desc">Precio {isPreventa ? 'preventa' : 'general'}: ${precio.toLocaleString('es-CL')}</div>
            </div>

            <button className="btn-next" onClick={onNext}>Continuar</button>
        </>
    );
};

export default Step1BuyerData;