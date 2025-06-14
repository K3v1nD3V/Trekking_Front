import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FaWhatsapp } from 'react-icons/fa';
import '../../../css/components/landing/sobreNosotros.css';

// Importa las imágenes
import img1 from '../../../assets/image/sobre_nosotros_2.jpg';
import img2 from '../../../assets/image/sobre_nosotros_4.jpg';
import img3 from '../../../assets/image/sobre_nosotros_5.jpg';
import img4 from '../../../assets/image/sobre_nosotros_6.jpg';
import img5 from '../../../assets/image/sobre_nosotros_3.jpg';

const SobreNosotros = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }, []);

  const images = [img1, img2, img3, img4, img5];

  return (
    <section className="sobre-nosotros-section" id="about">
      <div className="sobre-nosotros-container">

        <div className="sobre-nosotros-gallery" data-animate>
          <div className="gallery-grid">
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`sobre-nosotros-img-${idx}`}
                className={`gallery-img${idx === 0 ? ' tall' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="sobre-nosotros-text-content" data-animate>
          <h2 className="sobre-nosotros-title">
            {t('about.title')}
          </h2>
          <p className="sobre-nosotros-highlight">
            {t('about.highlight')}
          </p>
          <p className="sobre-nosotros-text" 
            dangerouslySetInnerHTML={{ __html: t('about.text1') }}
          />
          <p className="sobre-nosotros-text"
            dangerouslySetInnerHTML={{ __html: t('about.text2') }}
          />
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
