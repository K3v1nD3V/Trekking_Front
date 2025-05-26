import React from 'react';
// Components
import Navbar from '../components/landing/header/navbar';
import Hero from '../components/landing/header/hero';
import SobreNosotros from '../components/landing/main/sobreNosotros'; 
import Servicios from '../components/landing/main/servicios';
import Portafolio from '../components/landing/main/portafolio';
// import Footer from '../components/landing/footer/footer'
import { AuthProvider } from '../context/AuthContext';

import Paquetes from '../components/landing/main/paquetes';

const Landing = () => {

    return (
        <>
            <AuthProvider>
                <Navbar />
            </AuthProvider>
            <Hero />
            <Paquetes/>
            <Portafolio/>
            <Servicios/>
            <SobreNosotros />
            {/* <Footer/> */}
        </>
    );
};

export default Landing;
