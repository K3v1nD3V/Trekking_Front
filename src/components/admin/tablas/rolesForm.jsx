import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import '../../../css/components/admin/rolesForm.css';
import { createRol, updateRol, getRoles } from '../../../api/roles';
import { getPermisos } from '../../../api/permisos';
import { getPrivilegios } from '../../../api/privilegios';
import { showConfirm } from '../../../alerts/alerts';


const RolForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombreRol: '',
    estado: true,
    permisos: []
  });

  const [permisos, setPermisos] = useState([]);
  const [privilegios, setPrivilegios] = useState([]);
  const [errorNombre, setErrorNombre] = useState('');
  const nombreRolRef = useRef(null);

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
        toast.error('No se pudieron cargar los datos iniciales.');
      }
    };

    fetchData();
  }, [initialData]);

  const togglePermiso = (permiso) => {
    setFormData(prev => {
      const existe = prev.permisos.find(p => p.permiso === permiso);
      const nuevos = existe
        ? prev.permisos.filter(p => p.permiso !== permiso)
        : [...prev.permisos, { permiso, privilegios: [] }];
      return { ...prev, permisos: nuevos };
    });
  };

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

  const toggleTodosPrivilegios = (permiso) => {
    setFormData(prev => ({
      ...prev,
      permisos: prev.permisos.map(p => {
        if (p.permiso === permiso) {
          const privilegiosIds = privilegios.map(pr => pr._id);
          const todosSeleccionados = privilegiosIds.every(id => p.privilegios.includes(id));
          return {
            ...p,
            privilegios: todosSeleccionados ? [] : privilegiosIds
          };
        }
        return p;
      })
    }));
  };

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
        r._id !== initialData._id
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
      toast.error('Debe asignar al menos un permiso con al menos un privilegio.');
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

    const confirmado = await showConfirm(
      initialData._id
        ? '¿Deseas actualizar este rol?'
        : '¿Deseas crear este rol?'
    );
    if (!confirmado) return;
    
    try {
      if (initialData._id) {
        await updateRol(initialData._id, dataToSend);
        toast.success('¡Rol actualizado exitosamente!');
      } else {
        await createRol(dataToSend);
        toast.success('¡Rol creado exitosamente!');
      }

      onSubmit(formData);
      onClose();
    } catch (err) {
      toast.error('Error al guardar el rol:', err);
      toast.error('Error al guardar el rol. Verifica los datos o intenta más tarde.');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>{initialData._id ? 'Actualizar Rol' : 'Registrar Rol'}</h2>

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

                    <label className="privilegio-item select-all">
                      <input
                        type="checkbox"
                        checked={
                          privilegios.length > 0 &&
                          privilegios.every(pr => permisoActivo.privilegios.includes(pr._id))
                        }
                        onChange={() => toggleTodosPrivilegios(p.nombre)}
                      />
                      Seleccionar todos
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="submit" className="submit-btn">
          {initialData._id ? 'Actualizar' : 'Registrar'}
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default RolForm;
