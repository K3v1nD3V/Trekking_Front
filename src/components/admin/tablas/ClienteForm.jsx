import React, { useState, useEffect, useRef } from 'react';
import { getRoles } from '../../../api/roles';
import { createUsuario, updateUsuario, getUsuarios } from '../../../api/usuarios';
import { createCliente, updateCliente, checkClienteExistence } from '../../../api/clientes';
import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts';
import '../../../css/components/admin/ClienteForm.css';

const UsuarioClienteForm = ({ onClose, onSubmit, initialData = {} }) => {
  const isEditing = Boolean(initialData?.usuario?._id);
  const [roles, setRoles] = useState([]);

  const [usuarioData, setUsuarioData] = useState({
    nombre: initialData.usuario?.nombre || '',
    apellido: initialData.usuario?.apellido || '',
    correo: initialData.usuario?.correo || '',
    rol: initialData.usuario?.rol || '',
    contraseña: ''
  });

  const [clienteData, setClienteData] = useState({
    documento: initialData.cliente?.documento || '',
    telefono: initialData.cliente?.telefono || '',
    observacion_medica: initialData.cliente?.observacion_medica || '',
    estado: initialData.cliente?.estado ?? true
  });

  const [errors, setErrors] = useState({});
  const correoRef = useRef();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
  
        // Buscar el rol "cliente"
        const rolCliente = data.find(r => r.nombre.toLowerCase() === 'cliente');
  
        if (rolCliente) {
          setUsuarioData(prev => ({
            ...prev,
            rol: rolCliente._id // Asignar siempre, incluso si se está editando
          }));
        } else {
          toast.error('No se encontró el rol cliente');
        }
      } catch (err) {
        console.error('Error al cargar roles:', err);
        toast.error('Error al cargar roles');
      }
    };
  
    fetchRoles();
  }, []);
  

  const handleChange = (e, setData) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = async () => {
    const newErrors = {};
    const regexLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Usuario
    if (!usuarioData.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
    else if (!regexLetras.test(usuarioData.nombre)) newErrors.nombre = 'Solo letras.';

    if (!usuarioData.apellido.trim()) newErrors.apellido = 'El apellido es requerido.';
    else if (!regexLetras.test(usuarioData.apellido)) newErrors.apellido = 'Solo letras.';

    if (!usuarioData.correo.trim()) newErrors.correo = 'El correo es requerido.';
    else if (!regexCorreo.test(usuarioData.correo)) newErrors.correo = 'Correo inválido.';
    else if (!isEditing) {
      const usuarios = await getUsuarios();
      const correoExiste = usuarios.find(u => u.correo.toLowerCase() === usuarioData.correo.toLowerCase());
      if (correoExiste) newErrors.correo = 'Correo ya registrado.';
    }

    if (!usuarioData.rol) newErrors.rol = 'Debe seleccionar un rol.';

    if (!isEditing && !usuarioData.contraseña.trim()) newErrors.contraseña = 'La contraseña es requerida.';
    else if (!isEditing && usuarioData.contraseña.trim().length < 6) newErrors.contraseña = 'Mínimo 6 caracteres.';

    // Cliente
    if (!clienteData.documento) newErrors.documento = 'Documento requerido.';
    else if (!/^\d{8,12}$/.test(clienteData.documento)) newErrors.documento = 'Debe tener entre 8 y 12 números.';
    else {
      const existe = await checkClienteExistence({ documento: clienteData.documento });
      if (existe && (!initialData.cliente || clienteData.documento !== initialData.cliente.documento)) {
        newErrors.documento = 'Documento ya registrado.';
      }
    }

    if (!clienteData.telefono) newErrors.telefono = 'Teléfono requerido.';
    else if (!/^\d{7,15}$/.test(clienteData.telefono)) newErrors.telefono = 'Debe tener entre 7 y 15 dígitos.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validate())) return;

    const confirm = await showConfirm(
      isEditing ? '¿Actualizar usuario y cliente?' : '¿Crear nuevo usuario y cliente?',
      isEditing ? 'Actualizar' : 'Registrar'
    );
    if (!confirm.isConfirmed) return;

    try {
      if (isEditing) {
        await updateUsuario(initialData.usuario._id, usuarioData);
        await updateCliente(initialData.cliente._id, {
          ...clienteData,
          id_usuario: initialData.usuario._id
        });
        toast.success('¡Usuario y cliente actualizados!');
      } else {
        const nuevoUsuario = await createUsuario(usuarioData);
        const nuevoCliente = await createCliente({
          ...clienteData,
          id_usuario: nuevoUsuario._id
        });
        toast.success('¡Usuario y cliente registrados!');
      }

      setTimeout(() => {
        onSubmit();
        onClose();
      }, 1000);
    } catch (err) {
      toast.error('Error al guardar. Verifica e intenta nuevamente.');
      console.error(err);
    }
  };

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h3>Datos del Usuario</h3>
      <div className="form-group">
        <label>Nombre</label>
        <input name="nombre" value={usuarioData.nombre} onChange={e => handleChange(e, setUsuarioData)} />
        {errors.nombre && <p className="form-error">{errors.nombre}</p>}
      </div>
      <div className="form-group">
        <label>Apellido</label>
        <input name="apellido" value={usuarioData.apellido} onChange={e => handleChange(e, setUsuarioData)} />
        {errors.apellido && <p className="form-error">{errors.apellido}</p>}
      </div>
      <div className="form-group">
        <label>Correo</label>
        <input name="correo" ref={correoRef} value={usuarioData.correo} onChange={e => handleChange(e, setUsuarioData)} />
        {errors.correo && <p className="form-error">{errors.correo}</p>}
      </div>
      <div className="form-group">
        <label>Rol</label>
        <select name="rol" value={usuarioData.rol} onChange={e => handleChange(e, setUsuarioData)}>
          <option value="">Seleccione un rol</option>
          {roles.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
        </select>
        {errors.rol && <p className="form-error">{errors.rol}</p>}
      </div>
      {!isEditing && (
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="contraseña" value={usuarioData.contraseña} onChange={e => handleChange(e, setUsuarioData)} />
          {errors.contraseña && <p className="form-error">{errors.contraseña}</p>}
        </div>
      )}

      <h3>Datos del Cliente</h3>
      <div className="form-group">
        <label>Documento</label>
        <input name="documento" value={clienteData.documento} onChange={e => handleChange(e, setClienteData)} />
        {errors.documento && <p className="form-error">{errors.documento}</p>}
      </div>
      <div className="form-group">
        <label>Teléfono</label>
        <input name="telefono" value={clienteData.telefono} onChange={e => handleChange(e, setClienteData)} />
        {errors.telefono && <p className="form-error">{errors.telefono}</p>}
      </div>
      <div className="form-group">
        <label>Observación médica</label>
        <textarea name="observacion_medica" rows="3" value={clienteData.observacion_medica} onChange={e => handleChange(e, setClienteData)} />
      </div>
      <div className="form-group">
        <label>Estado</label>
        <label className="switch">
          <input
            type="checkbox"
            name="estado"
            checked={clienteData.estado}
            onChange={e => handleChange(e, setClienteData)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <button type="submit" className="form-submit-button">
        {isEditing ? 'Actualizar' : 'Registrar'}
      </button>
      <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default UsuarioClienteForm;
