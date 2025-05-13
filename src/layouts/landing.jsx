import React from 'react';
import Navbar from '../components/landing/header/navbar';
import Hero from '../components/landing/header/hero';
import SobreNosotros from '../components/landing/main/sobreNosotros'; 
import Servicios from '../components/landing/main/servicios';
import Portafolio from '../components/landing/main/portafolio';

const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Portafolio/>
            <Servicios/>
            <SobreNosotros />
        </>
    );
};

export default Landing;
