import React, { useState, useEffect } from 'react';
import { getPaquetes, createPaquete } from '../../api/paquetes';
import './paquetes.css';

const PaquetesV2 = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPaquete, setNewPaquete] = useState({
    nombre: '',
    valor: '',
    descripcion: '',
    lugar_encuentro: '',
    destino: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPaquetes();
  }, []);

  const fetchPaquetes = async () => {
    try {
      const data = await getPaquetes();
      setPaquetes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaquete(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePaquete = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const createdPaquete = await createPaquete(newPaquete);
      setPaquetes(prev => [createdPaquete, ...prev]);
      setNewPaquete({
        nombre: '',
        valor: '',
        descripcion: '',
        lugar_encuentro: '',
        destino: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="loading">Cargando paquetes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="paquetes-container">
      <h2>Listado de Paquetes</h2>

      <form onSubmit={handleCreatePaquete} className="create-paquete-form">
        <h3>Crear Nuevo Paquete</h3>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={newPaquete.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Valor:</label>
          <input
            type="number"
            name="valor"
            value={newPaquete.valor}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={newPaquete.descripcion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Lugar de Encuentro:</label>
          <input
            type="text"
            name="lugar_encuentro"
            value={newPaquete.lugar_encuentro}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Destino:</label>
          <input
            type="text"
            name="destino"
            value={newPaquete.destino}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={creating}>
          {creating ? 'Creando...' : 'Crear Paquete'}
        </button>
      </form>

      <div className="paquetes-list">
        {paquetes.map(paquete => (
          <div key={paquete.id} className="paquete-card">
            <h3>{paquete.nombre}</h3>
            <p>{paquete.descripcion}</p>
            <div className="paquete-details">
              <p><strong>Valor:</strong> ${paquete.valor}</p>
              <p><strong>Lugar de encuentro:</strong> {paquete.lugar_encuentro}</p>
              <p><strong>Destino:</strong> {paquete.destino}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaquetesV2;

    