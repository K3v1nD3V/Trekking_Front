import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../css/components/landing/hero.css';
import { FaWhatsapp } from 'react-icons/fa';

// Importa las imágenes
import img1 from '../../../assets/image/sobre_nosotros_2.jpg';
import img2 from '../../../assets/image/sobre_nosotros_4.jpg';
import img3 from '../../../assets/image/sobre_nosotros_5.jpg';
import img4 from '../../../assets/image/sobre_nosotros_6.jpg';
import img5 from '../../../assets/image/sobre_nosotros_3.jpg';

const Hero = () => {
    const { t } = useTranslation();
    
    const images = [img1, img2, img3, img4, img5];

    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-text">
                    <h1 
                        className="hero-title"
                        dangerouslySetInnerHTML={{ __html: t('hero.title') }}
                    />
                    <p 
                        className="hero-subtitle"
                        dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }}
                    />
                    <div className="hero-buttons">
                        <a href="#about" className="btn btn-primary btn-whatsapp">
                            <FaWhatsapp style={{ margin: 0, fontSize: '1.5rem' }}/>
                            {t('hero.contact')}                  
                        </a>
                    </div>
                </div>
                <div className="hero-gallery">
                    <div className="gallery-grid">
                        {images.map((src, index) => (
                            <img key={index} src={src} alt={`gallery-img-${index}`} className={`gallery-img ${index === 0 ? 'tall' : ''}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
