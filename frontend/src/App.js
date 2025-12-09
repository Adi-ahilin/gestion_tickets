import React, { useState } from 'react';

// 1. CORRECCIÓN DE ESTILOS: Apuntar a la carpeta 'styles'
import './styles/App.css'; 

// 2. IMPORTACIÓN DE COMPONENTES
// Asegúrate de haber movido las carpetas como se indicó en el Paso 1
import Dashboard from './components/dashboard/Dashboard';
import ReservationForm from './components/reservation/ReservationForm';
import AdminPanel from './components/admin/AdminPanel';
import AccessScanner from './components/access/AccessScanner';

const App = () => {
    // Estado para manejar la navegación: 'dashboard', 'reserva', 'admin', 'scanner'
    const [currentView, setCurrentView] = useState('dashboard');

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard onNavigate={setCurrentView} />;
            case 'reserva':
                return <ReservationForm onNavigate={setCurrentView} />;
            case 'admin':
                return <AdminPanel onNavigate={setCurrentView} />;
            case 'scanner':
                return <AccessScanner onNavigate={setCurrentView} />;
            default:
                return <Dashboard onNavigate={setCurrentView} />;
        }
    };

    return (
        <div className="app-container min-h-screen">
            {/* Carga Tailwind CSS desde CDN para asegurar estilos rápidos */}
            <script src="https://cdn.tailwindcss.com"></script>
            
            <main className="flex-grow">
                {renderView()}
            </main>
        </div>
    );
};

export default App;