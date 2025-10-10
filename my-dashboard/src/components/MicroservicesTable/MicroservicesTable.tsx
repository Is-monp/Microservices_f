import React from 'react';
import './MicroservicesTable.scss';

interface Microservice {
  containerName: string;
  status: boolean;
  createdAt: string;
}

interface MicroservicesTableProps {
  data: Microservice[];
}

const MicroservicesTable: React.FC<MicroservicesTableProps> = ({ data }) => {
  return (
    <div className="microservices-table">
      <div className="microservices-table__header">
        <h2 className="microservices-table__title">Historial de Microservicios</h2>
      </div>

      <div className="microservices-table__container">
        {data.length === 0 ? (
          <p className="microservices-table__empty">No hay registros disponibles</p>
        ) : (
          <table className="microservices-table__table">
            <thead>
              <tr className="microservices-table__header-row">
                <th className="microservices-table__header-cell">Nombre</th>
                <th className="microservices-table__header-cell">Estado</th>
                <th className="microservices-table__header-cell">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.map((service, index) => (
                <tr key={index} className="microservices-table__row">
                  <td className="microservices-table__cell microservices-table__cell--name">
                    {service.containerName}
                  </td>
                  <td className="microservices-table__cell">
                    <span
                      className={`microservices-table__status microservices-table__status--${
                        service.status ? 'activo' : 'detenido'
                      }`}
                    >
                      {service.status ? 'Activo' : 'Detenido'}
                    </span>
                  </td>
                  <td className="microservices-table__cell microservices-table__cell--time">
                    {new Date(service.createdAt).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MicroservicesTable;
