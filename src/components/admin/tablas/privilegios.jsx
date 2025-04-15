import React, { useEffect, useState } from 'react'; 
import DataTable from "react-data-table-component";
import { getPrivilegios } from '../../../api/privilegios';  // Asegúrate de que esta función esté obteniendo los privilegios correctamente

import '../../../css/components/tables.css';
import '../../../css/components/admin/privilegio.css';

const Privilegios = () => {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetching data from API
    useEffect(() => {
        const fetchPrivilegios = async () => {
            try {
                const response = await getPrivilegios();  // Llama a la API para obtener los privilegios
                console.log('Respuesta de la API:', response);  // Verifica la respuesta de la API
                if (response && Array.isArray(response)) {
                    setData(response); // Asigna los datos a la variable de estado "data"
                } else {
                    setError('No se encontraron privilegios.');
                }
            } catch (err) {
                setError('Hubo un error al cargar los privilegios.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPrivilegios();
    }, []);

    // Filtrado de datos según el texto de búsqueda
    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    // Componente personalizado para la columna "Estado"
    const EstadoCell = ({ row }) => (
        <div className="estado-switch">
            <label className="switch">
                <input 
                    type="checkbox" 
                    checked={row.estado}
                    onChange={(e) => {
                        console.log('Estado cambiado:', row._id, e.target.checked);
                        // Aquí podrías manejar la lógica para actualizar el estado si lo deseas
                    }}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );

    const columns = [
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            wrap: true,
            width: '300px'
        },
        {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,  // Aquí usas el componente
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px'
        }
    ];

    // Verificación de carga y errores
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Privilegios</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar Privilegios..."
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
                responsive
                highlightOnHover
                noDataComponent="No se encontraron privilegios"
            />
        </div>
    );
};

export default Privilegios;
