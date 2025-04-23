import React from 'react';
import { createUsuario, updateUsuario } from '../../../api/usuarios';
import '../../../css/components/admin/ClienteForm.css';

const UsuarioForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = React.useState({
        nombre: initialData.nombre || '',
        correo: initialData.correo || '',
        contraseña: '',
        rol: initialData.rol || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (initialData && initialData._id) {
                await updateUsuario(initialData._id, formData);
                alert('Usuario actualizado correctamente');
            } else {
                await createUsuario(formData);
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
                <label>Contraseña</label>
                <input
                    type="password"
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    required={!initialData._id}                
                />
            </div>

            
            <div className="form-group">
                <label>Rol</label>
                <input
                    type="text"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                />
            </div>
        
            <button type="submit" className="form-submit-button">
                {initialData._id ? 'Actualizar' : 'Crear'} Usuario
            </button>
        </form>
    );
};

export default UsuarioForm;
