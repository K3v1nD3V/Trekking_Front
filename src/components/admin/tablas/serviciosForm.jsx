import React, { useState } from 'react';
import '../../../css/components/admin/ServicioForm.css';
import { updateServicio, createServicio } from '../../../api/servicios';

const ServicioForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        estado: initialData.estado ?? true,
        icono: initialData.icono || '',
    });

    const [iconPreview, setIconPreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIconChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, icono: value }));
        setShowPreview(false); // Ocultar la vista previa si el texto cambia
    };

    const handlePreview = () => {
        setIconPreview(formData.icono);
        setShowPreview(true);
    };

    const resetIcon = () => {
        setFormData((prev) => ({ ...prev, icono: '' }));
        setIconPreview('');
        setShowPreview(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (initialData._id) {
                console.log(initialData);
                console.log(formData);
                
                await updateServicio(initialData._id, formData);
                alert('¡Servicio actualizado exitosamente!');
            } else {
                await createServicio(formData);
                alert('¡Servicio creado exitosamente!');
            }
            onSubmit(formData);
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
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    estado: e.target.checked,
                                }))
                            }
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label>Icono</label>
                <input
                    type="text"
                    name="icono"
                    value={formData.icono}
                    onChange={handleIconChange}
                    placeholder="Ingresa la clase del icono"
                />
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handlePreview}
                    disabled={!formData.icono.trim()}
                >
                    Ver Vista Previa
                </button>
                {showPreview && (
                    <div className="icon-preview-container">
                        <span className="material-symbols-outlined icon-preview">
                            {iconPreview}
                        </span>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={resetIcon}
                        >
                            Quitar Icono
                        </button>
                    </div>
                )}
            </div>

            <button type="submit" className="form-submit-button">
                {initialData._id ? 'Actualizar' : 'Crear'} Servicio
            </button>
        </form>
    );
};

export default ServicioForm;
