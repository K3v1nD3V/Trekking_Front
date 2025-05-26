import React, { useState, useEffect, useRef } from 'react';
import '../../../css/components/landing/portafolio.css';

const Portafolio = () => {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

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

  // Duplicamos las imágenes para el efecto infinito
  const duplicatedImages = [...images, ...images];

  // Velocidad en px por frame (ajusta para más rápido o lento)
  const speed = 0.7;

  // Estado para controlar el desplazamiento en px
  const [offset, setOffset] = useState(0);

  // Ancho total de las imágenes originales (un set)
  const totalWidth = images.length * 320; // 300px ancho + 20px margin

  // Función de animación que actualiza el offset continuamente
  useEffect(() => {
    if (isPaused) return;

    let animationFrameId;

    const animate = () => {
      setOffset(prev => {
        let newOffset = prev + speed;
        if (newOffset >= totalWidth) {
          // Cuando llegamos al ancho total, reseteamos para que parezca infinito
          return 0;
        }
        return newOffset;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, totalWidth]);

  // Eventos para pausar y reanudar al hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Funciones para controlar con flechas (ajustar offset)
  const prevSlide = () => {
    setOffset((prev) => {
      let newOffset = prev - 320;
      if (newOffset < 0) {
        return totalWidth - 320;
      }
      return newOffset;
    });
  };

  const nextSlide = () => {
    setOffset((prev) => {
      let newOffset = prev + 320;
      if (newOffset >= totalWidth) {
        return 0;
      }
      return newOffset;
    });
  };

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
          <div className="carousel-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="carousel-btn prev" onClick={prevSlide} aria-label="Anterior">&#10094;</button>

            <div className="carousel-track-wrapper">
              <div
                className="carousel-track"
                ref={trackRef}
                style={{
                  transform: `translateX(-${offset}px)`,
                  transition: isPaused ? 'transform 0.3s ease' : 'none'
                }}
              >
                {duplicatedImages.map((src, i) => (
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
