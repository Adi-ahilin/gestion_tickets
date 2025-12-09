import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // **Asegúrate de que esta importación sea correcta (App.js)**
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si no estás usando reportWebVitals, puedes omitir la línea siguiente.
reportWebVitals();
