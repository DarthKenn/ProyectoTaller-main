import React, { useState } from 'react';

const ListaProductos = ({ productos, eliminarProducto, editarProducto, agregarAlCarrito }) => {
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [cantidad, setCantidad] = useState({}); // Estado para manejar las cantidades
    const [descripcionVisible, setDescripcionVisible] = useState(null);

    const handleCantidadChange = (id, value) => {
        setCantidad(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const toggleSeleccion = (id) => {
        const seleccionados = [...productosSeleccionados];
        const index = seleccionados.indexOf(id);
        if (index === -1) {
            seleccionados.push(id);
        } else {
            seleccionados.splice(index, 1);
        }
        setProductosSeleccionados(seleccionados);
    };

    const Seleccionado = (id) => {
        return productosSeleccionados.includes(id);
    };

    const mostrarDescripcion = (id) => {
        if (descripcionVisible === id) {
            setDescripcionVisible(null);
        } else {
            setDescripcionVisible(id);
        }
    };

    const descripcionActiva = (id) => {
        return descripcionVisible === id;
    };

    return (
        <div className="mt-4">
            <h2>Lista de Productos</h2>
            <ul className="list-group">
                {productos.map((producto) => (
                    <li
                        key={producto.id}
                        className={`list-group-item d-flex justify-content-between align-items-center 
                            ${Seleccionado(producto.id) ? 'bg-success' : ''}
                            ${producto.stock <= 5 ? 'bg-warning' : ''}`} // Resaltar en amarillo si el stock es <= 5
                    >
                        <div>
                            <strong>Nombre:</strong> {producto.nombre}<br />
                            <strong>Precio:</strong> ${producto.precio}<br />
                            <strong>Cantidad:</strong> {producto.stock}

                            {producto.stock <= 5 && (
                                <div className="text-danger">
                                    <strong>Poco stock disponible</strong>
                                </div>
                            )}

                            {descripcionActiva(producto.id) && (
                                <div>
                                    <strong>Descripción:</strong> {producto.descripcion}
                                </div>
                            )}
                        </div>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-info btn-sm me-2" onClick={() => mostrarDescripcion(producto.id)}>
                                {descripcionActiva(producto.id) ? 'Cerrar Descripción' : 'Ver Descripción'}
                            </button>
                            <button className="btn btn-primary btn-sm me-2" onClick={() => editarProducto(producto.id)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                        </div>
                        <div className="d-flex align-items-center">
                            <input
                                type="number"
                                min="1"
                                max={producto.stock} // Limita la cantidad máxima al stock disponible
                                value={cantidad[producto.id] || 1} // Establece el valor inicial
                                onChange={(e) => handleCantidadChange(producto.id, e.target.value)} // Maneja el cambio de cantidad
                                className="form-control me-2"
                            />
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                    agregarAlCarrito(producto.id, cantidad[producto.id] || 1); // Agrega al carrito
                                    setCantidad(prev => ({ ...prev, [producto.id]: 1 })); // Resetea la cantidad a 1 después de agregar
                                }}
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaProductos;


























