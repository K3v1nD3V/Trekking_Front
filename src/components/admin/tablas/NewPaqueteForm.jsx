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
  // console.log(formData);
  
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

  const handleServicioToggle = (servicioId) => {
    setFormData((prev) => {
      const serviciosSeleccionados = prev.servicios.includes(servicioId)
        ? prev.servicios.filter(id => id !== servicioId) // Desmarca
        : [...prev.servicios, servicioId]; // Marca
  
      return {
        ...prev,
        servicios: serviciosSeleccionados
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Datos en formData:', formData);
    console.log('Archivos en newMedia:', newMedia);
  
    const formDataToSend = new FormData();
  
    formDataToSend.append('nombre', formData.nombre);
    console.log('Nombre añadido a FormData:', formData.nombre);
  
    formDataToSend.append('descripcion', formData.descripcion);
    console.log('Descripción añadida a FormData:', formData.descripcion);
  
    formDataToSend.append('valor', formData.valor);
    console.log('Valor añadido a FormData:', formData.valor);
  
    formDataToSend.append('lugar_encuentro', formData.lugar_encuentro);
    console.log('Lugar de encuentro añadido a FormData:', formData.lugar_encuentro);
  
    formDataToSend.append('destino', formData.destino);
    console.log('Destino añadido a FormData:', formData.destino);
  
    formData.servicios.forEach(servicio => {
      formDataToSend.append('servicios[]', servicio._id); // Añade solo el ID
    });
  
    newMedia.forEach(file => {
      formDataToSend.append('images', file); // Nombre esperado por multer
      console.log('Archivo multimedia añadido a FormData:', file.name);
    });
  
    console.log('FormDataToSend final:', formDataToSend);
    console.log('Contenido de FormData:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      if (formData._id) {
        console.log('Editando paquete...');
        updatePaquete(formData._id, formDataToSend)
        alert('¡Paquete editado exitosamente!');
      } else {
        console.log('Creando paquete...');
        createPaquete(formDataToSend)
        alert('¡Paquete creado exitosamente!');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error.response?.data || error.message);
      alert('Hubo un error al procesar la solicitud.');
    }
  
    onSubmit(formData);
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
  <label>Servicios</label>
  <div className="paquetes-servicios-grid">
    {servicios.map(servicio => (
      <div
        key={servicio._id}
        className={`paquetes-servicio-item ${
          formData.servicios.some(s => s._id === servicio._id)
            ? 'paquetes-servicio-incluido'
            : 'paquetes-servicio-no-incluido'
        }`}
      >
        <input
          type="checkbox"
          id={`servicio-${servicio._id}`}
          checked={formData.servicios.some(s => s._id === servicio._id)}
          onChange={() => handleServicioToggle(servicio)}
        />
        <label htmlFor={`servicio-${servicio._id}`}>{servicio.nombre}</label>
      </div>
    ))}
  </div>
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
          {formData._id ? 'Actualizar' : 'Crear'} Paquete
      </button>
    </form>
  );
};

export default NewPaqueteForm;