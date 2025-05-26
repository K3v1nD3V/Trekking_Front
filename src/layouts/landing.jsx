import React from 'react';
import Navbar from '../components/landing/header/navbar';
import Hero from '../components/landing/header/hero';
import SobreNosotros from '../components/landing/main/sobreNosotros'; 
import Servicios from '../components/landing/main/servicios';
import Portafolio from '../components/landing/main/portafolio';
import Footer from '../components/landing/footer/footer'

import Paquetes from '../components/landing/main/paquetes';
const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Paquetes/>
            <Portafolio/>
            <Servicios/>
            <SobreNosotros />
            <Footer/>
        </>
    );
};

export default Landing;
