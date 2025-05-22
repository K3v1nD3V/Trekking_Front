import React, { useEffect, useRef, useState } from 'react';
import '../../../css/components/admin/rolesForm.css';
import {
  createRol,
  updateRol,
  getRoles
} from '../../../api/roles';
import {
  getPermisos
} from '../../../api/permisos';
import {
  getPrivilegios
} from '../../../api/privilegios';

const RolForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombreRol: '',
    estado: true,
    permisos: []
  });

  const [permisos, setPermisos] = useState([]);
  const [privilegios, setPrivilegios] = useState([]);
  const [errorNombre, setErrorNombre] = useState('');
  const nombreRolRef = useRef(null); // Referencia para el input del nombre

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPermisos(await getPermisos());
        setPrivilegios(await getPrivilegios());

        if (initialData._id) {
          const permisosFormateados = initialData.permisos.map(p => ({
            permiso: p.nombre,
            privilegios: p.privilegios
          }));

          setFormData({
            nombreRol: initialData.nombre,
            estado: initialData.estado,
            permisos: permisosFormateados
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [initialData]);

  // Alternar permiso (checkbox)
  const togglePermiso = (permiso) => {
    setFormData(prev => {
      const existe = prev.permisos.find(p => p.permiso === permiso);
      const nuevos = existe
        ? prev.permisos.filter(p => p.permiso !== permiso)
        : [...prev.permisos, { permiso, privilegios: [] }];
      return { ...prev, permisos: nuevos };
    });
  };

  // Alternar privilegio (checkbox)
  const togglePrivilegio = (permiso, privilegioId) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.map(p => {
        if (p.permiso === permiso) {
          const existe = p.privilegios.includes(privilegioId);
          const nuevosPrivilegios = existe
            ? p.privilegios.filter(id => id !== privilegioId)
            : [...p.privilegios, privilegioId];
          return { ...p, privilegios: nuevosPrivilegios };
        }
        return p;
      })
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nombreTrimmed = formData.nombreRol.trim();
  
    if (!nombreTrimmed) {
      setErrorNombre('El nombre del rol no puede estar vacío.');
      nombreRolRef.current?.focus();
      return;
    } else if (nombreTrimmed.length < 3) {
      setErrorNombre('El nombre del rol debe tener al menos 3 caracteres.');
      nombreRolRef.current?.focus();
      return;
    }
  
    try {
      const rolesExistentes = await getRoles();
  
      const nombreDuplicado = rolesExistentes.some(r =>
        r.nombre.trim().toLowerCase() === nombreTrimmed.toLowerCase() &&
        r._id !== initialData._id // Permitir si es el mismo rol en edición
      );
  
      if (nombreDuplicado) {
        setErrorNombre('Ya existe un rol con ese nombre.');
        nombreRolRef.current?.focus();
        return;
      }
    } catch (err) {
      console.error('Error al validar nombre duplicado:', err);
    }
  
    setErrorNombre('');
  
    const permisosValidos = formData.permisos.filter(p => p.privilegios.length > 0);
    if (permisosValidos.length === 0) {
      alert('Debe asignar al menos un permiso con al menos un privilegio.');
      return;
    }
  
    const permisosFinal = permisosValidos.map(p => {
      const permisoEncontrado = permisos.find(perm => perm.nombre === p.permiso);
      return permisoEncontrado?._id;
    }).filter(id => id);
  
    const dataToSend = {
      nombre: nombreTrimmed,
      estado: formData.estado,
      permisos: permisosFinal
    };
  
    try {
      if (initialData._id) {
        await updateRol(initialData._id, dataToSend);
      } else {
        await createRol(dataToSend);
      }
      onSubmit && onSubmit(dataToSend);
      onClose && onClose();
    } catch (err) {
      console.error('Error al guardar el rol:', err);
    }
  };
    
  
  
  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        {onClose && (
          <button className="close-btn" onClick={onClose} type="button">×</button>
        )}

        <h2>{initialData._id ? 'Editar Rol' : 'Nuevo Rol'}</h2>

        <label>
          Nombre del rol
          <input
            type="text"
            name="nombreRol"
            ref={nombreRolRef}
            value={formData.nombreRol}
            onChange={e => setFormData({ ...formData, nombreRol: e.target.value })}
            className={errorNombre ? 'input-error' : ''}
          />
          {errorNombre && <p className="error-text">{errorNombre}</p>}
        </label>

        <label className="switch-container">
          Estado:
          <div className="switch-wrapper">
            <input
              type="checkbox"
              className="switch-input"
              checked={formData.estado}
              onChange={e => setFormData({ ...formData, estado: e.target.checked })}
            />
            <span className="switch"></span>
          </div>
        </label>

        <div className="permissions-section">
          <h3>Permisos y Privilegios</h3>
          {permisos.map(p => {
            const permisoActivo = formData.permisos.find(pm => pm.permiso === p.nombre);
            return (
              <div key={p._id} className="permission-item">
                <label className="permission-label">
                  <input
                    type="checkbox"
                    checked={!!permisoActivo}
                    onChange={() => togglePermiso(p.nombre)}
                  />
                  {p.nombre}
                </label>

                {permisoActivo && (
                  <div className="privilegios-list">
                    {privilegios.map(pr => (
                      <label key={pr._id} className="privilegio-item">
                        <input
                          type="checkbox"
                          checked={permisoActivo.privilegios.includes(pr._id)}
                          onChange={() => togglePrivilegio(p.nombre, pr._id)}
                        />
                        {pr.descripcion}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="submit" className="submit-btn">
          {initialData._id ? 'Actualizar' : 'Crear'}
        </button>
      </form>
    </div>
  );
};

export default RolForm;