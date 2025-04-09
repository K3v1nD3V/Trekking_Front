import React, { useState } from 'react';
import DataTable from "react-data-table-component";

import '../../../css/components/tables.css';
import '../../../css/components/admin/privilegio.css';

const Privilegios = ({ data }) => {
    const [filterText, setFilterText] = useState('');

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
                        console.log('Estado cambiado:', row.id, e.target.checked);
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
            width: '200px'
        },
        {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,  // Aquí usas el componente
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '200px'
        }
    ];

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
