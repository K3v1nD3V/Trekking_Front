import React, { useState } from 'react';
import '../../../css/components/admin/PaqueteFormStyles.css';
import { createVenta } from '../../../api/ventas';

const VentaForm = ({ onSubmit, clientes, paquetes }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    paquete: '',
    fecha: '',
    valor: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nuevaVenta = {
      id_cliente: formData.cliente,
      id_paquete: formData.paquete,
      fecha: new Date(formData.fecha).toISOString(), // Convertir la fecha al formato ISO
      valor: parseFloat(formData.valor)
    };
  
    try {
      console.log('Enviando venta:', nuevaVenta);
      await onSubmit(nuevaVenta); // Usa el callback que se pasa desde el componente padre
    } catch (error) {
      console.error('Error al crear venta:', error);
      alert('Error al crear la venta.');
    }
  };

  return (
    <form className="venta-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Cliente</label>
        <select name="cliente" value={formData.cliente} onChange={handleChange} required>
          <option value="">Selecciona un cliente</option>
          {clientes.map(c => (
            <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Paquete</label>
        <select name="paquete" value={formData.paquete} onChange={handleChange} required>
          <option value="">Selecciona un paquete</option>
          {paquetes.map(p => (
            <option key={p._id} value={p._id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fecha</label>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Valor</label>
        <input type="number" name="valor" value={formData.valor} onChange={handleChange} required />
      </div>

      <button type="submit" className="form-submit-button">
        Crear Venta
      </button>
    </form>
  );
};

export default VentaForm;
