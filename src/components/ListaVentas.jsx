import React from 'react';

const ListaVentas = ({ ventas }) => {
  return (
    <div className="mt-4">
      <h2>Lista de Ventas</h2>
      <ul className="list-group">
        {ventas.map((venta, index) => (
          <li key={index} className="list-group-item">
            <strong>Número de Venta:</strong> {venta.numeroVenta}<br />
            <strong>Fecha:</strong> {venta.fecha}<br />
            <strong>Total:</strong> ${venta.total.toFixed(2)}<br />
            <strong>Detalle:</strong>
            <ul>
              {venta.detalle.map((item, idx) => (
                <li key={idx}>
                  {item.nombre} - Cantidad: {item.cantidad} - Precio: ${item.precio}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaVentas;
