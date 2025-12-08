import React, { useState } from 'react';

// Importación de los componentes modularizados
import Dashboard from './components/dashboard/Dashboard';
import ReservationForm from './components/reservation/ReservationForm';
import AdminPanel from './components/admin/AdminPanel';
import AccessScanner from './components/access/AccessScanner';

const App = () => {
    // Estado para controlar qué vista se muestra actualmente
    // Opciones: 'dashboard', 'reserva', 'admin', 'scanner'
    const [currentView, setCurrentView] = useState('dashboard');

    // Función para renderizar el componente correcto según el estado
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
            {/* Cargamos Tailwind CSS vía CDN para asegurar que los estilos de las tarjetas 
              y el dashboard funcionen sin necesidad de configurar postcss/webpack localmente.
            */}
            <script src="https://cdn.tailwindcss.com"></script>
            
            {/* Estilos globales básicos para resetear márgenes y fuentes */}
            <style>
                {`
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f8f0ff; /* Fondo base claro */
                    font-family: 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
                }
                .app-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                /* Asegura que el contenido ocupe todo el ancho disponible */
                #root > .app-container > main {
                    flex-grow: 1;
                    width: 100%;
                    padding: 0 !important;
                }
                `}
            </style>
            
            <main className="flex-grow">
                {renderView()}
            </main>
        </div>
    );
};

export default App;