import React from 'react';      
import Navbar from '../components/landing/header/navbar';
import Hero from '../components/landing/header/hero';
import Paquetes from '../components/landing/main/paquetes';
const Landing = () => {
    
    return (
        <>
            <Navbar/>
            <Hero/>
            <Paquetes/>
        </>
    );
};

export default Landing;
