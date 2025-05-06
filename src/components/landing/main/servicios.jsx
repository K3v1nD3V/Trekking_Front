import React from 'react';
import { FaHeartbeat, FaPaw, FaBus, FaUtensils, FaCamera, FaUser } from 'react-icons/fa'; 
import '../../../css/components/landing/servicios.css';

const Servicios = () => {
  return (
    <section className="servicios-section" id="servicios">
      <div className="servicios-container">
        <h2 className="servicios-title">Nuestros Servicios</h2>
        <div className="servicios-grid">
          <div className="servicio-card">
            <FaHeartbeat className="servicio-icon" />
            <h3>Seguro Médico</h3>
            <p>Contamos con un seguro médico para que disfrutes de tus recorridos con total tranquilidad.</p>
          </div>
          <div className="servicio-card">
            <FaPaw className="servicio-icon" />
            <h3>Pet Friendly</h3>
            <p>Tu compañero de cuatro patas también es bienvenido en nuestras rutas. ¡Trae a tu mascota!</p>
          </div>
          <div className="servicio-card">
            <FaBus className="servicio-icon" />
            <h3>Transporte</h3>
            <p>Ofrecemos transporte seguro y cómodo para que llegues a tus destinos sin preocupaciones.</p>
          </div>
          <div className="servicio-card">
            <FaUtensils className="servicio-icon" />
            <h3>Alimentación</h3>
            <p>Disfruta de alimentos saludables y deliciosos en medio de la naturaleza, pensados para tu energía.</p>
          </div>
          <div className="servicio-card">
            <FaUser className="servicio-icon" />
            <h3>Guianza</h3>
            <p>Explora con nuestros guías expertos, quienes te brindarán conocimientos y apoyo durante el recorrido.</p>
          </div>
          <div className="servicio-card">
            <FaCamera className="servicio-icon" />
            <h3>Registro Fotográfico</h3>
            <p>Captura los momentos más especiales de tu aventura con nuestro servicio de fotografía profesional.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Servicios;
