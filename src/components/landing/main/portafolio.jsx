import React, { useEffect } from 'react';
import '../../../css/components/landing/portafolio.css';

const Portafolio = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }, []);

  return (
    <section className="portafolio-section" id="portfolio">
      <div className="portafolio-container">

        <div className="portafolio-text-content" data-animate>
          <h2 className="portafolio-title">Nuestro Portafolio</h2>
          <p className="portafolio-description">
            Cada imagen cuenta una historia, una aventura vivida y un recuerdo que permanece. 
            Explora algunos de nuestros momentos más memorables en la naturaleza.
          </p>
        </div>

        <div className="portafolio-gallery" data-animate>
        <div class="portfolio-container">
            <div class="portfolio-track">
                <img src="/public/Image/portafolio_1.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_2.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_3.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_4.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_5.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_6.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_7.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_8.jpeg" alt="Proyecto 1" />
                <img src="/public/Image/portafolio_9.jpeg" alt="Proyecto 1" />
            </div>
        </div>
        </div>

      </div>
      <div className="portafolio-separador" />
    </section>
  );
};

export default Portafolio;
