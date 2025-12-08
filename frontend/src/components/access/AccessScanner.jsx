import React, { useState } from 'react';
import { validateTicketSimulated } from '../../api/adminApi';
import '../../styles/pages/AccessScanner.css';

const AccessScanner = ({ onNavigate }) => {
    const [scanResult, setScanResult] = useState(null);
    const [manualCode, setManualCode] = useState('');

    const handleSimulation = async (type) => {
        setScanResult(null);
        const result = await validateTicketSimulated(type);
        setScanResult(result);
    };

    return (
        <div className="scanner-layout">
            <div className="scanner-header">
                <span className="scanner-title">Sistema de Validación QR</span>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>🏠 Inicio</button>
            </div>

            <div className="scanner-content">
                {/* Tarjeta de Asistencia */}
                <div className="attendance-card">
                    <div className="attendance-label">Asistentes Ingresados</div>
                    <div className="attendance-count">7 / 9</div>
                    <div className="attendance-label">78% de asistencia</div>
                </div>

                {/* Tarjeta de Cámara y Botones */}
                <div className="camera-card">
                    <div className="camera-icon">📷</div>
                    <h3 className="camera-title">Escanear Código QR</h3>
                    <p className="camera-desc">Acerca el ticket al lector o usa la cámara</p>

                    <div className="simulation-buttons">
                        <button className="btn-sim sim-valid" onClick={() => handleSimulation('valid')}>Simular: Ticket Válido</button>
                        <button className="btn-sim sim-used" onClick={() => handleSimulation('used')}>Simular: Ticket Ya Usado</button>
                        <button className="btn-sim sim-invalid" onClick={() => handleSimulation('invalid')}>Simular: Ticket Inválido</button>
                    </div>

                    {scanResult && (
                        <div className="scan-result-box" style={{
                            backgroundColor: scanResult.status === 'VÁLIDO' ? '#dcfce7' : scanResult.status === 'YA USADO' ? '#fef3c7' : '#fee2e2',
                            color: scanResult.status === 'VÁLIDO' ? '#166534' : scanResult.status === 'YA USADO' ? '#92400e' : '#991b1b'
                        }}>
                            <div style={{fontSize:'1.2rem'}}>{scanResult.status}</div>
                            <div>{scanResult.message}</div>
                        </div>
                    )}
                </div>

                {/* Búsqueda Manual */}
                <div className="manual-search">
                    <label className="search-label">Búsqueda Manual de Emergencia</label>
                    <div className="search-row">
                        <input className="manual-input" placeholder="Buscar por orden o email..." value={manualCode} onChange={e => setManualCode(e.target.value)} />
                        <button className="btn-manual">🔍</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessScanner;