import React from 'react';
import '../../styles/pages/dashboard.css'; // Importa los estilos del dashboard

const Dashboard = ({ onNavigate }) => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Sistema de Gestión de Tickets</h1>
                <p className="dashboard-subtitle">Academia de Danza - Gala Anual 2025</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => onNavigate('reserva')}>
                    <span className="card-icon">🎟️</span>
                    <h3 className="card-title">Portal de Compra</h3>
                    <p className="card-text">Reserva tus entradas online.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('admin')}>
                    <span className="card-icon">⚙️</span>
                    <h3 className="card-title">Panel Admin</h3>
                    <p className="card-text">Gestiona órdenes y pagos.</p>
                </div>

                <div className="dashboard-card" onClick={() => onNavigate('scanner')}>
                    <span className="card-icon">📷</span>
                    <h3 className="card-title">Validación QR</h3>
                    <p className="card-text">Control de acceso al evento.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;