import React from 'react';

const Carrito = ({ carrito, eliminarDelCarrito, finalizarCompra }) => {
    const totalCompra = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    const tieneSuficienteStock = () => {
        return carrito.every(item => {
            const producto = JSON.parse(localStorage.getItem('productos')).find(p => p.id === item.id);
            return producto && producto.stock >= item.cantidad;
        });
    };

    return (
        <div className="mt-4">
            <h2>Carrito de Compras</h2>
            <ul className="list-group">
                {carrito.map(item => {
                    const producto = JSON.parse(localStorage.getItem('productos')).find(p => p.id === item.id);
                    const stockSuficiente = producto && producto.stock >= item.cantidad;

                    return (
                        <li key={item.id} className={`list-group-item d-flex justify-content-between align-items-center ${!stockSuficiente ? 'bg-danger text-white' : ''}`}>
                            <div>
                                <strong>Nombre:</strong> {item.nombre}<br />
                                <strong>Precio:</strong> ${item.precio}<br />
                                <strong>Cantidad:</strong> {item.cantidad}
                                {!stockSuficiente && <div className="text-warning">No hay suficiente stock</div>}
                            </div>
                            <div className="d-flex align-items-center">
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(item.id)}>Eliminar</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="mt-3">
                <strong>Total: </strong>${totalCompra.toFixed(2)} {/* Muestra el total */}
            </div>
            <button 
                className="btn btn-success mt-3"
                onClick={finalizarCompra}
                disabled={!tieneSuficienteStock()} // Desactiva el botón si no hay suficiente stock
            >
                Finalizar Compra
            </button>
        </div>
    );
};

export default Carrito;


