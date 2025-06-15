import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// CSS
import '../../../css/components/admin/ventaForm.css';
//MODAL
import Modal from '../../common/Modal';
// FORMULARIO DE ACOMPAÑANTE
import AcompananteForm from './acompañanteForm';
import { showConfirm } from '../../../alerts/alerts';
import { toast } from 'sonner';

const VentaForm = ({ onSubmit, clientes, paquetes, onClose }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    paquete: '',
    fecha: '',
    valor: '',
    acompañantes: [],
    estado: true,
  });

  const [acompañantesList, setAcompañantesList] = useState([]);
  const [isAcompananteFormVisible, setIsAcompananteFormVisible] = useState(false);
  const [clienteSearch, setClienteSearch] = useState(''); 
  const [paqueteSearch, setPaqueteSearch] = useState(''); 
  const [errors, setErrors] = useState({}); 

  const validate = () => {
    const newErrors = {};

    // Validación de cliente
    if (!formData.cliente) {
      newErrors.cliente = 'Debe seleccionar un cliente.';
    }

    // Validación de paquete
    if (!formData.paquete) {
      newErrors.paquete = 'Debe seleccionar un paquete.';
    }

    // Validación de fecha
    if (!formData.fecha) {
      newErrors.fecha = 'Debe seleccionar una fecha.';
    } else {
      const hoyStr = new Date().toISOString().split('T')[0];
      if (formData.fecha > hoyStr) {
        newErrors.fecha = 'La fecha no puede ser futura.';
      }
    }

    // Validación de valor
    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = 'El valor debe ser un número positivo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const hoyStr = new Date().toISOString().split('T')[0];
    // if (formData.fecha !== hoyStr) {
    //   toast.error("Solo puedes registrar ventas con la fecha de hoy.");
    //   return;
    // }

    // Mostrar confirmación antes de enviar
    const result = await showConfirm(
      '¿Quieres crear esta venta?',
      'Confirma la acción'
    );

    if (!result.isConfirmed) {
      // Usuario canceló la acción
      return;
    }
    if (!validate()) return;

    const nuevaVenta = {
      id_cliente: formData.cliente,
      id_paquete: formData.paquete,
      fecha: new Date(formData.fecha).toISOString(),
      valor: parseFloat(formData.valor),
      acompañantes: formData.acompañantes.filter(id => id !== formData.cliente),
      estado: formData.estado,
    };

    try {
      console.log('Nueva venta:', nuevaVenta);
    
      await onSubmit(nuevaVenta);  
    
      toast.success('¡Venta creada exitosamente!'); 
    
      onClose?.(); // ⬅️ luego cierras el formulario
    } catch (error) {
      console.error('Error al crear venta:', error);
      toast.error('Error al crear la venta.');
    }
           
  };
  
  const handleSubmitAcompañante = (acompañante) => {
    setFormData(prev => ({
      ...prev,
      acompañantes: [...prev.acompañantes, acompañante._id],
    }));
    console.log('acompañante submit: ', acompañante);
    
    setAcompañantesList(prev => [
      ...prev,
      { nombre: acompañante.id_usuario.nombre, documento: acompañante.documento },
    ]);

    setIsAcompananteFormVisible(false);
  };

  const filteredClientes = clientes.filter(cliente =>
  `${cliente.id_usuario?.nombre || ''} ${cliente.id_usuario?.apellido || ''} ${cliente.id_usuario?.correo || ''} ${cliente.documento}`.toLowerCase().includes(clienteSearch.toLowerCase())
);

  const filteredPaquetes = paquetes.filter(paquete =>
    paquete.nombre.toLowerCase().includes(paqueteSearch.toLowerCase())
  );

  return (
    <>
    <form className="venta-form" onSubmit={handleSubmit}>

      {/* Cliente con buscador */}
        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={clienteSearch}
            onChange={(e) => setClienteSearch(e.target.value)}
            className="cliente-search"
          />
          <select
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
          >
            <option value="">Selecciona un cliente</option>
            {filteredClientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.id_usuario?.nombre || ''} {cliente.id_usuario?.apellido || ''} - {cliente.documento}
              </option>
            ))}
          </select>
          {errors.cliente && <p className="form-error">{errors.cliente}</p>}
        </div>

      {/* Paquete con buscador */}
        <div className="form-group">
          <label htmlFor="paquete">Paquete</label>
          <input
            type="text"
            placeholder="Buscar paquete..."
            value={paqueteSearch}
            onChange={(e) => setPaqueteSearch(e.target.value)}
            className="paquete-search"
          />
          <select
            id="paquete"
            name="paquete"
            value={formData.paquete}
            onChange={handleChange}
          >
            <option value="">Selecciona un paquete</option>
            {filteredPaquetes.map(({ _id, nombre }) => (
              <option key={_id} value={_id}>
                {nombre}
              </option>
            ))}
          </select>
          {errors.paquete && <p className="form-error">{errors.paquete}</p>}
        </div>

      {/* Fecha */}
      <div className="form-group">
        <label htmlFor="fecha">Fecha</label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]} // <-- Limita a hoy
        />
        {errors.fecha && <p className="form-error">{errors.fecha}</p>}
      </div>

      {/* Valor */}
      <div className="form-group">
        <label htmlFor="valor">Valor</label>
        <input
          type="number"
          id="valor"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          />
         {errors.valor && <p className="form-error">{errors.valor}</p>}
      </div>

      {/* Switch para agregar acompañante */}
      <div className="form-group">
        <label>Agregar acompañante</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={isAcompananteFormVisible}
            onChange={(e) => setIsAcompananteFormVisible(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Lista de Acompañantes */}
      {acompañantesList.length > 0 && (
        <div className="form-group">
          <label>Acompañantes</label>
          <ul className="acompañantes-list">
            {acompañantesList.map((acompañante, index) => (
              <li key={index} className="acompañante-item">
                {console.log('acompañante: ', acompañante)}
                <span>{acompañante.nombre}</span> - <span>{acompañante.documento}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      
      {/* Estado como switch slider */}
      <div className="form-group">
        <label>Estado</label>
        <label className="switch">
          <input
            type="checkbox"
            name="estado"
            checked={formData.estado}
            onChange={handleCheckboxChange}
            />
          <span className="slider round"></span>
        </label>
      </div>

      <button type="submit" className="form-submit-button">
        Registrar
      </button>
      <button
        type="button"
        className="cancel-btn"
        onClick={onClose}
      >
        Cancelar
      </button>
    </form>

    {/* Formulario de acompañantes como portal */}
    {isAcompananteFormVisible &&
        ReactDOM.createPortal(
          <div className="acompanante-modal-content">
            <AcompananteForm onSubmit={handleSubmitAcompañante} />
          </div>,
          document.querySelector('.modal-overlay') // Renderiza como hijo del modal-overlay
        )}
    </>
  );
};

export default VentaForm;
