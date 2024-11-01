"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, InputGroup, FormControl, Table, Modal, Alert } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

export default function FormularioFruta() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id); // Determina si estamos en modo edición o creación

  const [initialValues, setInitialValues] = useState({
    nombre: "",
    descripcion: "",
    productos: [],
  });

  const [productos, setProductos] = useState([]); // Estado para los productos cargados de la API
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener productos al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/producto/listarTodos");
        setProductos(response.data);
      } catch (err) {
        console.error("Error al obtener los productos:", err);
        setErrorMessage("Hubo un error al cargar los productos.");
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    // Cargar datos de la fruta si estamos en modo edición
    if (isEditMode) {
      const fetchFrutaById = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/fruta/${id}`);
          const fruta = response.data;

          setInitialValues({
            nombre: fruta.nombre,
            descripcion: fruta.descripcion,
            productos: fruta.productos,
          });
          setSelectedProducts(fruta.productos);
        } catch (error) {
          console.error("Error al obtener la fruta:", error);
        }
      };

      fetchFrutaById();
    }
  }, [isEditMode, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!initialValues.nombre || !initialValues.descripcion) {
      setFormError(true);
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }

    try {
      if (isEditMode) {
        // Editar fruta existente
        await axios.put(`http://localhost:3000/fruta/editar/${id}`, {
          nombre: initialValues.nombre,
          descripcion: initialValues.descripcion,
          productos: selectedProducts,
        });
      } else {
        // Crear nueva fruta
        await axios.post("http://localhost:3000/fruta/registrar", {
          nombre: initialValues.nombre,
          descripcion: initialValues.descripcion,
          productos: selectedProducts,
        });
      }

      setShowConfirmation(true);
      setFormError(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al guardar la fruta:", error);
      setFormError(true);
      setErrorMessage("Error al guardar la fruta. Inténtalo de nuevo.");
    }
  };

  const handleProductSearch = (event) => {
    setSearchProduct(event.target.value);
  };

  const handleAddProduct = (product) => {
    if (product && !selectedProducts.includes(product)) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchProduct("");
    }
  };

  const handleRemoveProduct = (product) => {
    setSelectedProducts(selectedProducts.filter((item) => item !== product));
  };

  const handleClose = () => {
    setShowConfirmation(false);
    router.push("/pages/frutas/lista");
  };

  // Filtrar productos según el término de búsqueda
  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <>
      <div>
        {/* Popup de confirmación */}
        <Modal show={showConfirmation} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>La fruta se ha {isEditMode ? "actualizado" : "guardado"} exitosamente.</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="breadcrumb-container">
          <p className="text-muted">Gestión del sistema &gt; Frutas &gt; {isEditMode ? "Editar Fruta" : "Nueva Fruta"}</p>
        </div>

        <Container
          style={{
            background: "#ffffff",
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "30px",
            marginLeft: "30px",
            maxWidth: "95%",
          }}
        >
          <h2 className="mb-4">{isEditMode ? "Editar Fruta" : "Nueva Fruta"}</h2>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <h4>Información general</h4>
                {/* Nombre de la fruta */}
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Fruta</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la fruta"
                    className="form-control-custom"
                    value={initialValues.nombre}
                    onChange={(e) => setInitialValues({ ...initialValues, nombre: e.target.value })}
                    required
                  />
                </Form.Group>

                {/* Descripción de la fruta */}
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción de la fruta..."
                    className="form-control-custom"
                    value={initialValues.descripcion}
                    onChange={(e) => setInitialValues({ ...initialValues, descripcion: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Sección de Productos */}
              <Col md={6}>
                <h4>Agregar productos</h4>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Buscar producto"
                    value={searchProduct}
                    onChange={handleProductSearch}
                  />
                  <Button variant="outline-secondary" onClick={() => handleAddProduct(searchProduct)}>Agregar</Button>
                </InputGroup>

                {/* Lista de productos filtrados */}
                {searchProduct && (
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                    {filteredProductos.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleAddProduct(product.nombre)}
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedProducts.includes(product.nombre) ? '#f0f0f0' : 'white'
                        }}
                      >
                        {product.nombre}
                      </div>
                    ))}
                  </div>
                )}

                <h5>Listado final</h5>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Productos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product}</td>
                        <td>
                          <Button variant="outline-danger" size="sm" onClick={() => handleRemoveProduct(product)}>
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            {formError && (
              <Alert variant="danger" className="mb-3">
                {errorMessage}
              </Alert>
            )}

            {/* Botones para guardar y cancelar */}
            <div className="d-flex justify-content-end button-group">
              <Button variant="danger" type="submit" className="btn-custom me-2">
                {isEditMode ? "ACTUALIZAR" : "GUARDAR"}
              </Button>
              <Button variant="light" type="button" className="btn-cancel" onClick={() => router.back()}>
                CANCELAR
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
}
