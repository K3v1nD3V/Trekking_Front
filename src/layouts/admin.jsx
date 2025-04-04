import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavOption from '../components/common/NavOption';
import TablaPaquetes from '../components/admin/tablas/paquetes';
import ServiciosTable from '../components/admin/tablas/servicios';

const Admin = () => {
    // Data de ejemplo, despues se hara consumo de la api
    const [paquetes] = useState([
        {
            nombre: 'Paquete Aventura',
            valor: 150000,
            descripcion: 'Tour de aventura en montaña',
            lugar_encuentro: 'Plaza Central',
            destino: 'Montaña del Tigre'
        },
        {
            nombre: 'Paquete Relax',
            valor: 200000,
            descripcion: 'Tour relajante en termales',
            lugar_encuentro: 'Terminal Norte',
            destino: 'Termales del Valle'
        }
    ]);

    const [servicios] = useState([
        {
            id: 1,
            nombre: 'Guía turístico',
            descripcion: 'Servicio de guía profesional',
            estado: true
        },
        {
            id: 2,
            nombre: 'Transporte',
            descripcion: 'Traslado a los lugares de interés',
            estado: true
        },
        {
            id: 3,
            nombre: 'Alimentación',
            descripcion: 'Comidas incluidas',
            estado: false
        }
    ]);
   
    return (
        <>
            {/* el header no se toca todavia, ignorenlo */}
            <header>
                <div className="logosec">
                    <div className="logo">GeeksForGeeks</div>
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                        className="icn menuicn" 
                        id="menuicn" 
                        alt="menu-icon" />
                </div>

                <div className="searchbar">
                    <input type="text" 
                        placeholder="Search" />
                    <div className="searchbtn">
                        <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                            className="icn srchicn" 
                            alt="search-icon" />
                    </div>
                </div>

                <div className="message">
                    <div className="circle"></div>
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png" 
                        className="icn" 
                        alt="" />
                    <div className="dp">
                        <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                            className="dpicn" 
                            alt="dp" />
                    </div>
                </div>
            </header>

            <div className="main-container">
            <div className="navcontainer">
                    <nav className="nav">
                        <div className="nav-upper-options">
                            
                            {/* Aqui van los links para las siguientes tablas, 
                            solo es crear otro Nav option y pasarle los datos como props
                            pueden repetir los iconos, depues se cambian por svgs*/}
                            
                            <NavOption
                                icon="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                                text="Dashboard"
                                to="/admin"
                            />
                            
                            <NavOption
                                icon="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                                text="Paquetes"
                                to="/admin/paquetes"
                            />
                            
                            <NavOption
                                icon="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/5.png"
                                text="Servicios"
                                to="/admin/servicios"
                            />

                            {/* de aqui para abajo van poniendo los siguientes links */}
                            
                            <NavOption
                                icon="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                                text="Logout"
                                to="/logout"
                                isLogout={true}
                            />
                        </div>
                    </nav>
                </div>
                
                <div className="main">
                    <div className="searchbar2">
                        <input type="text" 
                            name="" 
                            id="" 
                            placeholder="Search" />
                        <div className="searchbtn">
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                                className="icn srchicn" 
                                alt="search-button" />
                        </div>
                    </div>

                    <div className="box-container">
                        <div className="box box1">
                            <div className="text">
                                <h2 className="topic-heading">60.5k</h2>
                                <h2 className="topic">Article Views</h2>
                            </div>
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(31).png"
                                alt="Views" />
                        </div>

                        <div className="box box2">
                            <div className="text">
                                <h2 className="topic-heading">150</h2>
                                <h2 className="topic">Likes</h2>
                            </div>
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185030/14.png" 
                                alt="likes" />
                        </div>

                        <div className="box box3">
                            <div className="text">
                                <h2 className="topic-heading">320</h2>
                                <h2 className="topic">Comments</h2>
                            </div>
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
                                alt="comments" />
                        </div>

                        <div className="box box4">
                            <div className="text">
                                <h2 className="topic-heading">70</h2>
                                <h2 className="topic">Published</h2>
                            </div>
                            <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png" alt="published" />
                        </div>
                    </div>

                    {/* aqui se renderiza la tabla */}
                    <div className="report-container">
                        <Routes>
                            <Route index element={<TablaPaquetes data={paquetes} />} /> 

                            <Route path="paquetes" element={<TablaPaquetes data={paquetes} />} />
                            <Route path="servicios" element={<ServiciosTable data={servicios}/>} />
{/*siguiente route aqui-->*/}
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;
