import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
/* Importar estilos globales */
import './css/global/variables.css'
import './css/global/base.css'
/* Importar estilos de componentes */
import './css/components/tables.css'
import './css/components/admin/paquetes.css'
import './css/components/admin/cliente.css'
import './css/components/admin/privilegio.css'


/* Importar estilos de layouts */
import './css/layouts/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
