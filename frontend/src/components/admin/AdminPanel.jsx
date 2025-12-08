import React, { useState, useEffect } from 'react';
import { getAllOrders, getDashboardStats, findOrders, confirmPayment } from '../../api/adminApi';
import { EstadoOrden } from '../../core/types';
import '../../styles/components/adminPanel.css';

const AdminPanel = ({ onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ vendidas: 0, pendientes: 0, disponibles: 0, ingresos: 0 });
    const [query, setQuery] = useState('');

    const refreshData = async () => {
        const [o, s] = await Promise.all([getAllOrders(), getDashboardStats()]);
        setOrders(o);
        setStats(s);
    };

    useEffect(() => { refreshData(); }, []);

    const handleSearch = async () => {
        const results = await findOrders(query);
        setOrders(results);
    };

    const handleConfirm = async (id) => {
        if(window.confirm('¿Confirmar pago?')) {
            await confirmPayment(id);
            refreshData();
        }
    };

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <span className="admin-title">Panel Administrativo</span>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>🏠 Inicio</button>
            </div>

            <div className="admin-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div><div className="stat-label">Vendidas</div><div className="stat-value text-green">{stats.vendidas}</div></div>
                        <div className="stat-icon text-green">✔</div>
                    </div>
                    <div className="stat-card">
                        <div><div className="stat-label">Pendientes</div><div className="stat-value text-yellow">{stats.pendientes}</div></div>
                        <div className="stat-icon text-yellow">🕒</div>
                    </div>
                    <div className="stat-card">
                        <div><div className="stat-label">Disponibles</div><div className="stat-value text-blue">{stats.disponibles}</div></div>
                        <div className="stat-icon text-blue">🎫</div>
                    </div>
                    <div className="stat-card">
                        <div><div className="stat-label">Ingresos</div><div className="stat-value text-purple">${stats.ingresos.toLocaleString()}</div></div>
                        <div className="stat-icon text-purple">$</div>
                    </div>
                </div>

                <div className="search-bar">
                    <span style={{color:'#ccc'}}>🔍</span>
                    <input className="search-input" placeholder="Buscar por ID, nombre o email..." value={query} onChange={e => setQuery(e.target.value)} />
                    <button className="btn-search" onClick={handleSearch}>Buscar</button>
                </div>

                <h3 style={{marginBottom:'1rem', color:'#333'}}>Órdenes de Compra</h3>
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>ID Orden</th>
                                <th>Comprador</th>
                                <th>Email</th>
                                <th>Tickets</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td style={{fontWeight:'bold'}}>{order.id}</td>
                                    <td>{order.comprador}</td>
                                    <td>{order.email}</td>
                                    <td>{order.cantidad_tickets}</td>
                                    <td style={{fontWeight:'bold'}}>${order.monto_total.toLocaleString()}</td>
                                    <td><span className={`badge ${order.estado === EstadoOrden.PENDIENTE ? 'pendiente' : 'confirmada'}`}>{order.estado}</span></td>
                                    <td>
                                        {order.estado === EstadoOrden.PENDIENTE ? 
                                            <button className="btn-confirm" onClick={() => handleConfirm(order.id)}>Confirmar Pago</button> :
                                            <button className="btn-details">Ver Detalles</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;