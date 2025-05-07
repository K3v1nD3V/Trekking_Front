import React from 'react';
import '../../../css/components/landing/paquetes.css';

const Paquetes = () => {
    return (
        <section className="paquetes">
            <div className="actual-paquete">
                <img src="https://th.bing.com/th/id/OIP.Dscurjy-Cfn0a-kMcgxxXAHaG9?cb=iwp1&rs=1&pid=ImgDetMain" alt="un bosque" />
                <div className="paquete-info">
                    <h2 className="paquete-title">Paquete 1</h2>
                    <p className="paquete-location">Ubicación: Bosque Encantado</p>
                    <p className="paquete-date">Fecha: 2023-10-01</p>
                    <p className="paquete-hour">Hora: 2:00 pm</p>
                    <p className="paquete-description">Descripción del paquete 1. Este paquete incluye una experiencia única en la naturaleza.</p>
                    <p className="paquete-price">$100</p>
                    <a href="#" className="btn btn-primary">Contactanos ahora</a>
                </div>
            </div>
            <div className="paquete-list">
                <h2 className="paquete-list-title">Otros Paquetes</h2>
                <div className="paquete-items">
                    <div className="paquete-item">
                        <img src="https://th.bing.com/th/id/OIP.Dscurjy-Cfn0a-kMcgxxXAHaG9?cb=iwp1&rs=1&pid=ImgDetMain" alt="un bosque" />
                        <div className="paquete-item-info">
                            <h3 className="paquete-item-title">Paquete 2</h3>
                            <p className="paquete-item-location">Ubicación: Montañas Mágicas</p>
                            <p className="paquete-item-price">$150</p>
                        </div>
                    </div>
                    <div className="paquete-item">
                        <img src="https://th.bing.com/th/id/OIP.Dscurjy-Cfn0a-kMcgxxXAHaG9?cb=iwp1&rs=1&pid=ImgDetMain" alt="un bosque" />
                        <div className="paquete-item-info">
                            <h3 className="paquete-item-title">Paquete 3</h3>
                            <p className="paquete-item-location">Ubicación: Valle Escondido</p>
                            <p className="paquete-item-price">$120</p>
                        </div>
                    </div>
                    <div className="paquete-item">
                        <img src="https://th.bing.com/th/id/OIP.Dscurjy-Cfn0a-kMcgxxXAHaG9?cb=iwp1&rs=1&pid=ImgDetMain" alt="un bosque" />
                        <div className="paquete-item-info">
                            <h3 className="paquete-item-title">Paquete 3</h3>
                            <p className="paquete-item-location">Ubicación: Valle Escondido</p>
                            <p className="paquete-item-price">$120</p>
                        </div>
                    </div>
                    <div className="paquete-item">
                        <img src="https://th.bing.com/th/id/OIP.Dscurjy-Cfn0a-kMcgxxXAHaG9?cb=iwp1&rs=1&pid=ImgDetMain" alt="un bosque" />
                        <div className="paquete-item-info">
                            <h3 className="paquete-item-title">Paquete 3</h3>
                            <p className="paquete-item-location">Ubicación: Valle Escondido</p>
                            <p className="paquete-item-price">$120</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Paquetes;