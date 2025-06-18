import { useState, useEffect } from 'react';
import { createCliente, updateCliente, checkClienteExistence } from '../../../api/clientes';
import { getUsuarios, updateUsuario } from '../../../api/usuarios';
import '../../../css/components/admin/ClienteForm.css';
import { showConfirm } from '../../../alerts/alerts';
import { toast } from 'sonner';

const ClienteForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    documento: initialData.documento || '',
    telefono: initialData.telefono || '',
    observacion_medica: initialData.observacion_medica || '',
    estado: initialData.estado ?? true,
    id_usuario: initialData.id_usuario?._id || initialData.id_usuario || '',
  });

  const [usuarioData, setUsuarioData] = useState({
    nombre: initialData.id_usuario?.nombre || '',
    apellido: initialData.id_usuario?.apellido || '',
    correo: initialData.id_usuario?.correo || '',
  });

  const [originalFormData] = useState(formData);
  const [originalUsuarioData] = useState(usuarioData);
  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data?.data || data || []);
      } catch (err) {
        console.log('Error al cargar usuarios:', err);
        toast.error('Error al cargar usuarios');
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (formData.id_usuario && usuarios.length) {
      const usuario = usuarios.find(u => u._id === formData.id_usuario);
      setUsuarioData({
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        correo: usuario?.correo || '',
      });
    }
  }, [formData.id_usuario, usuarios]);

  const handleClienteChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuarioData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = async () => {
    const newErrors = {};

    if (!formData.documento) {
      newErrors.documento = 'El documento es requerido.';
    } else if (formData.documento.length < 8 || formData.documento.length > 12) {
      newErrors.documento = 'Debe tener entre 8 y 12 dígitos.';
    } else if (!/^\d+$/.test(formData.documento)) {
      newErrors.documento = 'Debe contener solo números.';
    } else {
      const exists = await checkClienteExistence({ documento: formData.documento });
      if (exists && (!initialData._id || formData.documento !== initialData.documento)) {
        newErrors.documento = 'Ya está registrado.';
      }
    }

    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido.';
    } else if (!/^\d{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = 'Debe tener entre 7 y 15 dígitos numéricos.';
    }

    if (!formData.id_usuario) {
      newErrors.id_usuario = 'Debe seleccionar un usuario.';
    }

    if (!usuarioData.nombre) {
      newErrors.nombre = 'El nombre es requerido.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuarioData.nombre)) {
      newErrors.nombre = 'Solo se permiten letras y espacios.';
    }

    if (!usuarioData.apellido) {
      newErrors.apellido = 'El apellido es requerido.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(usuarioData.apellido)) {
      newErrors.apellido = 'Solo se permiten letras y espacios.';
    }

    if (!usuarioData.correo) {
      newErrors.correo = 'El correo es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuarioData.correo)) {
      newErrors.correo = 'El formato de correo no es válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isModified = () => {
    const clienteModificado =
      originalFormData.documento !== formData.documento ||
      originalFormData.telefono !== formData.telefono ||
      originalFormData.observacion_medica !== formData.observacion_medica ||
      originalFormData.estado !== formData.estado;

    const usuarioModificado =
      originalUsuarioData.nombre !== usuarioData.nombre ||
      originalUsuarioData.apellido !== usuarioData.apellido ||
      originalUsuarioData.correo !== usuarioData.correo;

    return clienteModificado || usuarioModificado;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validate())) return;

    if (initialData._id && !isModified()) {
      toast.error('No se han realizado cambios en el formulario.');
      return;
    }

    const confirmResult = await showConfirm(
      initialData._id ? '¿Confirmas actualizar este cliente?' : '¿Confirmas crear este cliente?',
      'Confirmación'
    );
    if (!confirmResult.isConfirmed) return;

    try {
      if (initialData._id) {
        const usuarioOriginal = initialData.id_usuario || {};
        const usuarioModificado =
          usuarioOriginal.nombre !== usuarioData.nombre ||
          usuarioOriginal.apellido !== usuarioData.apellido ||
          usuarioOriginal.correo !== usuarioData.correo;

        if (usuarioModificado) {
          await updateUsuario(formData.id_usuario, usuarioData);
        }

        const clienteActualizado = await updateCliente(initialData._id, formData);
        toast.success('Cliente actualizado exitosamente!');
        setTimeout(() => {
          onSubmit(clienteActualizado, "edit");
          onClose();
        }, 900);
      } else {
        const clienteCreado = await createCliente(formData);
        toast.success('Cliente creado exitosamente!');
        setTimeout(() => {
          onSubmit(clienteCreado, "create");
          onClose();
        }, 900);
      }
    } catch (err) {
      console.error('Error al guardar el cliente:', err);
      toast.error('Error al guardar el cliente. Verifica los datos o intenta más tarde.');
    }
  };

    return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Documento</label>
        <input
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleClienteChange}
        />
        {errors.documento && <p className="form-error">{errors.documento}</p>}
      </div>
      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleClienteChange}
        />
        {errors.telefono && <p className="form-error">{errors.telefono}</p>}
      </div>
      <div className="form-group">
        <label>Observación Médica</label>
        <textarea
          name="observacion_medica"
          value={formData.observacion_medica}
          onChange={handleClienteChange}
          rows="3"
        />
      </div>
      <div className="form-group">
        <label>Usuario Asociado</label>
        <select
          name="id_usuario"
          value={formData.id_usuario}
          onChange={handleClienteChange}
          disabled={!!initialData._id} // No permitir cambiar usuario al editar
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map(usuario => (
            <option key={usuario._id} value={usuario._id}>
              {usuario.nombre} {usuario.apellido} - {usuario.correo}
            </option>
          ))}
        </select>
        {errors.id_usuario && <p className="form-error">{errors.id_usuario}</p>}
      </div>
      {/* Campos de usuario */}
      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={usuarioData.nombre}
          onChange={handleUsuarioChange}
          disabled={!formData.id_usuario}
        />
        {errors.nombre && <p className="form-error">{errors.nombre}</p>}
      </div>
      <div className="form-group">
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={usuarioData.apellido}
          onChange={handleUsuarioChange}
          disabled={!formData.id_usuario}
        />
        {errors.apellido && <p className="form-error">{errors.apellido}</p>}
      </div>
      <div className="form-group">
        <label>Correo</label>
        <input
          type="email"
          name="correo"
          value={usuarioData.correo}
          onChange={handleUsuarioChange}
          disabled={!formData.id_usuario}
        />
        {errors.correo && <p className="form-error">{errors.correo}</p>}
      </div>
      <div className="form-group">
        <label>Estado</label>
        <label className="switch">
          <input
            type="checkbox"
            name="estado"
            checked={formData.estado}
            onChange={handleClienteChange}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <button type="submit" className="form-submit-button">
        {initialData._id ? 'Actualizar' : 'Registrar'}
      </button>
      <button type="button" className="cancel-btn" onClick={onClose}>
        Cancelar
      </button>
    </form>
  );
};

export default ClienteForm;