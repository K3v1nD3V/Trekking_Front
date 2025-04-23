import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getPermisos } from '../../../api/permisos';
import '../../../css/components/tables.css';
import '../../../css/components/admin/permisos.css';

const Permisos = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPrivilegios, setExpandedPrivilegios] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPermisos();
        if (Array.isArray(response)) {
          setData(response);
        } else if (response?.permisos && Array.isArray(response.permisos)) {
          setData(response.permisos);
        } else {
          throw new Error('Los datos no son válidos');
        }
      } catch (err) {
        setError('Hubo un error al cargar los permisos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePrivilegios = (permisoId) => {
    setExpandedPrivilegios(prev => ({
      ...prev,
      [permisoId]: !prev[permisoId],
    }));
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const columns = [
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      width: '250px',
    },
    {
      name: 'Estado',
      cell: row => (
        <div className="estado-switch">
          <label className="switch">
            <input type="checkbox" checked={row.estado} readOnly />
            <span className="slider round"></span>
          </label>
        </div>
      ),
      width: '120px',
    },
    {
      name: 'Privilegios',
      cell: row => {
        const isExpanded = expandedPrivilegios[row._id];

        return (
          <div className="privilegios-expandibles">
            <div
              className="permiso-header"
              onClick={() => togglePrivilegios(row._id)}
            >
              <span className="flecha">{isExpanded ? '▼' : '▶'}</span>
              <strong>Ver Privilegios</strong>
            </div>

            {isExpanded && (
              <ul className="privilegios-sublista">
                {Array.isArray(row.privilegios) && row.privilegios.length > 0 ? (
                  row.privilegios.map((priv, idx) => (
                    <li key={idx} className="priv-item">– {priv.descripcion}</li>
                  ))
                ) : (
                  <li className="text-muted italic">Sin privilegios</li>
                )}
              </ul>
            )}
          </div>
        );
      },
      width: '250px',
    },
  ];

  if (loading) return <div className="loading">Cargando permisos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Permisos</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Buscar permisos..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="table-search"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        highlightOnHover
        noDataComponent="No se encontraron permisos"
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#fafafa',
              fontWeight: '600',
              fontSize: '14px',
            },
          },
          cells: {
            style: {
              fontSize: '14px',
              padding: '12px 8px',
              verticalAlign: 'top',
            },
          },
        }}
      />
    </div>
  );
};

export default Permisos;
