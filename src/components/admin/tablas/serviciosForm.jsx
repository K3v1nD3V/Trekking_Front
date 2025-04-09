import React from 'react';
import '../../../css/components/admin/ServicioForm.css';
import { updateServicio, createServicio } from '../../../api/servicios';
const ServicioForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = React.useState({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        estado: initialData.estado || true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Datos enviados:', formData);
      
        try {
          if (initialData.nombre) {
            // Actualización de servicio existente
            await updateServicio(initialData._id, formData);
            console.log(initialData);
            console.log(initialData._id);
            
            alert('¡Servicio actualizado exitosamente!');
          } else {
            // Creación de nuevo servicio
            
            await createServicio(formData);
            alert('¡Servicio creado exitosamente!');
          }
          
          onSubmit(formData); // Llama a la función pasada como prop para actualizar el estado global
        } catch (error) {
          console.error('Error al enviar los datos:', error.message);
          alert('Hubo un error al procesar la solicitud.');
        }
      };

    return (
        <form className="servicio-form" onSubmit={handleSubmit}>
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

            <div className="form-group">
                <label>Estado</label>
                <div className="estado-switch">
                    <label className="switch">
                        <input
                            type="checkbox"
                            name="estado"
                            checked={formData.estado}
                            onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.checked }))}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <button type="submit" className="form-submit-button">
                {initialData.nombre ? 'Actualizar' : 'Crear'} Servicio
            </button>
        </form>
    );
};

export default ServicioForm;
