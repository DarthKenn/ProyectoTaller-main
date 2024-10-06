import React, { useState, useEffect } from 'react';

const FormularioProducto = ({ agregarProducto, productoEditable, cancelarEdicion, nombresDropdown, agregarNuevoNombre }) => {
    const [nombre, setNombre] = useState('');
    const [nuevoNombre, setNuevoNombre] = useState(''); // Para manejar el nuevo nombre
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');
    const [modoAgregarNombre, setModoAgregarNombre] = useState(false); // Controla si se está agregando un nuevo nombre

    useEffect(() => {
        if (productoEditable) {
            setNombre(productoEditable.nombre);
            setPrecio(productoEditable.precio);
            setDescripcion(productoEditable.descripcion);
            setStock(productoEditable.stock);
        } else {
            setNombre('');
            setNuevoNombre('');
            setPrecio('');
            setDescripcion('');
            setStock('');
        }
    }, [productoEditable]);

    const manejarEnvio = (e) => {
        e.preventDefault();
        if (!nombre || !precio || precio <= 0 || !descripcion || stock <= 0) {
            setError('Por favor, complete todos los campos correctamente.');
            return;
        }

        const nombreProducto = nuevoNombre || nombre; // Usar el nuevo nombre si se ingresó

        agregarProducto({ nombre, nombreProducto, precio, descripcion, stock });

        // Limpiar campos después de agregar el producto
        setNombre('');
        setNuevoNombre('');
        setPrecio('');
        setStock('');
        setDescripcion('');
        setError('');
        setModoAgregarNombre(false); // Resetear el modo de agregar nombre
    };

    const guardarNuevoNombre = () => {
        if (nuevoNombre.trim() === '') return; // Validar que el nuevo nombre no esté vacío
        agregarNuevoNombre(nuevoNombre); // Actualizar la lista de nombres en el dropdown
        setNombre(nuevoNombre); // Asignar el nuevo nombre al campo de nombre
        setNuevoNombre(''); // Limpiar el campo de nuevo nombre
        setModoAgregarNombre(false); // Salir del modo de agregar nombre
    };

    return (
        <form onSubmit={manejarEnvio}>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
                <label className="form-label">Nombre del Producto</label>
                <div className="input-group">
                    {/* Dropdown de productos existentes */}
                    <select
                        className="form-select"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={modoAgregarNombre} // Deshabilitar si se está en modo de agregar un nuevo nombre
                    >
                        <option value="">Seleccione un producto existente</option>
                        {nombresDropdown.map((nombre, index) => (
                            <option key={index} value={nombre}>{nombre}</option>
                        ))}
                    </select>

                    {/* Botón para activar el modo de agregar un nuevo nombre */}
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setModoAgregarNombre(true)}
                    >
                        Agregar nuevo
                    </button>
                </div>

                {/* Campo para ingresar un nuevo nombre, visible solo en modo de agregar nombre */}
                {modoAgregarNombre && (
                    <div className="mt-2">
                        <input
                            type="text"
                            className="form-control"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            placeholder="Ingrese nuevo nombre"
                        />
                        <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={guardarNuevoNombre}
                        >
                            Guardar nuevo nombre
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                    type="number"
                    className="form-control"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Cantidad (Stock)</label>
                <input
                    type="number"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <button type="submit" className="btn btn-primary me-2">
                {productoEditable ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>

            <button type="button" className="btn btn-danger" onClick={cancelarEdicion}>
                Cancelar
            </button>
        </form>
    );
};

export default FormularioProducto;




