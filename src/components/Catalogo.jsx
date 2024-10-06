import React, { useState, useEffect } from 'react';
import FormularioProducto from './FormularioProducto';
import ListaProductos from './ListaProductos';
import Carrito from './Carrito';

const Catalogo = () => {
  const [productos, setProductos] = useState(() => {
    const savedProductos = localStorage.getItem('productos');
    return savedProductos ? JSON.parse(savedProductos) : initialProductos; // inicialProductos debería ser tu lista original de productos
  });

  const [carrito, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem('carrito');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [ventas, setVentas] = useState([]); // Para guardar el detalle de ventas
  const [nombresDropdown, setNombresDropdown] = useState(() => {
    return JSON.parse(localStorage.getItem('nombresDropdown')) || [];
  });

  const [productoEditable, setProductoEditable] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPorPag] = useState(10);
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [ordenCampo, setOrdenCampo] = useState('nombre');
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(storedProducts);
  }, []);

  useEffect(() => {
    realizarBusqueda();
  }, [busqueda]);

  useEffect(() => {
    localStorage.setItem('nombresDropdown', JSON.stringify(nombresDropdown));
  }, [nombresDropdown]);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('productos', JSON.stringify(productos));
  }, [carrito, productos]);

  const realizarBusqueda = () => {
    if (busqueda.trim() === '') {
      setResultadosBusqueda([]);
      return;
    }

    const terminoMinuscula = busqueda.trim().toLowerCase();
    const resultados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(terminoMinuscula) ||
      producto.categoria.toLowerCase().includes(terminoMinuscula) ||
      producto.precio.toString().includes(terminoMinuscula)
    );

    setResultadosBusqueda(resultados);
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setResultadosBusqueda([]);
  };

  const agregarProducto = (producto) => {
    let nuevosProductos;
    if (productoEditable) {
      nuevosProductos = productos.map((prod) =>
        prod.id === productoEditable.id ? { ...producto, id: productoEditable.id } : prod
      );
      mostrarMensajeTemporalmente('success', 'Producto editado correctamente.');
    } else {
      nuevosProductos = [...productos, { ...producto, id: productos.length + 1 }];
      mostrarMensajeTemporalmente('success', 'Producto agregado correctamente.');
    }
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setProductoEditable(null);
    setMostrarFormulario(false);
  };

  const agregarNuevoNombre = (nombre) => {
    if (!nombresDropdown.includes(nombre)) {
      setNombresDropdown([...nombresDropdown, nombre]);
    }
  };

  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter((producto) => producto.id !== id);
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
  };

  const editarProducto = (id) => {
    const productoAEditar = productos.find((producto) => producto.id === id);
    setProductoEditable(productoAEditar);
    setMostrarFormulario(true);
  };

  const cancelarEdicion = () => {
    setProductoEditable(null);
    setMostrarFormulario(false);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setProductoEditable(null);
  };

  const mostrarMensajeTemporalmente = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setMensajeVisible(true);

    setTimeout(() => {
      setMensajeVisible(false);
    }, 4000);
  };

  const agregarAlCarrito = (id, cantidad) => {
    const productoEncontrado = productos.find(p => p.id === id);

    if (productoEncontrado) {
      const nuevoProducto = {
        id: productoEncontrado.id,
        nombre: productoEncontrado.nombre,
        precio: productoEncontrado.precio,
        cantidad: parseInt(cantidad)
      };

      setCarrito(prev => {
        const existe = prev.find(item => item.id === nuevoProducto.id);
        if (existe) {
          return prev.map(item =>
            item.id === nuevoProducto.id ? { ...item, cantidad: item.cantidad + nuevoProducto.cantidad } : item
          );
        }
        return [...prev, nuevoProducto];
      });
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const realizarVenta = () => {
    const nuevosProductos = [...productos];

    carrito.forEach(item => {
      const productoEncontrado = nuevosProductos.find(producto => producto.id === item.id);
      if (productoEncontrado) {
        productoEncontrado.stock -= item.cantidad; // Resta la cantidad vendida
      }
    });

    setProductos(nuevosProductos); // Actualiza el estado de los productos
    console.log("Venta realizada:", carrito);
    setCarrito([]); // Resetea el carrito después de realizar la venta
    localStorage.removeItem('carrito'); // Elimina el carrito del local storage
  };

  const indexOfLastProducto = currentPage * productosPorPag;
  const indexOfFirstProducto = indexOfLastProducto - productosPorPag;
  const productosOrdenados = [...productos];

  if (ordenCampo === 'nombre') {
    productosOrdenados.sort((a, b) =>
      ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    );
  } else if (ordenCampo === 'categoria') {
    productosOrdenados.sort((a, b) =>
      ordenAscendente ? a.categoria.localeCompare(b.categoria) : b.categoria.localeCompare(a.categoria)
    );
  } else if (ordenCampo === 'precio') {
    productosOrdenados.sort((a, b) =>
      ordenAscendente ? a.precio - b.precio : b.precio - a.precio
    );
  }

  const productosMostrados = busqueda.trim() === '' ? productosOrdenados.slice(indexOfFirstProducto, indexOfLastProducto) : resultadosBusqueda;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1 className="my-4">Catálogo de Productos</h1>
      {mensajeVisible && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setMensajeVisible(false)}></button>
        </div>
      )}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div className="btn-group">
          <button className={`btn btn-outline-primary ${ordenCampo === 'nombre' ? 'active' : ''}`} onClick={() => ordenarProductos('nombre')}>
            Nombre {ordenCampo === 'nombre' && (ordenAscendente ? '▲' : '▼')}
          </button>
          <button className={`btn btn-outline-primary ${ordenCampo === 'categoria' ? 'active' : ''}`} onClick={() => ordenarProductos('categoria')}>
            Categoría {ordenCampo === 'categoria' && (ordenAscendente ? '▲' : '▼')}
          </button>
          <button className={`btn btn-outline-primary ${ordenCampo === 'precio' ? 'active' : ''}`} onClick={() => ordenarProductos('precio')}>
            Precio {ordenCampo === 'precio' && (ordenAscendente ? '▲' : '▼')}
          </button>
        </div>
      </div>
      <div className="mb-3">
        {mostrarFormulario ? (
          <FormularioProducto
            agregarProducto={agregarProducto}
            productoEditable={productoEditable}
            cancelarEdicion={cancelarEdicion}
            productos={productos}
            nombresDropdown={nombresDropdown}
            agregarNuevoNombre={agregarNuevoNombre}
          />
        ) : (
          <button className="btn btn-primary mb-3" onClick={toggleFormulario}>Agregar Producto</button>
        )}
      </div>
      <ListaProductos
        productos={productosMostrados}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
        agregarAlCarrito={agregarAlCarrito}
      />
      <Carrito
        carrito={carrito}
        realizarVenta={realizarVenta}
        eliminarDelCarrito={eliminarDelCarrito}
      />
      <Pagination
        productosPorPag={productosPorPag}
        totalProductos={productos.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Catalogo;














































