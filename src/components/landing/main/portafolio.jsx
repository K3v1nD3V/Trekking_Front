import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../css/components/landing/portafolio.css';

const Portafolio = () => {
  const { t } = useTranslation();
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
          <h2 className="portafolio-title">
            {t('portfolio.title')}
          </h2>
          <p className="portafolio-description">
            {t('portfolio.description')}
          </p>
        </div>

        <div className="portafolio-gallery" data-animate>
        <div className="portfolio-container">
            <div className="portfolio-track">
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
    </section>
  );
};

export default Portafolio;
