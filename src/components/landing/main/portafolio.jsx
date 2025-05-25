import React, { useState, useEffect } from 'react';
import '../../../css/components/landing/portafolio.css';

const Portafolio = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/public/Image/portafolio_1.jpeg",
    "/public/Image/portafolio_2.jpeg",
    "/public/Image/portafolio_3.jpeg",
    "/public/Image/portafolio_4.jpeg",
    "/public/Image/portafolio_5.jpeg",
    "/public/Image/portafolio_6.jpeg",
    "/public/Image/portafolio_7.jpeg",
    "/public/Image/portafolio_8.jpeg",
    "/public/Image/portafolio_9.jpeg"
  ];

  // Para mostrar 3 imágenes visibles a la vez (puedes ajustar)
  const visibleCount = 3;

  // Controlar límite para no salir del array
  const maxIndex = images.length - visibleCount;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

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
          <h1 className="portafolio-title">Nuestro Portafolio</h1>
          <p className="portafolio-description">
            Cada imagen cuenta una historia, una aventura vivida y un recuerdo que permanece. 
            Explora algunos de nuestros momentos más memorables en la naturaleza.
          </p>
        </div>

        <div className="portafolio-gallery" data-animate>
          <div className="carousel-container">
            <button className="carousel-btn prev" onClick={prevSlide} aria-label="Anterior">&#10094;</button>

            <div className="carousel-track-wrapper">
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentIndex * (320)}px)`, // 300px image width + 20px margin
                  transition: 'transform 0.5s ease-in-out'
                }}
              >
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Proyecto ${i + 1}`}
                    className="carousel-image"
                  />
                ))}
              </div>
            </div>

            <button className="carousel-btn next" onClick={nextSlide} aria-label="Siguiente">&#10095;</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Portafolio;
