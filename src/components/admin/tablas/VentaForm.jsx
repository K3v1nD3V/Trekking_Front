const VentaForm = ({ onSubmit, clientes, paquetes }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    paquete: '',
    fecha: '',
    valor: '',
    acompañantes: [],
  });

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevaVenta = {
      id_cliente: formData.cliente,
      id_paquete: formData.paquete,
      fecha: new Date(formData.fecha).toISOString(),
      valor: parseFloat(formData.valor),
      acompañantes: formData.acompañantes.filter(id => id !== formData.cliente),
    };

    try {
      await onSubmit(nuevaVenta);
    } catch (error) {
      console.error('Error al crear venta:', error);
      alert('Error al crear la venta.');
    }
  };

  return (
    <form className="venta-form" onSubmit={handleSubmit}>
      {/* Cliente */}
      <div className="form-group">
        <label htmlFor="cliente">Cliente</label>
        <select
          id="cliente"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map(({ _id, nombre, apellido }) => (
            <option key={_id} value={_id}>
              {nombre} {apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Paquete */}
      <div className="form-group">
        <label htmlFor="paquete">Paquete</label>
        <select
          id="paquete"
          name="paquete"
          value={formData.paquete}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un paquete</option>
          {paquetes.map(({ _id, nombre }) => (
            <option key={_id} value={_id}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div className="form-group">
        <label htmlFor="fecha">Fecha</label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </div>

      {/* Valor */}
      <div className="form-group">
        <label htmlFor="valor">Valor</label>
        <input
          type="number"
          id="valor"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          required
        />
      </div>

      {/* Acompañantes */}
      <div className="form-group">
        <label htmlFor="acompañantes">Acompañantes</label>
        <select
          multiple
          id="acompañantes"
          name="acompañantes"
          value={formData.acompañantes}
          onChange={handleChange}
        >
          {clientes
            .filter(c => c._id !== formData.cliente)
            .map(({ _id, nombre, apellido }) => (
              <option key={_id} value={_id}>
                {nombre} {apellido}
              </option>
            ))}
        </select>
      </div>

      {/* Botón */}
      <button type="submit" className="form-button">Guardar Venta</button>
    </form>
  );
};

export default VentaForm;