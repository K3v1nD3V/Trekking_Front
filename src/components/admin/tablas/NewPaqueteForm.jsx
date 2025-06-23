import React, { useState, useRef } from 'react';
import '../../../css/components/admin/PaqueteFormStyles.css';
import { updatePaquete, createPaquete } from '../../../api/paquetes';
import { showConfirm } from '../../../alerts/alerts';
import { toast } from 'sonner';

const NewPaqueteForm = ({ onSubmit, onClose, initialData = {}, servicios }) => {
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
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // const validate = () => {
  //   const newErrors = {};
  //   if (!formData.nombre || formData.nombre.length < 3) {
  //     newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  //   }
  //   if (!formData.valor || formData.valor <= 0) {
  //     newErrors.valor = 'El valor debe ser un número positivo.';
  //   }
  //   if (!formData.descripcion || formData.descripcion.length < 10) {
  //     newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
  //   }
  //   if (!formData.lugar_encuentro || formData.lugar_encuentro.length < 1) {
  //     newErrors.lugar_encuentro = 'El lugar de encuentro debe tener al menos 10 caracteres.';
  //   }
  //   if (!formData.destino || formData.destino.length < 1) {
  //     newErrors.destino = 'El destino debe tener al menos 10 caracteres.';
  //   }
  //   if (formData.servicios.length === 0) {
  //     newErrors.servicios = 'Debe seleccionar al menos un servicio.';
  //   }
  //   if (formData.multimedia.length + newMedia.length === 0) {
  //     newErrors.multimedia = 'Debe agregar al menos un archivo multimedia.';
  //   }
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validate = () => {
  const newErrors = {};

  // Validación de nombre
  if (!formData.nombre || formData.nombre.length < 3) {
    newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  } else if (/\d/.test(formData.nombre)) {
    newErrors.nombre = 'El nombre no debe contener números.';
  }

  // Validación de valor (mínimo 4 cifras)
if (!formData.valor || isNaN(formData.valor)) {
  newErrors.valor = 'El valor debe ser un número.';
} else if (formData.valor <= 0) {
  newErrors.valor = 'El valor debe ser un número positivo.';
} else if (formData.valor < 10000) {
  newErrors.valor = 'El valor debe tener al menos 5 cifras (mínimo 10000).';
}


  // Validación de descripción
  if (!formData.descripcion || formData.descripcion.length < 10) {
    newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
  }

  // Lugar de encuentro (mínimo 10 caracteres)
  if (!formData.lugar_encuentro || formData.lugar_encuentro.length < 10) {
    newErrors.lugar_encuentro = 'El lugar de encuentro debe tener al menos 10 caracteres.';
  }

  // Destino (mínimo 10 caracteres)
  if (!formData.destino || formData.destino.length < 10) {
    newErrors.destino = 'El destino debe tener al menos 10 caracteres.';
  }

  // Servicios
  if (formData.servicios.length === 0) {
    newErrors.servicios = 'Debe seleccionar al menos un servicio.';
  }

  // Multimedia
  if (formData.multimedia.length + newMedia.length === 0) {
    newErrors.multimedia = 'Debe agregar al menos un archivo multimedia.';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const hasChanges = () => {
    const campos = ['nombre', 'descripcion', 'valor', 'lugar_encuentro', 'destino'];
    const camposModificados = campos.some(campo => String(formData[campo]) !== String(initialData[campo] || ''));

    const serviciosOriginal = (initialData.servicios || []).map(s => s._id).sort();
    const serviciosActual = formData.servicios.map(s => s._id).sort();

    const multimediaOriginal = (initialData.multimedia || []).sort();
    const multimediaActual = formData.multimedia.sort();

    const serviciosModificados = JSON.stringify(serviciosOriginal) !== JSON.stringify(serviciosActual);
    const multimediaModificada = JSON.stringify(multimediaOriginal) !== JSON.stringify(multimediaActual);
    const hayMediaNueva = newMedia.length > 0;

    return camposModificados || serviciosModificados || multimediaModificada || hayMediaNueva;
  };

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
    if (!validate()) return;

    if (formData._id && !hasChanges()) {
      toast.error('No se han realizado cambios en el formulario.');
      return;
    }

    const confirm = await showConfirm(
      formData._id ? '¿Estás seguro de actualizar este paquete?' : '¿Deseas crear este nuevo paquete?',
      formData._id ? 'Confirmar actualización' : 'Confirmar creación'
    );

    if (!confirm.isConfirmed) return;

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
        await toast.success('¡Paquete actualizado exitosamente!');
      } else {
        await createPaquete(formDataToSend);
        await toast.success('¡Paquete creado exitosamente!');
      }
      onSubmit(formData);
    } catch (error) {
      console.error(error.response?.data || error.message);
      await toast.error('Error al procesar la solicitud', 'Por favor, intenta nuevamente.');
    }
  };
  

  return (
    <form className="paquete-form elegante-formulario" onSubmit={handleSubmit}>
      {/* Información Básica */}
      <div className="seccion-formulario">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <p className="form-error">{errors.nombre}</p>}
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
        {errors.descripcion && <p className="form-error">{errors.descripcion}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Valor</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
          />
          {errors.valor && <p className="form-error">{errors.valor}</p>}
        </div>

        <div className="form-group">
          <label>Lugar de Encuentro</label>
          <input
            type="text"
            name="lugar_encuentro"
            value={formData.lugar_encuentro}
            onChange={handleChange}
          />
          {errors.lugar_encuentro && <p className="form-error">{errors.lugar_encuentro}</p>}
        </div>
      </div>

      <div className="form-group">
        <label>Destino</label>
        <input
          type="text"
          name="destino"
          value={formData.destino}
          onChange={handleChange}
        />
        {errors.destino && <p className="form-error">{errors.destino}</p>}
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
      {errors.servicios && <p className="form-error">{errors.servicios}</p>}
      </div>

      <div className="seccion-formulario">
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
            >  
            </div>
            <span className="media-count">
              {formData.multimedia.length + newMedia.length}/5
            </span>
          </div>
          {errors.multimedia && <p className="form-error">{errors.multimedia}</p>}
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
          <div className='new-media-section'>
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
          {formData._id ? 'Actualizar' : 'Registrar'}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NewPaqueteForm;
