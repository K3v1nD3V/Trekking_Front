import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../css/components/landing/hero.css';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    const { t } = useTranslation();
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 
                    className="hero-title"
                    dangerouslySetInnerHTML={{ __html: t('hero.title') }}
                />
                <p 
                    className="hero-subtitle"
                    dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }}
                />
                <div className="hero-buttons">
                    <a href="#about" className="btn btn-primary">
                        <FaWhatsapp style={{ margin: 0, fontSize: '1.5rem' }}/>
                        {t('hero.contact')}                  
                    </a>
                    {/* <a href="#paquetes" className="btn  btn-outline">
                        Conoce Más <FaArrowRight />
                    </a> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
