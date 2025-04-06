import React, { useState, useRef } from 'react';
import '../../../css/components/admin/NewPaqueteFormStyles.css';
import '../../../css/components/admin/PaqueteFormStyles.css';

const NewPaqueteForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    valor: initialData.valor || '',
    lugar_encuentro: initialData.lugar_encuentro || '',
    destino: initialData.destino || '',
    servicios: initialData.servicios || [],
    multimedia: initialData.multimedia || []
  });

  const [newMedia, setNewMedia] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalMedia = formData.multimedia.length + newMedia.length + files.length;

    if (totalMedia > 5) {
      alert('Máximo 5 archivos multimedia permitidos por paquete');
      return;
    }

    setNewMedia((prev) => [...prev, ...files]);
  };

  const removeMedia = (index, isExisting) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        multimedia: prev.multimedia.filter((_, i) => i !== index)
      }));
    } else {
      setNewMedia((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      newMedia // Esto debería manejarse en el backend
    };
    onSubmit(finalData);
  };

  return (
    <form className="paquete-form" onSubmit={handleSubmit}>
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

      <div className="form-row">
        <div className="form-group">
          <label>Valor</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lugar de Encuentro</label>
          <input
            type="text"
            name="lugar_encuentro"
            value={formData.lugar_encuentro}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Destino</label>
        <input
          type="text"
          name="destino"
          value={formData.destino}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Multimedia</label>
        <div
          className="media-limit"
          data-count={formData.multimedia.length + newMedia.length}
        >
          <div
            className="media-progress"
            style={{
              width: `${((formData.multimedia.length + newMedia.length) / 5) * 100}%`
            }}
          ></div>
          <span className="media-count">
            {formData.multimedia.length + newMedia.length}/5
          </span>
        </div>

        {formData.multimedia.length > 0 && (
          <div className="existing-media-section">
            <h4 className="media-section-title">Archivos existentes</h4>
            <div className="media-preview-container">
              {formData.multimedia.map((media, index) => (
                <div key={`existing-${index}`} className="media-preview-item">
                  {media.includes('.mp4') || media.includes('.webm') ? (
                    <video src={media} className="preview-media" />
                  ) : (
                    <img src={media} alt={`Media ${index}`} className="preview-media" />
                  )}
                  <button
                    type="button"
                    className="remove-media-btn"
                    onClick={() => removeMedia(index, true)}
                    title="Eliminar archivo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {newMedia.map((file, index) => (
          <div key={`new-${index}`} className="media-preview-item">
            {file.type.startsWith('video/') ? (
              <video src={URL.createObjectURL(file)} className="preview-media" />
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt={`New media ${index}`}
                className="preview-media"
              />
            )}
            <button
              type="button"
              className="remove-media-btn"
              onClick={() => removeMedia(index, false)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*, video/*"
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="add-media-btn"
        onClick={() => fileInputRef.current.click()}
      >
        Añadir Multimedia
      </button>
      <button type="submit" className="form-submit-button">
        {initialData.nombre ? 'Actualizar' : 'Crear'} Paquete
      </button>
    </form>
  );
};

export default NewPaqueteForm;