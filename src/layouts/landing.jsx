import React from 'react';
import Navbar from '../components/landing/header/navbar';
import Hero from '../components/landing/header/hero';
import SobreNosotros from '../components/landing/main/sobreNosotros'; 
import Servicios from '../components/landing/main/servicios';

const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <SobreNosotros />
            <Servicios/>
        </>
    );
};

export default Landing;
