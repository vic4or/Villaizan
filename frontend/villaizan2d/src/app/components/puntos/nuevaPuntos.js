import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const NuevaPuntos = () => {
  const [productos, setProductos] = useState([]);
  const [idProducto, setIdProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [cantidadPuntos, setCantidadPuntos] = useState('');
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
      console.log('Enviando datos a la API:', data); // Verificación antes del envío
      const response = await axios.post('http://localhost:3000/puntos_producto/registrar', data);
      
      console.log('Respuesta de la API:', response); // Verificar la respuesta de la API

      if (response.status === 200) {
        setSuccess(`Se han asignado ${cantidadPuntos} puntos al producto ${nombreProducto} correctamente.`);
        setError('');
        setCantidadPuntos(''); // Limpiar cantidad de puntos
      }
    } catch (err) {
      console.error('Error al registrar puntos:', err);
      setError('Hubo un error al registrar los puntos.');
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
    <div>
      <h4>Registrar Puntos para Producto</h4>
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
  );
};

export default NuevaPuntos;









