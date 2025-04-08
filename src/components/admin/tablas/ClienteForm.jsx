import React from 'react';
import '../../../css/components/admin/ClienteForm.css';

const ClienteForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = React.useState({
        documento: initialData.documento || '',
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        correo: initialData.correo  || '',
        telefono: initialData.telefono || '',
        estado: initialData.estado || true,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="cliente-form" onSubmit={handleSubmit}>
             <div className="form-group">
                <label>Documento</label>
                <input
                    type="number"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
                />
            </div>

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
                <label>Apellido</label>
                <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                />
            </div>

            
            <div className="form-group">
                <label>Correo</label>
                <input
                    type="text"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                />
            </div>

            
            <div className="form-group">
                <label>Telefono</label>
                <input
                    type="number"
                    name="telefono"
                    value={formData.telefono}
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
                {initialData.nombre ? 'Actualizar' : 'Crear'} Cliente
            </button>
        </form>
    );

}

export default ClienteForm;
