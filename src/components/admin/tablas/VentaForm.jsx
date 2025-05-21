import React, { useState } from 'react';
import '../../../css/components/admin/ventaForm.css';

const VentaForm = ({ onSubmit, clientes, paquetes }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    paquete: '',
    fecha: '',
    valor: '',
    acompañantes: [],
    estado: true,  // <-- Estado inicial
  });

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
  
  //Nueva funcion para manejar el cambio de los acompañantes
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

    // Validar fecha que sea hoy
    const hoyStr = new Date().toISOString().split('T')[0];
    if (formData.fecha !== hoyStr) {
      alert("Solo puedes registrar ventas con la fecha de hoy.");
      return;
    }

    const nuevaVenta = {
      id_cliente: formData.cliente,
      id_paquete: formData.paquete,
      fecha: new Date(formData.fecha).toISOString(),
      valor: parseFloat(formData.valor),
      acompañantes: formData.acompañantes.filter(id => id !== formData.cliente),
      estado: formData.estado,  // <-- Enviar estado
    };

    try {
      await onSubmit(nuevaVenta);
    } catch (error) {
      console.error('Error al crear venta:', error);
      alert('Error al crear la venta.');
    }
  };

  const filteredClientes = clientes.filter(
    (cliente) => cliente._id !== formData.cliente // Excluir al cliente principal
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

       {/* Acompañantes */}
      <div className="form-group">
        <label>Acompañantes</label>
        <div className="acompañantes-list">
          {filteredClientes.map(({ _id, nombre, apellido }) => (
            <div key={_id} className="acompañante-item">
              <input
                type="checkbox"
                id={`acompañante-${_id}`}
                checked={formData.acompañantes.includes(_id)}
                onChange={() => toggleAcompanante(_id)}
              />
              <label htmlFor={`acompañante-${_id}`}>
                {nombre} {apellido}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Acompañantes */}
      <div className="form-group">
        <label htmlFor="acompañantes">Acompañantes</label>
        <select
          multiple
          id="acompañantes"
          name="acompañantes"
          value={formData.acompañantes}
          onChange={handleChange}
        >
          {clientes
            .filter(c => c._id !== formData.cliente)
            .map(({ _id, nombre, apellido }) => (
              <option key={_id} value={_id}>
                {nombre} {apellido}
              </option>
            ))}
        </select>
      </div>

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

      {/* Botón */}
      <button type="submit" className="form-submit-button">
        Guardar Venta
      </button>
    </form>
  );
};

export default VentaForm;
