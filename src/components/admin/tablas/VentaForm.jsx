import React, { useState } from 'react';
import '../../../css/components/admin/ventaForm.css';
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

  const [mostrarAcompanantes, setMostrarAcompanantes] = useState(false);

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

  const handleMostrarAcompanantes = () => {
    setMostrarAcompanantes(prev => !prev);
  };

  const toggleAcompanante = (id) => {
    setFormData((prev) => {
      const isSelected = prev.acompañantes.includes(id);
      const updatedAcompanantes = isSelected
        ? prev.acompañantes.filter((acompId) => acompId !== id)
        : [...prev.acompañantes, id];
      return { ...prev, acompañantes: updatedAcompanantes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hoyStr = new Date().toISOString().split('T')[0];
    if (formData.fecha !== hoyStr) {
      toast.error("Solo puedes registrar ventas con la fecha de hoy.");
      return;
    }

    // Mostrar confirmación antes de enviar
    const result = await showConfirm(
      '¿Quieres crear esta venta?',
      'Confirma la acción'
    );

    if (!result.isConfirmed) {
      // Usuario canceló la acción
      return;
    }

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
      onClose?.();
    } catch (error) {
      console.error('Error al crear venta:', error);
      toast.error('Error al crear la venta.');
    }       
  };

  const filteredClientes = clientes.filter(
    (cliente) => cliente._id !== formData.cliente
  );

  return (
    <form className="venta-form" onSubmit={handleSubmit}>

      {/* Cliente */}
      <div className="form-group">
        <label htmlFor="cliente">Cliente</label>
        <select
          id="cliente"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map(({ _id, nombre, apellido }) => (
            <option key={_id} value={_id}>
              {nombre} {apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Paquete */}
      <div className="form-group">
        <label htmlFor="paquete">Paquete</label>
        <select
          id="paquete"
          name="paquete"
          value={formData.paquete}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un paquete</option>
          {paquetes.map(({ _id, nombre }) => (
            <option key={_id} value={_id}>
              {nombre}
            </option>
          ))}
        </select>
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
          required
        />
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
          required
        />
      </div>

      {/* ¿Lleva acompañantes? */}
      <div className="form-group">
        <label>¿Lleva acompañantes?</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={mostrarAcompanantes}
            onChange={handleMostrarAcompanantes}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Lista de Acompañantes */}
      {mostrarAcompanantes && (
        <div className="form-group">
          <label>Acompañantes</label>
          <div className="acompanantes-grid">
            {filteredClientes
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map(({ _id, nombre, apellido }) => (
                <div key={_id} className="acompanante-card">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.acompañantes.includes(_id)}
                      onChange={() => toggleAcompanante(_id)}
                    />
                    {nombre} {apellido}
                  </label>
                </div>
              ))}
          </div>
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
  );
};

export default VentaForm;
