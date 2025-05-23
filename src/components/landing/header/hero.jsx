import React from 'react';
import '../../../css/components/landing/hero.css';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    Explora la <span> Naturaleza </span> con Trekking <span> San Cristóbal</span>
                </h1>
                <p className="hero-subtitle">
                    Descubre los mejores destinos y vive experiencias inolvidables en nuestras rutas de trekking.
                </p>
                <div className="hero-buttons">
                    <a href="#about" className="btn btn-primary">
                    <FaWhatsapp style={{ margin: 0, fontSize: '1.5rem' }} />Contactanos                    </a>
                    {/* <a href="#paquetes" className="btn  btn-outline">
                        Conoce Más <FaArrowRight />
                    </a> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
