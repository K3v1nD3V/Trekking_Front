import React from 'react';
import { createUsuario, updateUsuario } from '../../../api/usuarios';
import '../../../css/components/admin/ClienteForm.css';

const UsuarioForm = ({ onSubmit, initialData = {}, roles = [] }) => {
    const [formData, setFormData] = React.useState({
        nombre: initialData.nombre || '',
        correo: initialData.correo || '',
        rol: initialData.rol || '',
        contraseña: '' // Siempre inicia vacío
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSubmit = { ...formData };
            if (initialData && initialData._id) {
                // No enviar contraseña si se está editando
                delete dataToSubmit.contraseña;
                await updateUsuario(initialData._id, dataToSubmit);
                alert('Usuario actualizado correctamente');
            } else {
                await createUsuario(dataToSubmit);
                alert('Usuario creado correctamente');
            }

            onSubmit(); // Actualiza estado global o cierra modal
        } catch (error) {
            alert('Error al guardar usuario: ' + error.message);
            console.error('Error en UsuarioForm:', error);
        }
    };

    return (
        <form className="cliente-form" onSubmit={handleSubmit}>
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
                <label>Correo</label>
                <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                />
            </div>

         <div className="form-group">
                <label>Rol</label>
                <select name="rol" value={formData.rol} onChange={handleChange} required>
                    <option value="">Seleccione un rol</option>
                    {roles.map(rol => (
                        <option key={rol._id} value={rol._id}>
                            {rol.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Contraseña</label>
                <input
                    type="password"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    disabled={!!initialData._id} // Deshabilitar si se está editando
                    placeholder={initialData._id ? 'No se puede editar la contraseña' : 'Ingrese una contraseña'}
                />
            </div>

            <button type="submit" className="form-submit-button">
                {initialData._id ? 'Actualizar' : 'Crear'} Usuario
            </button>
        </form>
    );
};

export default UsuarioForm;