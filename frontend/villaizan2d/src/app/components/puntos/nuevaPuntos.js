import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal } from 'react-bootstrap';

const NuevaPuntos = ({ show, handleClose }) => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [idProducto, setIdProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidadPuntos, setCantidadPuntos] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Obtener productos al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);
        setProductos(response.data);
        setFilteredProductos(response.data);
      } catch (err) {
        console.error('Error al obtener los productos:', err);
        setError('Hubo un error al cargar los productos.');
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProductos(filtered);
    } else {
      setFilteredProductos(productos);
    }
  }, [searchTerm, productos]);

  // Función para limpiar el formulario
  const resetForm = () => {
    setIdProducto('');
    setNombreProducto('');
    setCantidadPuntos('');
    setError('');
    setSearchTerm('');
    setFilteredProductos(productos);
    setShowDropdown(false);
  };

  // Cerrar el modal y resetear el formulario
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idProducto || !cantidadPuntos) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const data = {
      idProducto: idProducto,
      cantidadPuntos: parseInt(cantidadPuntos)
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/puntos_producto/registrar`, data);
      if (response.status === 200) {
        setShowConfirmation(true);
        setError('');
        resetForm();
      }
    } catch (err) {
      console.error('Error al registrar puntos:', err);
      setError('Hubo un error al registrar los puntos.');
    }
  };

  // Manejar el clic en el campo de Producto
  const handleProductoClick = () => {
    setShowDropdown(true);
  };

  // Manejar la selección de producto
  const handleProductoSelect = (producto) => {
    setIdProducto(producto.id);
    setNombreProducto(producto.nombre);
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Cerrar ambos modales al cerrar el de confirmación
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    handleModalClose();
  };

  // Estilos para el dropdown
  const dropdownStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Recompensa para Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Producto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar producto..."
                  value={nombreProducto}
                  onClick={handleProductoClick}
                  readOnly
                />
                {showDropdown && (
                  <ul className="list-group mt-2" style={dropdownStyle}>
                    {filteredProductos.length > 0 ? (
                      filteredProductos.map((producto) => (
                        <li
                          key={producto.id}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleProductoSelect(producto)}
                        >
                          {producto.nombre}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No se encontraron productos.</li>
                    )}
                  </ul>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cantidad de Puntos</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Cantidad de Puntos"
                  value={cantidadPuntos}
                  onChange={(e) => setCantidadPuntos(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Registrar Puntos
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de éxito */}
      <Modal show={showConfirmation} onHide={handleConfirmationClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se han asignado {cantidadPuntos} puntos al producto {nombreProducto} correctamente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleConfirmationClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NuevaPuntos;













