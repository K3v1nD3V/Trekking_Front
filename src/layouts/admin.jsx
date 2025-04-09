import { Outlet } from 'react-router-dom';
import NavOption from '../components/common/NavOption';

const Admin = () => {
    
    return (
        <>
            <header>
                <div className="logosec">
                    <div className="logo">TrekkingSanCristobal</div>
                    {/* <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                        className="icn menuicn" 
                        id="menuicn" 
                        alt="menu-icon" /> */}
                </div>
            </header>

            <div className="main-container">z
            <div className="navcontainer">
                    <nav className="nav">
                        <div className="nav-upper-options">
                            
                            {/* Aqui van los links para las siguientes tablas, 
                            solo es crear otro Nav option y pasarle los datos como props
                            pueden repetir los iconos, depues se cambian por svgs*/}
                            
                            <NavOption
                                icon={<span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B'}}>dashboard</span>}
                                text="Dashboard"
                                to="/admin"
                            />
                            
                            <NavOption
                                 icon={<span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B'}}>package_2</span>}
                                text="Paquetes"
                                to="/admin/paquetes"
                            />
                            
                            <NavOption
                                icon={<span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B'}}>linked_services</span>}
                                text="Servicios"
                                to="/admin/servicios"
                            />


                            {/* de aqui para abajo van poniendo los siguientes links */}
                            
                            
                            <NavOption
                                    icon={
                                        <span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B' }}>
                                            person
                                        </span>
                                    }
                                    text="Clientes"
                                    to="/admin/clientes"
                                />

                            <NavOption
                                 icon={<span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B'}}>manage_accounts</span>}
                                text="Roles"
                                to="/admin/roles"
                            />

                            <NavOption
                                icon={<span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B' }}>admin_panel_settings</span>}                                text="Privilegios"
                                to="/admin/privilegios"
                            />


                                
                            <NavOption
                                 icon={<span className="material-symbols-outlined" style={{ fontSize: '35px', color: '#8B2B1B'}}>login</span>}
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
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#E5C9B3' }}>visibility</span>
                        </div>

                        <div className="box box2">
                            <div className="text">
                                <h2 className="topic-heading">150</h2>
                                <h2 className="topic">Likes</h2>
                            </div>
                            <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#E5C9B3' }}>thumb_up</span>
                        </div>

                        <div className="box box3">
                            <div className="text">
                                <h2 className="topic-heading">320</h2>
                                <h2 className="topic">Comments</h2>
                            </div>
                            <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#E5C9B3' }}>forum</span>

                        </div>

                        <div className="box box4">
                            <div className="text">
                                <h2 className="topic-heading">70</h2>
                                <h2 className="topic">Published</h2>
                            </div>
                            <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#E5C9B3' }}>check_circle</span>
                        </div>
                    </div>

                    <div className="report-container">
                        <Outlet />
                    </div> 
                </div>
            </div>
        </>
    );
};

export default Admin;
