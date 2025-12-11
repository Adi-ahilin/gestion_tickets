import React, { useState } from 'react';
import { validateTicketSimulated } from '../../api/adminApi';
import '../../styles/pages/AccessScanner.css';

const AccessScanner = ({ onNavigate }) => {
    const [result, setResult] = useState(null);
    const [manual, setManual] = useState('');
    const [loading, setLoading] = useState(false);

    const runSimulation = async (type) => {
        setLoading(true);
        setResult(null);
        
        try {
            // Llama a la función de la API que simula el resultado del escaneo
            const res = await validateTicketSimulated(type);
            setResult(res);
        } catch (error) {
            console.error("Error en la simulación del ticket:", error);
            setResult({ status: 'ERROR', message: 'Fallo de conexión en la simulación' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scanner-layout">
            <div className="scanner-header">
                <span className="scanner-title">Sistema de Validación QR</span>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>🏠 Inicio</button>
            </div>

            <div className="scanner-body">
                {/* Tarjeta de Estadísticas (Asistentes Ingresados) */}
                <div className="card-box">
                    <div className="count-label">Asistentes Ingresados</div>
                    <div className="count-display">9 / 9</div>
                    <div className="count-label">100% de asistencia</div>
                </div>

                {/* Tarjeta de Escaneo y Botones de Simulación */}
                <div className="card-box">
                    <div className="camera-placeholder">📷</div>
                    <h3 className="camera-text">Escanear Código QR</h3>
                    <p className="camera-sub">Acerca el ticket al lector o usa la cámara</p>
                    
                    {/* Botones de Simulación */}
                    <button className="btn-sim sim-valid" onClick={() => runSimulation('valid')} disabled={loading}>Simular: Ticket Válido</button>
                    <button className="btn-sim sim-used" onClick={() => runSimulation('used')} disabled={loading}>Simular: Ticket Ya Usado</button>
                    <button className="btn-sim sim-invalid" onClick={() => runSimulation('invalid')} disabled={loading}>Simular: Ticket Inválido</button>

                    {/* Mostrar Resultado del Escaneo */}
                    {result && (
                        <div className="result-msg" style={{
                            backgroundColor: result.status === 'VÁLIDO' ? '#dcfce7' : result.status === 'YA USADO' ? '#fef3c7' : '#fee2e2',
                            color: result.status === 'VÁLIDO' ? '#166534' : result.status === 'YA USADO' ? '#92400e' : result.status === 'ERROR' ? '#991b1b' : '#991b1b'
                        }}>
                            <div style={{fontSize:'1.3rem'}}>{result.status}</div>
                            <div>{result.message}</div>
                            {result.primer_uso && <div style={{fontSize:'0.8rem', marginTop:'5px'}}>Primer uso: {result.primer_uso}</div>}
                        </div>
                    )}
                </div>

                {/* Búsqueda Manual */}
                <div className="card-box">
                    <div className="manual-search-box">
                        <label className="manual-label">Búsqueda Manual de Emergencia</label>
                        <div className="manual-row">
                            <input className="manual-input" placeholder="Buscar por orden o email..." value={manual} onChange={e => setManual(e.target.value)} />
                            <button className="manual-btn" disabled={loading}>🔍</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessScanner;