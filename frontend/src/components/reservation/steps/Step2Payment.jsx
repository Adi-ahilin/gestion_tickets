import React from 'react';

const Step2Payment = ({ data, handleChange, onBack, onConfirm, loading }) => {
    return (
        <>
            <h3 className="form-title">Método de Pago</h3>
            
            <div style={{marginBottom:'20px'}}>
                {/* Opción 1: Transferencia */}
                <label 
                    className={`payment-option ${data.metodo === 'Transferencia Bancaria' ? 'selected' : ''}`}
                    onClick={() => handleChange('metodo', 'Transferencia Bancaria')}
                >
                    <input 
                        type="radio" 
                        name="pay" 
                        checked={data.metodo === 'Transferencia Bancaria'} 
                        readOnly 
                        className="radio-custom" 
                    />
                    <div>
                        <strong>Transferencia Bancaria</strong><br/>
                        <small style={{color:'#6b7280'}}>Recibirás los datos bancarios por email</small>
                    </div>
                </label>

                {/* Opción 2: Efectivo */}
                <label 
                    className={`payment-option ${data.metodo === 'Efectivo en Academia' ? 'selected' : ''}`}
                    onClick={() => handleChange('metodo', 'Efectivo en Academia')}
                >
                    <input 
                        type="radio" 
                        name="pay" 
                        checked={data.metodo === 'Efectivo en Academia'} 
                        readOnly 
                        className="radio-custom" 
                    />
                    <div>
                        <strong>Efectivo en Academia</strong><br/>
                        <small style={{color:'#6b7280'}}>Pago presencial en horario de atención</small>
                    </div>
                </label>
            </div>

            <div style={{display:'flex', gap:'10px'}}>
                <button className="btn-back" onClick={onBack} style={{flex: 1}}>
                    Atrás
                </button>
                <button 
                    className="btn-next" 
                    onClick={onConfirm} 
                    disabled={loading} 
                    style={{flex: 1}}
                >
                    {loading ? 'Confirmando...' : 'Confirmar Reserva'}
                </button>
            </div>
        </>
    );
};

export default Step2Payment;