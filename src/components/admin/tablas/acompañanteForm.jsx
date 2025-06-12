import React, { useState, useEffect } from 'react';
import { createCliente, checkClienteExistence, getClientes } from '../../../api/clientes'; 

const AcompananteForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    observacion_medica: '',
    estado: true, 
  });

  const [errors, setErrors] = useState({}); // Estado para almacenar los errores

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(c =>
  `${c.id_usuario?.nombre || ''} ${c.id_usuario?.apellido || ''} ${c.id_usuario?.correo || ''} ${c.documento}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = async () => {
    const newErrors = {};

    // Validación de documento
    if (!formData.documento) {
      newErrors.documento = 'El documento es requerido.';
    } else if (formData.documento.length < 8 || formData.documento.length > 12) {
      newErrors.documento = 'El documento debe tener entre 8 y 12 caracteres.';
    } else if (!/^\d+$/.test(formData.documento)) {
      newErrors.documento = 'El documento debe contener solo números.';
    } else {
      // Verificar existencia del documento
      const exists = await checkClienteExistence({ documento: formData.documento });
      if (exists) {
        newErrors.documento = 'El documento ya está registrado.';
      }
    }

    // Validación de nombre
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido.';
    }

    // Validación de apellido
    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es requerido.';
    }

    // Validación de correo
    if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo debe tener un formato válido.';
    } else if (formData.correo) {
      // Verificar existencia del correo
      const exists = await checkClienteExistence({ correo: formData.correo });
      if (exists) {
        newErrors.correo = 'El correo ya está registrado.';
      }
    }

    // Validación de teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido.';
    } else if (!/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener solo números.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validate())) {
      return; // Detener el envío si hay errores
    }

    try {
      const {cliente} = await createCliente(formData);
      alert('Acompañante creado correctamente');
      console.log('Nuevo acompañante:', cliente);
      
      onSubmit(cliente);
      
    } catch (error) {
      alert('Error al crear acompañante: ' + error.message);
      console.error('Error en AcompananteForm:', error);
    }
  };

  const handleSelectSubmit = (e) => {
    e.preventDefault();
    if (selectedClienteId) {
      const cliente = clientes.find(c => c._id === selectedClienteId);
      if (cliente) {
        onSubmit(cliente); // Esto enviará el cliente seleccionado como acompañante
      }
    }
    // Si quieres permitir crear acompañantes manualmente, aquí iría esa lógica
  };

  return (
    <div>
      <form onSubmit={handleSelectSubmit}>
        <label>Buscar cliente existente:</label>
        <input
          type="text"
          placeholder="Nombre, apellido o documento"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={selectedClienteId}
          onChange={e => setSelectedClienteId(e.target.value)}
        >
          <option value="">Selecciona un cliente</option>
          {filteredClientes.map(cliente => (
            <option key={cliente._id} value={cliente._id}>
              {cliente.id_usuario?.nombre || ''} {cliente.id_usuario?.apellido || ''} - {cliente.documento}
            </option>
          ))}
        </select>
        <button className='button-acompanante' type="submit" disabled={!selectedClienteId}>
          Agregar como acompañante
        </button>
      </form>
      <form className="acompanante-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Documento</label>
          <input
            type="number"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
          />
          {errors.documento && <p className="form-error">{errors.documento}</p>}
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="number"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          {errors.telefono && <p className="form-error">{errors.telefono}</p>}
        </div>

        <div className="form-group">
          <label>Observación Médica</label>
          <textarea
            name="observacion_medica"
            value={formData.observacion_medica}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" className="form-submit-button">
          Crear Acompañante
        </button>
      </form>
    </div>
  );
};

export default AcompananteForm;