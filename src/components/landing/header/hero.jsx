import React from 'react';
import '../../../css/components/landing/hero.css';
import { FaHiking, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    Explora la Naturaleza con <span>Trekking San Cristóbal</span>
                </h1>
                <p className="hero-subtitle">
                    Descubre los mejores destinos y vive experiencias inolvidables en nuestras rutas de trekking.
                </p>
                <div className="hero-buttons">
                    <a href="#paquetes" className="btn btn-primary">
                        <FaHiking /> Ver Paquetes
                    </a>
                    <a href="#about" className="btn btn-outline">
                        Conoce Más <FaArrowRight />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;