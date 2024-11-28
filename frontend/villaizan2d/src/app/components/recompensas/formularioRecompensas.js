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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  

  // Obtener productos y recompensas al cargar el componente
  const fetchProductosYRecompensas = async () => {
    try {
      const productosResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);
      const recompensasResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/recompensa_puntos/listarTodos`);
      
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/recompensa_puntos/registrar`, data);
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

  const dropdownStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
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
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <ul className="list-group mt-2" style={dropdownStyle}>
                  {filteredProductos.length > 0 ? (
                    filteredProductos.map((producto) => (
                      <li
                        key={producto.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setid_producto(producto.id);
                          setNombreProducto(producto.nombre);
                          setSearchTerm('');
                          setShowDropdown(false);
                        }}
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
