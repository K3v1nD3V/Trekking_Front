import React from 'react';
import '../../css/components/cliente/cliente.css';

const ClienteMain = () => {
    return (
        <main className="cliente-main">
            <div className="cliente-compra">
                <h1 className='compra-nombre'>Nombre Paquete</h1>
                <div className='compra-tour-horario'>
                    <p className='tour-horario-fecha'>12/05/25</p>
                    <p className='tour-horario-hora'>1:50 pm</p>
                </div>
                <div className='tour-lugar-encuentro'>
                    <p>Lugar de encuentro: </p>
                    <p>terminar del norte</p>
                </div>
                <div className='container-btn'>
                    <button className='btn btn-primary'>Ver detalles</button>
                </div>
            </div>
        </main>
    );
};

export default ClienteMain;