import { useState } from 'react';
import { createOrder, getCurrentTicketPrice } from '../../../api/reservationApi';
import { PRECIO_PREVENTA } from '../../../core/types';

export const useReservation = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [data, setData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        cantidad: 1,
        metodo: 'Transferencia Bancaria'
    });

    const precio = getCurrentTicketPrice();
    const isPreventa = precio === PRECIO_PREVENTA;
    const totalPagar = data.cantidad * precio;

    // --- MANEJADORES DE INPUTS ---
    const handlePhoneChange = (e) => {
        const valor = e.target.value;
        if (/^[0-9]*$/.test(valor) && valor.length <= 9) {
            setData({ ...data, telefono: valor });
        }
    };

    const handleTextOnlyChange = (e, field) => {
        const valor = e.target.value;
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor)) {
            setData({ ...data, [field]: valor });
        }
    };

    const handleChange = (field, value) => {
        setData({ ...data, [field]: value });
    };

    // --- NAVEGACIÓN Y ENVÍO ---
    const nextStep = () => {
        if (step === 1) {
            // Validaciones
            if (!data.nombre || !data.apellido || !data.email || !data.telefono || data.cantidad <= 0) {
                alert("Por favor complete todos los datos obligatorios.");
                return;
            }
            if (data.telefono.length !== 9) {
                alert(`El teléfono debe tener exactamente 9 dígitos. (Actual: ${data.telefono.length})`);
                return;
            }
            if (!data.email.includes('@')) {
                alert("Ingrese un email válido.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const submitOrder = async () => {
        setLoading(true);
        try {
            const newOrder = await createOrder(data);
            setOrder({
                ...newOrder,
                fecha_creacion: newOrder.fecha_creacion || new Date()
            });
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("Error al procesar la reserva.");
        } finally {
            setLoading(false);
        }
    };

    // Retornamos todo lo que la vista necesita
    return {
        step,
        data,
        loading,
        order,
        precio,
        isPreventa,
        totalPagar,
        handlePhoneChange,
        handleTextOnlyChange,
        handleChange,
        nextStep,
        prevStep,
        submitOrder
    };
};