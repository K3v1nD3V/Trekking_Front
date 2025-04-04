import React from 'react';
import '../../../css/components/admin/PaqueteForm.css';

const PaqueteForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = React.useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    valor: initialData.valor || '',
    lugar_encuentro: initialData.lugar_encuentro || '',
    destino: initialData.destino || '',
    servicios: initialData.servicios || []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="paquete-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Valor</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lugar de Encuentro</label>
          <input
            type="text"
            name="lugar_encuentro"
            value={formData.lugar_encuentro}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Destino</label>
        <input
          type="text"
          name="destino"
          value={formData.destino}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="form-submit-button">
        {initialData.nombre ? 'Actualizar' : 'Crear'} Paquete
      </button>
    </form>
  );
};

export default PaqueteForm;
