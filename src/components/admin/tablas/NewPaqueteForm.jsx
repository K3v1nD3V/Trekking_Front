import React, { useState, useRef } from 'react';
import '../../../css/components/admin/PaqueteFormStyles.css';
import { updatePaquete, createPaquete } from '../../../api/paquetes';

const NewPaqueteForm = ({ onSubmit, initialData = {}, servicios }) => {
  const [formData, setFormData] = useState({
    _id: initialData._id || '',
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    valor: initialData.valor || '',
    lugar_encuentro: initialData.lugar_encuentro || '',
    destino: initialData.destino || '',
    servicios: initialData.servicios || [],
    multimedia: initialData.multimedia || []
  });

  const [newMedia, setNewMedia] = useState([]);
  const [showServicios, setShowServicios] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalMedia = formData.multimedia.length + newMedia.length + files.length;

    if (totalMedia > 5) return alert('Máximo 5 archivos multimedia permitidos.');
    setNewMedia(prev => [...prev, ...files]);
  };

  const removeMedia = (index, isExisting) => {
    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        multimedia: prev.multimedia.filter((_, i) => i !== index)
      }));
    } else {
      setNewMedia(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleServicioToggle = (servicio) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.some(s => s._id === servicio._id)
        ? prev.servicios.filter(s => s._id !== servicio._id)
        : [...prev.servicios, servicio]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      valor: formData.valor,
      lugar_encuentro: formData.lugar_encuentro,
      destino: formData.destino
    }).forEach(([key, value]) => formDataToSend.append(key, value));

    formData.servicios.forEach(servicio => formDataToSend.append('servicios[]', servicio._id));
    newMedia.forEach(file => formDataToSend.append('images', file));

    try {
      if (formData._id) {
        await updatePaquete(formData._id, formDataToSend);
        alert('¡Paquete actualizado exitosamente!');
      } else {
        await createPaquete(formDataToSend);
        alert('¡Paquete creado exitosamente!');
      }
      onSubmit(formData);
    } catch (error) {
      alert('Error al procesar la solicitud.');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <form className="paquete-form elegante-formulario" onSubmit={handleSubmit}>
      {/* Información Básica */}
      <div className="seccion-formulario">
        <label>Nombre</label>
        <input name="nombre" type="text" value={formData.nombre} onChange={handleChange} required />

        <label>Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

        <label>Valor</label>
        <input name="valor" type="number" value={formData.valor} onChange={handleChange} required />

        <label>Lugar de Encuentro</label>
        <input name="lugar_encuentro" type="text" value={formData.lugar_encuentro} onChange={handleChange} required />

        <label>Destino</label>
        <input name="destino" type="text" value={formData.destino} onChange={handleChange} required />
      </div>

      {/* Servicios con desplegable */}
      <div className="seccion-formulario">
      <label className="servicio-label" onClick={() => setShowServicios(!showServicios)}>
        <span className="flecha">{showServicios ? '▲' : '▼'}</span> Elegir Servicios
      </label>

        {showServicios && (
          <div className="grid-servicios">
            {servicios.map(servicio => (
              <label key={servicio._id} className="checkbox-servicio">
                <input
                  type="checkbox"
                  checked={formData.servicios.some(s => s._id === servicio._id)}
                  onChange={() => handleServicioToggle(servicio)}
                />
                {servicio.nombre}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Multimedia */}
      <div className="seccion-formulario">
        <label>Multimedia ({formData.multimedia.length + newMedia.length}/5)</label>

        <div className="media-previews">
          {formData.multimedia.map((media, index) => (
            <div key={index} className="media-item">
              {media.includes('.mp4') || media.includes('.webm') ? (
                <video src={media} className="preview-media" controls />
              ) : (
                <img src={media} alt="" className="preview-media" />
              )}
              <button type="button" onClick={() => removeMedia(index, true)}>×</button>
            </div>
          ))}
          {newMedia.map((file, index) => (
            <div key={index} className="media-item">
              {file.type.startsWith('video/') ? (
                <video src={URL.createObjectURL(file)} className="preview-media" controls />
              ) : (
                <img src={URL.createObjectURL(file)} alt="" className="preview-media" />
              )}
              <button type="button" onClick={() => removeMedia(index, false)}>×</button>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          style={{ display: 'none' }}
        />
        <button type="button" className="btn-outline btn-wide" onClick={() => fileInputRef.current.click()}>
          Añadir Multimedia
        </button>
      </div>

      {/* Botón de Enviar */}
      <div className="form-actions">
        <button type="submit" className="btn-primary btn-wide">
          {formData._id ? 'Actualizar Paquete' : 'Crear Paquete'}
        </button>
      </div>
    </form>
  );
};

export default NewPaqueteForm;
