import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal } from 'react-bootstrap';

const NuevaRecompensa = ({ show, handleClose }) => {
  const [productos, setProductos] = useState([]);
  const [idProducto, setIdProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidadRecompensa, setCantidadRecompensa] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Obtener productos al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/productos/listarTodos');
        setProductos(response.data);
      } catch (err) {
        console.error('Error al obtener los productos:', err);
        setError('Hubo un error al cargar los productos.');
      }
    };

    fetchProductos();
  }, []);

  // Función para limpiar el formulario
  const resetForm = () => {
    setIdProducto('');
    setNombreProducto('');
    setCantidadRecompensa('');
    setError('');
    setSuccess('');
  };

  // Cerrar el modal y resetear el formulario
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idProducto || !cantidadRecompensa) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const data = {
      idProducto: idProducto,
      cantidadRecompensa: parseInt(cantidadRecompensa)
    };

    try {
      const response = await axios.post('http://localhost:3000/recompensas/registrar', data);

      if (response.status === 200) {
        setSuccess(`Se han asignado ${cantidadRecompensa} recompensas al producto ${nombreProducto} correctamente.`);
        setError('');
        resetForm(); // Limpiar el formulario después de un envío exitoso
      }
    } catch (err) {
      console.error('Error al registrar recompensas:', err);
      setError('Hubo un error al registrar las recompensas.');
      setSuccess('');
    }
  };

  // Manejar cambio de producto
  const handleProductoChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = productos.find(producto => producto.id === selectedProductId);

    setIdProducto(selectedProductId);
    setNombreProducto(selectedProduct?.nombre || ''); // Actualizar nombre de producto
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Recompensa para Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Mensaje de error */}
        {error && <Alert variant="danger">{error}</Alert>}
        {/* Mensaje de éxito */}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Producto</Form.Label>
            <Form.Select
              aria-label="Selecciona un producto"
              value={idProducto}
              onChange={handleProductoChange}
              required
            >
              <option value="">--Selecciona un producto--</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad de puntos necesarios</Form.Label>
            <Form.Control
              type="number"
              placeholder="Puntos necesarios"
              value={cantidadRecompensa}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0) {
                  setCantidadRecompensa(value);
                }
              }}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Registrar Recompensa
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NuevaRecompensa;
