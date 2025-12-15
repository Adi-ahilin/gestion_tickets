import React, { useState, useEffect } from 'react';
import { getAllOrders, getDashboardStats, findOrders, confirmPayment } from '../../api/adminApi';
import { EstadoOrden } from '../../core/types';
import '../../styles/pages/AdminPanel.css'; // Importación de estilos específicos

const AdminPanel = ({ onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ vendidas: 0, pendientes: 0, disponibles: 0, ingresos: 0 });
    const [query, setQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null); // Estado para el modal

    const refreshData = async () => {
        try {
            const [o, s] = await Promise.all([getAllOrders(), getDashboardStats()]);
            setOrders(o || []); // Asegura que sea un array
            setStats(s);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => { refreshData(); }, []);

    const handleSearch = async () => {
        const results = await findOrders(query);
        setOrders(results || []);
    };

    const handleConfirm = async (id) => {
        if(window.confirm('¿Confirmar pago recibido?')) {
            await confirmPayment(id);
            refreshData();
        }
    };

    // Función para abrir el modal
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    // Función para cerrar el modal
    const closeDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="admin-layout">
            <div className="admin-header">
                <span className="admin-title">Panel Administrativo</span>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>🏠 Inicio</button>
            </div>

            <div className="admin-content">
                <div className="stats-grid">
                    <div className="stat-card"><div><div className="stat-label">Vendidas</div><div className="stat-value val-green">{stats.vendidas}</div></div><div className="stat-icon val-green">✔</div></div>
                    <div className="stat-card"><div><div className="stat-label">Pendientes</div><div className="stat-value val-yellow">{stats.pendientes}</div></div><div className="stat-icon val-yellow">🕒</div></div>
                    <div className="stat-card"><div><div className="stat-label">Disponibles</div><div className="stat-value val-blue">{stats.disponibles}</div></div><div className="stat-icon val-blue">🎫</div></div>
                    <div className="stat-card"><div><div className="stat-label">Ingresos</div><div className="stat-value val-purple">${stats.ingresos.toLocaleString()}</div></div><div className="stat-icon val-purple">$</div></div>
                </div>

                <div className="search-box">
                    <input className="search-input" placeholder="Buscar por ID, nombre o email..." value={query} onChange={e => setQuery(e.target.value)} />
                    <button className="btn-search" onClick={handleSearch}>Buscar</button>
                </div>

                <div className="orders-section">
                    <h3>Órdenes de Compra</h3>
                    <div className="table-wrap">
                        <table className="orders-table">
                            <thead>
                                <tr><th>ID Orden</th><th>Comprador</th><th>Email</th><th>Tickets</th><th>Total</th><th>Estado</th><th>Acción</th></tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <tr key={order.id}>
                                            <td style={{fontWeight:'bold'}}>{order.id}</td>
                                            <td>{order.comprador || order.nombre}</td>
                                            <td>{order.email}</td>
                                            <td>{order.cantidad_tickets || order.cantidad}</td>
                                            <td style={{fontWeight:'bold'}}>${parseFloat(order.monto_total).toLocaleString('es-CL')}</td>
                                            <td><span className={`badge ${order.estado === EstadoOrden.PENDIENTE ? 'badge-p' : 'badge-c'}`}>{order.estado}</span></td>
                                            <td>
                                                {order.estado === EstadoOrden.PENDIENTE ? 
                                                    <button className="btn-act-green" onClick={() => handleConfirm(order.id)}>Confirmar Pago</button> : 
                                                    <button className="btn-act-gray" onClick={() => handleViewDetails(order)}>Ver Detalles</button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>No hay órdenes registradas</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL DE DETALLES --- */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={closeDetails}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Detalle de Orden</h2>
                            <button className="close-btn" onClick={closeDetails}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-item"><strong>ID:</strong> {selectedOrder.id}</div>
                            <div className="detail-item"><strong>Comprador:</strong> {selectedOrder.comprador || selectedOrder.nombre}</div>
                            <div className="detail-item"><strong>Email:</strong> {selectedOrder.email}</div>
                            <div className="detail-item"><strong>Tickets:</strong> {selectedOrder.cantidad_tickets || selectedOrder.cantidad}</div>
                            <div className="detail-item"><strong>Total:</strong> ${parseFloat(selectedOrder.monto_total).toLocaleString('es-CL')}</div>
                            <div className="detail-item"><strong>Método de Pago:</strong> {selectedOrder.metodo_pago || selectedOrder.metodo || 'No especificado'}</div>
                            <div className="detail-item"><strong>Fecha:</strong> {new Date(selectedOrder.fecha_creacion).toLocaleString()}</div>
                            <div className="detail-item">
                                <strong>Estado: </strong> 
                                <span className={`badge ${selectedOrder.estado === EstadoOrden.PENDIENTE ? 'badge-p' : 'badge-c'}`}>
                                    {selectedOrder.estado}
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-close-modal" onClick={closeDetails}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;