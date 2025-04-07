import React, { useState } from 'react';
import '../../../css/components/admin/rolesForm.css';

const permisosDisponibles = [
    'Acceso a servicios',
    'Acceso a paquetes',
    'Acceso a usuarios',
    'Acceso a reportes',
];

const privilegiosDisponibles = [
    { id: 1, nombre: 'Crear', descripcion: 'Permite crear nuevos elementos' },
    { id: 2, nombre: 'Editar', descripcion: 'Permite editar elementos existentes' },
    { id: 3, nombre: 'Eliminar', descripcion: 'Permite eliminar elementos del sistema' },
];

const RolForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        nombreRol: initialData.nombreRol || '',
        estado: initialData.estado ?? true,
        permisos: initialData.permisos || []  // Cada permiso tendrá privilegios asociados
      });

      const togglePrivilegio = (permiso, privilegio) => {
        setFormData(prev => {
          const permisosActualizados = prev.permisos.map(p => {
            if (p.permiso === permiso) {
              const yaExiste = p.privilegios.includes(privilegio);
              const privilegiosActualizados = yaExiste
                ? p.privilegios.filter(pv => pv !== privilegio)
                : [...p.privilegios, privilegio];
              return { ...p, privilegios: privilegiosActualizados };
            }
            return p;
          });
          return { ...prev, permisos: permisosActualizados };
        });
      };

      const togglePermiso = (permiso) => {
        setFormData(prev => {
          const existe = prev.permisos.find(p => p.permiso === permiso);
          const permisosActualizados = existe
            ? prev.permisos.filter(p => p.permiso !== permiso)
            : [...prev.permisos, { permiso, privilegios: [] }];
          return { ...prev, permisos: permisosActualizados };
        });
      };
      

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (type, value) => {
        setFormData(prev => {
            const list = prev[type];
            const newList = list.includes(value)
                ? list.filter(item => item !== value)
                : [...list, value];
            return { ...prev, [type]: newList };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="rol-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nombre del Rol</label>
                <input
                    type="text"
                    name="nombreRol"
                    value={formData.nombreRol}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Estado</label>
                <div className="estado-switch">
                    <label className="switch">
                        <input
                            type="checkbox"
                            name="estado"
                            checked={formData.estado}
                            onChange={(e) =>
                                setFormData(prev => ({ ...prev, estado: e.target.checked }))
                            }
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="form-group">
  <label>Permisos y Privilegios</label>
  <div className="checkbox-list">
    {permisosDisponibles.map((permiso, index) => {
      const permisoActual = formData.permisos.find(p => p.permiso === permiso);
      return (
        <div key={index} className="permiso-privilegio-fila">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={!!permisoActual}
              onChange={() => togglePermiso(permiso)}
            />
            {permiso}
          </label>

          {permisoActual && (
            <div className="privilegios-sublist">
              {privilegiosDisponibles.map(priv => (
                <label key={priv.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={permisoActual.privilegios.includes(priv.nombre)}
                    onChange={() => togglePrivilegio(permiso, priv.nombre)}
                  />
                  {priv.nombre} — <small>{priv.descripcion}</small>
                </label>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>

            <button type="submit" className="form-submit-button">
                {initialData.nombreRol ? 'Actualizar' : 'Crear'} Rol
            </button>
        </form>
    );
};

export default RolForm;
