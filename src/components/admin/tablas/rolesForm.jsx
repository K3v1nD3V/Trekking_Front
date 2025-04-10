import React, { useEffect, useState } from 'react';
import '../../../css/components/admin/rolesForm.css';
import { createRol, updateRol, getPermisos, getPrivilegios } from '../../../api/roles';

const RolForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombreRol: '',
    estado: true,
    permisos: []
  });

  const [permisos, setPermisos] = useState([]);
  const [privilegios, setPrivilegios] = useState([]);

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
        alert('Error cargando datos');
        console.error(err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener los IDs de los permisos seleccionados
    const permisosFinal = formData.permisos.map(p => {
      const permisoEncontrado = permisos.find(perm => perm.nombre === p.permiso);
      return permisoEncontrado?._id;
    }).filter(id => id); // eliminar undefined

    const dataToSend = {
      nombre: formData.nombreRol,
      estado: formData.estado,
      permisos: permisosFinal
    };

    try {
      if (initialData._id) {
        console.log('Payload que se envía (editando):', JSON.stringify(dataToSend, null, 2));
        await updateRol(initialData._id, dataToSend);
      } else {
        console.log('Payload que se envía (creando):', JSON.stringify(dataToSend, null, 2));
        await createRol(dataToSend);
      }

      onSubmit && onSubmit(dataToSend);
      onClose && onClose();
    } catch (err) {
      console.error('Error al guardar el rol:', err);
      alert('Error al guardar');
    }
  };

  return (
    <div className="form-container">
      <form className="card-form" onSubmit={handleSubmit}>
        {onClose && <button className="close-btn" onClick={onClose} type="button">×</button>}

        <h2>{initialData._id ? 'Editar Rol' : 'Nuevo Rol'}</h2>

        <label>
          Nombre del rol
          <input
            type="text"
            name="nombreRol"
            value={formData.nombreRol}
            onChange={e => setFormData({ ...formData, nombreRol: e.target.value })}
            required
          />
        </label>

        <label className="estado-toggle">
          Estado:
          <input
            type="checkbox"
            checked={formData.estado}
            onChange={e => setFormData({ ...formData, estado: e.target.checked })}
          />
        </label>

        <div className="permiso-list">
          {permisos.map(p => {
            const permisoActivo = formData.permisos.find(pm => pm.permiso === p.nombre);
            return (
              <div key={p._id} className="permiso-card">
                <label>
                  <input
                    type="checkbox"
                    checked={!!permisoActivo}
                    onChange={() => togglePermiso(p.nombre)}
                  />
                  {p.nombre}
                </label>

                {permisoActivo && (
                  <div className="privilegios">
                    {privilegios.map(pr => (
                      <label key={pr._id}>
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
