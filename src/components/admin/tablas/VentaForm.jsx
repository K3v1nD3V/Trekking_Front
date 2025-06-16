import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// CSS
import '../../../css/components/admin/ventaForm.css';
//MODAL
import Modal from '../../common/Modal';
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

    if (!formData.cliente) {
      newErrors.cliente = 'Debe seleccionar un cliente.';
    }

    if (!formData.paquete) {
      newErrors.paquete = 'Debe seleccionar un paquete.';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'Debe seleccionar una fecha.';
    } else {
      const hoyStr = new Date().toISOString().split('T')[0];
      if (formData.fecha > hoyStr) {
        newErrors.fecha = 'La fecha no puede ser futura.';
      }
    }

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

    if (!validate()) return;

    const result = await showConfirm(
      '¿Quieres crear esta venta?',
      'Confirma la acción'
    );

    if (!result.isConfirmed) return;

    const nuevaVenta = {
      id_cliente: formData.cliente,
      id_paquete: formData.paquete,
      fecha: new Date(formData.fecha).toISOString(),
      valor: parseFloat(formData.valor),
      acompañantes: formData.acompañantes.filter(id => id !== formData.cliente),
      estado: formData.estado,
    };

    try {
      await onSubmit(nuevaVenta);
      toast.success('¡Venta creada exitosamente!');
      onClose?.();
    } catch (error) {
      console.error('Error al crear venta:', error);
      toast.error('Error al crear la venta.');
    }
  };

  const handleSubmitAcompañante = (acompañante) => {
    if (acompañante._id === formData.cliente) {
      toast.error("El cliente no puede ser su propio acompañante.");
      return;
    }

    if (formData.acompañantes.includes(acompañante._id)) {
      toast.error("Este acompañante ya fue agregado.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      acompañantes: [...prev.acompañantes, acompañante._id],
    }));

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
      <form
        className="venta-form"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
      >
        {/* Cliente */}
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
            className={errors.cliente ? 'input-error' : ''}
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

        {/* Paquete */}
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
            className={errors.paquete ? 'input-error' : ''}
          >
            <option value="">Selecciona un paquete</option>
            {filteredPaquetes.map(({ _id, nombre }) => (
              <option key={_id} value={_id}>{nombre}</option>
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
            max={new Date().toISOString().split('T')[0]}
            className={errors.fecha ? 'input-error' : ''}
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
            className={errors.valor ? 'input-error' : ''}
          />
          {errors.valor && <p className="form-error">{errors.valor}</p>}
        </div>

        {/* Acompañante Switch */}
        <div className="form-group">
          <label>Agregar acompañante</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isAcompananteFormVisible}
              onChange={(e) => {
                if (!formData.cliente) {
                  toast.error("Primero selecciona un cliente.");
                  return;
                }
                setIsAcompananteFormVisible(e.target.checked);
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Lista de Acompañantes */}
        {acompañantesList.length > 0 && (
          <div className="form-group">
            <label>Acompañantes</label>
            <ul className="acompañantes-list">
              {acompañantesList.map((a, i) => (
                <li key={i} className="acompañante-item">
                  <span>{a.nombre}</span> - <span>{a.documento}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estado */}
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

        {/* Botones */}
        <button type="submit" className="form-submit-button">Registrar</button>
        <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
      </form>

      {/* Portal de Acompañantes */}
      {isAcompananteFormVisible &&
        ReactDOM.createPortal(
          <div className="acompanante-modal-content">
            <AcompananteForm onSubmit={handleSubmitAcompañante} />
          </div>,
          document.querySelector('.modal-overlay')
        )}
    </>
  );
};

export default VentaForm;
