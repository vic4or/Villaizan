import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal } from 'react-bootstrap';

const NuevaRecompensa = ({ show, handleClose , onRecompensaAdded  }) => {
  const [productos, setProductos] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [id_producto, setid_producto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [puntosnecesarios, setpuntosnecesarios] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Obtener productos y recompensas al cargar el componente
  const fetchProductosYRecompensas = async () => {
    try {
      const productosResponse = await axios.get('http://localhost:3000/productos/listarTodos');
      const recompensasResponse = await axios.get('http://localhost:3000/recompensa_puntos/listarTodos');
      
      setProductos(productosResponse.data);
      setRecompensas(recompensasResponse.data);
    } catch (err) {
      console.error('Error al obtener los datos:', err);
      setError('Hubo un error al cargar los productos y recompensas.');
    }
  };

  useEffect(() => {
    if (show) {
      fetchProductosYRecompensas();
    }
  }, [show]);
  
  // Función para limpiar el formulario
  const resetForm = () => {
    setid_producto('');
    setNombreProducto('');
    setpuntosnecesarios('');
    setError('');
  };

  // Cerrar el modal y resetear el formulario
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  // Manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_producto || !puntosnecesarios) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const puntos = parseInt(puntosnecesarios);
    if (puntos < 10 || puntos > 90) {
      setError('El puntaje que se asignará debe de ser como mínimo 10 y como máximo 90.');
      return;
    }

    // Verificar si el producto ya tiene asignada una recompensa activa
    const recompensaExistente = recompensas.find(
      (recompensa) => recompensa.id_producto === id_producto && recompensa.estado === true
    );

    if (recompensaExistente) {
      setError(`El producto seleccionado ya tiene asignada una cantidad de puntos (${recompensaExistente.puntosnecesarios}).`);
      return;
    }

    const data = {
      id_producto: id_producto,
      puntosnecesarios: puntos
    };

    try {
      const response = await axios.post('http://localhost:3000/recompensa_puntos/registrar', data);
      console.log(response);
      if (response.status === 201) {
        const nuevaRecompensa = response.data; // Obtener la recompensa registrada de la respuesta
        setRecompensas([...recompensas, nuevaRecompensa]); // Agregar al estado de recompensas
        setShowConfirmation(true);
        setError('');

        onRecompensaAdded();

        resetForm();
      }
    } catch (err) {
      console.error('Error al registrar recompensas:', err);
      setError('Hubo un error al registrar las recompensas.');
    }
  };

  // Manejar la selección de un producto
  const handleProductoSelect = (e) => {
    const selectedProducto = productos.find((producto) => producto.nombre === e.target.value);
    if (selectedProducto) {
      setid_producto(selectedProducto.id);
      setNombreProducto(selectedProducto.nombre);
    }
  };

  // Cerrar ambos modales al cerrar el de confirmación
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    handleModalClose();
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
                list="productos"
                placeholder="Seleccione un producto..."
                value={nombreProducto}
                onChange={handleProductoSelect}
                autoComplete="off"
              />
              <datalist id="productos">
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.nombre} />
                ))}
              </datalist>
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

            <div className="d-flex justify-content-center">
              <Button variant="danger" type="submit">
                Registrar Recompensa
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación de éxito */}
      <Modal show={showConfirmation} onHide={handleConfirmationClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se han asignado los puntos necesarios correctamente.</p>
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
