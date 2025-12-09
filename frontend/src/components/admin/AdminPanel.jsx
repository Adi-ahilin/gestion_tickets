import React, { useState, useEffect } from 'react';
import { getAllOrders, getDashboardStats, findOrders, confirmPayment } from '../../api/adminApi';
import { EstadoOrden } from '../../core/types';
import '../../styles/pages/AdminPanel.css'; // Importación de estilos específicos

const AdminPanel = ({ onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ vendidas: 0, pendientes: 0, disponibles: 0, ingresos: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Carga inicial de datos
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ordersData, statsData] = await Promise.all([getAllOrders(), getDashboardStats()]);
            setOrders(ordersData);
            setStats(statsData);
        } catch (error) {
            console.error("Error cargando datos del panel", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        const results = await findOrders(searchQuery);
        setOrders(results);
        setLoading(false);
    };

    const handleConfirm = async (orderId) => {
        if (window.confirm(`¿Confirmar pago de la orden ${orderId}?`)) {
            setLoading(true);
            await confirmPayment(orderId);
            await loadData(); // Recargar datos para ver el cambio de estado y stats
            setLoading(false);
        }
    };

    return (
        <div className="admin-layout">
            
            {/* Header Rosa */}
            <header className="admin-header">
                <h1 className="admin-title">Panel Administrativo</h1>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>
                    <span>🏠</span> Inicio
                </button>
            </header>

            <div className="admin-content">
                
                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Vendidas</h3>
                            <div className="stat-value text-green">{stats.vendidas}</div>
                        </div>
                        <div className="stat-icon text-green">✔</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Pendientes</h3>
                            <div className="stat-value text-yellow">{stats.pendientes}</div>
                        </div>
                        <div className="stat-icon text-yellow">🕒</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Disponibles</h3>
                            <div className="stat-value text-blue">{stats.disponibles}</div>
                        </div>
                        <div className="stat-icon text-blue">🎫</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Ingresos</h3>
                            <div className="stat-value text-purple">${stats.ingresos.toLocaleString('es-CL')}</div>
                        </div>
                        <div className="stat-icon text-purple">$</div>
                    </div>
                </div>

                {/* Buscador */}
                <div className="search-bar">
                    <span style={{display: 'flex', alignItems: 'center', color: '#adb5bd', paddingLeft: '5px'}}>🔍</span>
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Buscar por ID, nombre o email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="btn-search" onClick={handleSearch} disabled={loading}>
                        {loading ? '...' : 'Buscar'}
                    </button>
                </div>

                {/* Título y Tabla */}
                <h3 className="section-heading">Órdenes de Compra</h3>
                
                <div className="table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>ID ORDEN</th>
                                <th>COMPRADOR</th>
                                <th>EMAIL</th>
                                <th>TICKETS</th>
                                <th>TOTAL</th>
                                <th>ESTADO</th>
                                <th>ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id}>
                                        <td style={{fontWeight: '600'}}>{order.id}</td>
                                        <td>{order.comprador}</td>
                                        <td style={{color: '#555'}}>{order.email}</td>
                                        <td>{order.cantidad_tickets}</td>
                                        <td style={{fontWeight: '700'}}>${order.monto_total.toLocaleString('es-CL')}</td>
                                        <td>
                                            <span className={`badge ${order.estado === EstadoOrden.CONFIRMADA ? 'badge-confirmada' : 'badge-pendiente'}`}>
                                                {order.estado}
                                            </span>
                                        </td>
                                        <td>
                                            {order.estado === EstadoOrden.PENDIENTE ? (
                                                <button 
                                                    className="btn-confirm" 
                                                    onClick={() => handleConfirm(order.id)}
                                                >
                                                    Confirmar Pago
                                                </button>
                                            ) : (
                                                <button className="btn-details">Ver Detalles</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;