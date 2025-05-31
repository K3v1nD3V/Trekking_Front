import React, { useState, useEffect, useRef } from 'react';
import '../../../css/components/landing/portafolio.css';

const Portafolio = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const duplicatedImages = [...images, ...images];
  const speed = 0.7;
  const totalWidth = images.length * 320;

  useEffect(() => {
    if (isPaused) return;
    let animationFrameId;

    const animate = () => {
      setOffset(prev => {
        let newOffset = prev + speed;
        return newOffset >= totalWidth ? 0 : newOffset;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, totalWidth]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const prevSlide = () => {
    setOffset(prev => {
      let newOffset = prev - 320;
      return newOffset < 0 ? totalWidth - 320 : newOffset;
    });
  };

  const nextSlide = () => {
    setOffset(prev => {
      let newOffset = prev + 320;
      return newOffset >= totalWidth ? 0 : newOffset;
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
          <div 
            className="carousel-container" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
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
                    onClick={() => setSelectedImage(src)}
                  />
                ))}
              </div>
            </div>

            <button className="carousel-btn next" onClick={nextSlide} aria-label="Siguiente">&#10095;</button>
          </div>
        </div>
      </div>

      {/* Modal para mostrar imagen ampliada */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Imagen ampliada" className="modal-image" />
          <button className="close-modal" onClick={() => setSelectedImage(null)}>✕</button>
        </div>
      )}
    </section>
  );
};

export default Portafolio;
