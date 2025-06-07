import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getPaquetes } from '../../../api/paquetes'; // Asegúrate de importar esto
import '../../../css/components/landing/portafolio.css';

const Portafolio = () => {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]); // Ahora las imágenes vienen de la API
  const trackRef = useRef(null);

  // Cargar imágenes desde la base de datos
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const paquetes = await getPaquetes();
        // Extraer todas las imágenes de todos los paquetes
        const allImages = paquetes
          .flatMap(paquete => paquete.multimedia || [])
          .filter(url => !!url); // Filtra nulos/vacíos
        setImages(allImages);
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        setImages([]);
      }
    };
    fetchImages();
  }, []);

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
          <h1 className="portafolio-title">
            {t('portfolio.title')}
          </h1>
          <p className="portafolio-description">
            {t('portfolio.description')}
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
