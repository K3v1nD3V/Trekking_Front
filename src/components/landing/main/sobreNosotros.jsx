import React, { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../../../css/components/landing/sobreNosotros.css';

const SobreNosotros = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }, []);

  return (
    <section className="sobre-nosotros-section" id="about">
      <div className="sobre-nosotros-container">

        <div className="sobre-nosotros-gallery" data-animate>
          <div className="gallery-grid">
            <img src="/src/assets/image/sobre_nosotros_2.jpg" alt="Senderismo en bosque" className="gallery-img tall" />
            <img src="/src/assets/image/sobre_nosotros_4.jpg" alt="Guía explicando" className="gallery-img" />
            <img src="/src/assets/image/sobre_nosotros_5.jpg" alt="Caminantes felices" className="gallery-img" />
            <img src="/src/assets/image/sobre_nosotros_6.jpg" alt="Naturaleza vibrante" className="gallery-img" />
            <img src="/src/assets/image/sobre_nosotros_3.jpg" alt="Naturaleza vibrante" className="gallery-img" />
          </div>
        </div>

        <div className="sobre-nosotros-text-content" data-animate>
          <h1 className="sobre-nosotros-title">Sobre Nosotros</h1>
          <p className="sobre-nosotros-highlight">
            “Cada sendero recorrido es una historia que escribimos juntos en conexión con la tierra y el alma.”
          </p>
          <p className="sobre-nosotros-text">
            En <strong>Trekking San Cristóbal</strong> cada ruta es una invitación a reconectar con lo esencial: 
            la naturaleza, el silencio interior y el poder de lo simple. Nuestros caminos por las montañas y rincones
            ocultos de Antioquia despiertan sentidos, liberan el estrés y llenan el alma de vida auténtica.
          </p>
          <p className="sobre-nosotros-text">
          Aquí no solo recorres paisajes <strong> los sientes, los vives, los llevas contigo.</strong> Cada experiencia está diseñada para transformar tu día, tu mente y tu energía. Si buscas más que una caminata, 
          si deseas un momento real contigo mismo y con quienes comparten la pasión por lo natural, este es tu lugar.
          </p>
          {/* <a
            href="https://wa.me/573001234567?text=Hola%20Trekking%20San%20Cristóbal,%20quiero%20más%20información%20sobre%20las%20rutas%20de%20senderismo."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <FaWhatsapp /> Contáctanos
          </a> */}
        </div>

      </div>

    </section>
  );
};

export default SobreNosotros;
