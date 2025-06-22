import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../../css/components/admin/ventaForm.css';
import Modal from '../../common/Modal';
import { showConfirm } from '../../../alerts/alerts';
import { toast } from 'sonner';

const VentaForm = ({ onSubmit, clientes, paquetes, tours, onClose }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    paquete: '',
    tour: '',
    fecha: '',
    valor: '',
    acompañantes: [],
    estado: true,
  });

  const [acompañantesList, setAcompañantesList] = useState([]);
  const [nuevoAcompananteVisible, setNuevoAcompananteVisible] = useState(false);
  const [nuevoAcompanante, setNuevoAcompanante] = useState({ nombre: '', apellido: '', documento: '' });
  const [clienteNombre, setClienteNombre] = useState('');
  const [paqueteNombre, setPaqueteNombre] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.cliente) newErrors.cliente = 'Debe seleccionar un cliente.';
    if (!formData.paquete) newErrors.paquete = 'Debe seleccionar un paquete.';
    if (!formData.tour) newErrors.tour = 'Debe seleccionar un tour.';
    if (!formData.fecha) newErrors.fecha = 'Debe seleccionar una fecha.';
    else if (formData.fecha > new Date().toISOString().split('T')[0]) newErrors.fecha = 'La fecha no puede ser futura.';
    if (!formData.valor || formData.valor <= 0) newErrors.valor = 'El valor debe ser un número positivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await showConfirm('¿Quieres crear esta venta?', 'Confirma la acción');
    if (!result.isConfirmed) return;
    const nuevaVenta = {
      id_cliente: formData.cliente,
      id_paquete: formData.paquete,
      id_tour: formData.tour,
      fecha: formData.fecha , // string "YYYY-MM-DD", tal como lo espera el backend
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

  const agregarNuevoAcompanante = () => {
    const idTemporal = `nuevo-${Date.now()}`;
    const nuevo = { _id: idTemporal, id_usuario: { nombre: nuevoAcompanante.nombre, apellido: nuevoAcompanante.apellido }, documento: nuevoAcompanante.documento };
    setFormData(prev => ({ ...prev, acompañantes: [...prev.acompañantes, idTemporal] }));
    setAcompañantesList(prev => ([...prev, { nombre: `${nuevoAcompanante.nombre} ${nuevoAcompanante.apellido}`, documento: nuevoAcompanante.documento }]));
    setNuevoAcompananteVisible(false);
    setNuevoAcompanante({ nombre: '', apellido: '', documento: '' });
  };

  return (
    <>
      <form className="venta-form" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
        <div className="form-group">
          <label>Cliente</label>
          <input
            list="clientes"
            value={clienteNombre}
            onChange={(e) => {
              setClienteNombre(e.target.value);
              const encontrado = clientes.find(c => `${c.id_usuario?.nombre} ${c.id_usuario?.apellido} - ${c.documento}` === e.target.value);
              if (encontrado) setFormData(prev => ({ ...prev, cliente: encontrado._id }));
            }}
            placeholder="Escribe el nombre o documento"
            className={errors.cliente ? 'input-error' : ''}
          />
          <datalist id="clientes">
            {clientes.map(c => (
              <option key={c._id} value={`${c.id_usuario?.nombre} ${c.id_usuario?.apellido} - ${c.documento}`} />
            ))}
          </datalist>
          {errors.cliente && <p className="form-error">{errors.cliente}</p>}
        </div>

        <div className="form-group">
          <label>Paquete</label>
          <input
            list="paquetes"
            value={paqueteNombre}
            onChange={(e) => {
              setPaqueteNombre(e.target.value);
              const encontrado = paquetes.find(p => p.nombre === e.target.value);
              if (encontrado) setFormData(prev => ({ ...prev, paquete: encontrado._id }));
            }}
            placeholder="Escribe el nombre del paquete"
            className={errors.paquete ? 'input-error' : ''}
          />
          <datalist id="paquetes">
            {paquetes.map(p => <option key={p._id} value={p.nombre} />)}
          </datalist>
          {errors.paquete && <p className="form-error">{errors.paquete}</p>}
        </div>

        <div className="form-group">
          <label>Tour</label>
          <select name="tour" value={formData.tour} onChange={handleChange} className={errors.tour ? 'input-error' : ''}>
            <option value="">Selecciona un tour</option>
            {Array.isArray(tours) && tours.map(({ _id, fechaHora, id_paquete }) => {
              const paquete = paquetes.find(p => p._id === (id_paquete?._id || id_paquete));
              return (
                <option key={_id} value={_id}>
                  {new Date(fechaHora).toLocaleString()} - {paquete?.nombre || 'Paquete desconocido'}
                </option>
              );
            })}
          </select>
          {errors.tour && <p className="form-error">{errors.tour}</p>}
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className={errors.fecha ? 'input-error' : ''} />
          {errors.fecha && <p className="form-error">{errors.fecha}</p>}
        </div>

        <div className="form-group">
          <label>Valor</label>
          <input type="number" name="valor" value={formData.valor} onChange={handleChange} className={errors.valor ? 'input-error' : ''} />
          {errors.valor && <p className="form-error">{errors.valor}</p>}
        </div>

        <div className="form-group">
          <label>Acompañantes</label>
          <input
            list="acompanantes"
            placeholder="Buscar acompañante"
            onChange={(e) => {
              const seleccionado = clientes.find(c => `${c.id_usuario?.nombre} ${c.id_usuario?.apellido} - ${c.documento}` === e.target.value);
              if (seleccionado && seleccionado._id !== formData.cliente) {
                if (!formData.acompañantes.includes(seleccionado._id)) {
                  setFormData(prev => ({ ...prev, acompañantes: [...prev.acompañantes, seleccionado._id] }));
                  setAcompañantesList(prev => ([...prev, { nombre: `${seleccionado.id_usuario?.nombre} ${seleccionado.id_usuario?.apellido}`, documento: seleccionado.documento }]));
                } else {
                  toast.error("Este acompañante ya fue agregado.");
                }
              } else if (seleccionado?._id === formData.cliente) {
                toast.error("El cliente no puede ser su propio acompañante.");
              }
            }}
          />
          <datalist id="acompanantes">
            {clientes.filter(c => c._id !== formData.cliente).map(c => (
              <option key={c._id} value={`${c.id_usuario?.nombre} ${c.id_usuario?.apellido} - ${c.documento}`} />
            ))}
          </datalist>
          <button type="button" onClick={() => setNuevoAcompananteVisible(true)} className="small-btn">+ Nuevo acompañante</button>
        </div>

        {nuevoAcompananteVisible && (
          <div className="form-group">
            <label>Nuevo Acompañante</label>
            <input
              placeholder="Nombre"
              value={nuevoAcompanante.nombre}
              onChange={(e) => setNuevoAcompanante(prev => ({ ...prev, nombre: e.target.value }))}
            />
            <input
              placeholder="Apellido"
              value={nuevoAcompanante.apellido}
              onChange={(e) => setNuevoAcompanante(prev => ({ ...prev, apellido: e.target.value }))}
            />
            <input
              placeholder="Documento"
              value={nuevoAcompanante.documento}
              onChange={(e) => setNuevoAcompanante(prev => ({ ...prev, documento: e.target.value }))}
            />
            <button type="button" onClick={agregarNuevoAcompanante} className="small-btn">Agregar</button>
          </div>
        )}

        {acompañantesList.length > 0 && (
          <div className="form-group">
            <ul className="acompañantes-list">
              {acompañantesList.map((a, i) => (
                <li key={i} className="acompañante-item">
                  <span>{a.nombre}</span> - <span>{a.documento}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-group">
          <label>Estado</label>
          <label className="switch">
            <input type="checkbox" name="estado" checked={formData.estado} onChange={handleCheckboxChange} />
            <span className="slider round"></span>
          </label>
        </div>

        <button type="submit" className="form-submit-button">Registrar</button>
        <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
      </form>
    </>
  );
};

export default VentaForm;
