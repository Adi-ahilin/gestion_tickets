import React from 'react';
import { useReservation } from './hooks/useReservation';
import Step1BuyerData from './steps/Step1BuyerData';
import Step2Payment from './steps/Step2Payment'; // (Debes crear este archivo similar al paso 1)
import Step3Success from './steps/Step3Success'; // (Debes crear este archivo similar al paso 1)
import { FECHA_EVENTO, HORA_EVENTO } from '../../core/types';
import '../../styles/pages/ReservationForm.css';

const ReservationForm = ({ onNavigate }) => {
    // Aquí usamos nuestro Custom Hook "Cerebro"
    const { 
        step, data, loading, order, precio, isPreventa, totalPagar,
        handlePhoneChange, handleTextOnlyChange, handleChange, 
        nextStep, prevStep, submitOrder 
    } = useReservation();

    // Componentes auxiliares pequeños pueden quedar aquí o moverse también

    const EventInfoCard = () => (
        <div className="event-card">
            <h2 className="event-title">Gala Anual 2025 - Academia de Danza</h2>
            <div className="event-info-row">
                <span><span className="info-icon">📅</span> {FECHA_EVENTO}</span>
                <span><span className="info-icon">🕒</span> {HORA_EVENTO}</span>
            </div>
            
            {isPreventa && (
                <div className="preventa-alert">
                    <strong>🎉 ¡Preventa Activa!</strong><br/>
                    Precio especial: ${precio.toLocaleString('es-CL')} hasta el 18/12/2025
                </div>
            )}
        </div>
    );

    const Stepper = () => (
        <div className="stepper">
            <div className={`step-item ${step >= 1 ? 'step-bg-active' : 'step-bg-inactive'}`}>1</div>
            <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-item ${step >= 2 ? 'step-bg-active' : 'step-bg-inactive'}`}>2</div>
            <div className={`step-connector ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step-item ${step >= 3 ? 'step-bg-active' : 'step-bg-inactive'}`}>3</div>
        </div>
    );

    return (
        <div className="reserva-layout">
            <div className="portal-header">
                <span className="portal-title">Portal de Compra</span>
                <button className="btn-home" onClick={() => onNavigate('dashboard')}>🏠 Inicio</button>
            </div>

            <div className="portal-content">
                <EventInfoCard />
                <Stepper />

                <div className="form-card">
                    {step === 1 && (
                        <Step1BuyerData 
                            data={data}
                            handleText={handleTextOnlyChange}
                            handlePhone={handlePhoneChange}
                            handleChange={handleChange}
                            totalPagar={totalPagar}
                            precio={precio}
                            isPreventa={isPreventa}
                            onNext={nextStep}
                        />
                    )}

                    {step === 2 && (
                        // Asumiendo que crearás este componente
                        <Step2Payment 
                            data={data}
                            handleChange={handleChange}
                            onBack={prevStep}
                            onConfirm={submitOrder}
                            loading={loading}
                        />
                    )}

                    {step === 3 && (
                        // Asumiendo que crearás este componente
                        <Step3Success 
                            order={order}
                            buyerData={data}
                            onNavigate={onNavigate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;