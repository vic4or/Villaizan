import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal } from 'react-bootstrap';

const NuevaRecompensa = ({ show, handleClose }) => {
  const [productos, setProductos] = useState([]);
  const [id_producto, setid_producto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [puntosnecesarios, setpuntosnecesarios] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false); // Modal de confirmación

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
    setid_producto('');
    setNombreProducto('');
    setpuntosnecesarios('');
    setError('');
    setSearchTerm('');
  };

  // Cerrar el modal y resetear el formulario
  const handleModalClose = () => {
    resetForm();
    handleClose(); // Cierra el modal principal
  };

  // Manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_producto || !puntosnecesarios) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const data = {
      id_producto: id_producto,
      puntosnecesarios: parseInt(puntosnecesarios)
    };

    try {
      const response = await axios.post('http://localhost:3000/recompensa_puntos/registrar', data);

      if (response.status === 200) {
        setShowConfirmation(true); // Muestra el modal de confirmación
        setError('');
      }
    } catch (err) {
      console.error('Error al registrar recompensas:', err);
      setError('Hubo un error al registrar las recompensas.');
    }
  };

  // Manejar cambio de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar la selección de un producto
  const handleProductoSelect = (producto) => {
    setid_producto(producto.id);
    setNombreProducto(producto.nombre);
    setSearchTerm(producto.nombre);
  };

  // Filtrar los productos según el término de búsqueda
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar ambos modales al cerrar el de confirmación
  const handleConfirmationClose = () => {
    setShowConfirmation(false); // Cierra el modal de confirmación
    handleModalClose(); // Cierra el modal principal y limpia el formulario
  };

  return (
    <>
      {/* Modal principal para registrar recompensa */}
      <Modal show={show} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Recompensa para Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mensaje de error */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {searchTerm && (
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', marginTop: '5px', borderRadius: '4px' }}>
                  {filteredProductos.map((producto) => (
                    <div
                      key={producto.id}
                      onClick={() => handleProductoSelect(producto)}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        backgroundColor: id_producto === producto.id ? '#f0f0f0' : 'white'
                      }}
                    >
                      {producto.nombre}
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad de puntos necesarios</Form.Label>
              <Form.Control
                type="number"
                placeholder="Puntos necesarios"
                value={puntosnecesarios}
                onChange={(e) => setpuntosnecesarios(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Registrar Recompensa
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de éxito */}
      <Modal show={showConfirmation} onHide={handleConfirmationClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se han asignado {puntosnecesarios} puntos necesarios al producto {nombreProducto} correctamente.</p>
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

export default NuevaRecompensa;
