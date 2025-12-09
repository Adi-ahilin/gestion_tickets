import React from 'react';
// Dependiendo de tu versión de React, usarás ReactDOM.render o createRoot
import ReactDOM from 'react-dom/client'; 

import './index.css'; // Importa los estilos globales
import App from './App'; // Importa tu componente principal App.tsx

// Asegúrate de que tu HTML (generalmente public/index.html) tenga un div con id="root"
const rootElement = document.getElementById('root'); 

if (rootElement) {
    // Usando React 18+
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // Manejo de error si no se encuentra el elemento root
    console.error("No se encontró el elemento raíz 'root'. Asegúrate de que exista en index.html.");
}