import React, { useState, useRef } from 'react';
import '../../../css/components/admin/NewClienteFormStyles.css';
// import '../../../css/components/admin/ClienteFormStyles.css';

const NewClienteForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        documento: initialData.documento || '',
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        correo: initialData.correo || '',
        telefono: initialData.telefono || '',
        estado: initialData.estado || ''
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
        };
        onSubmit(finalData);
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
                <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                />
            </div>

        </form>
    );
};