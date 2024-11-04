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
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    nombre: "",
    descripcion: "",
    productos: [],
  });

  const [productos, setProductos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener productos al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/productos/listarTodos");
        setProductos(response.data); // Asegurarse de que los datos contienen id y nombre
      } catch (err) {
        console.error("Error al obtener los productos:", err);
        setErrorMessage("Hubo un error al cargar los productos.");
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
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
      const payload = {
        nombre: initialValues.nombre,
        descripcion: initialValues.descripcion,
        productos: selectedProducts.map((product) => product.id), 
      };

      if (isEditMode) {
        await axios.put(`http://localhost:3000/fruta/editar/${id}`, payload);
      } else {
        await axios.post("http://localhost:3000/fruta/registrar", payload);
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
    // Asegurarse de que el producto completo es el que se agrega
    if (product && !selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchProduct("");
    }
  };

  const handleRemoveProduct = (product) => {
    setSelectedProducts(selectedProducts.filter((item) => item.id !== product.id));
  };

  const handleClose = () => {
    setShowConfirmation(false);
    router.push("/pages/frutas/lista");
  };

  // Filtrar productos y asegurarse de que cada elemento tiene un objeto con id y nombre
  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <>
      <div>
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

              <Col md={6}>
                <h4>Agregar productos</h4>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Buscar producto"
                    value={searchProduct}
                    onChange={handleProductSearch}
                  />
                </InputGroup>

                {searchProduct && (
                  <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                    {filteredProductos.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleAddProduct(product)}
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          backgroundColor: selectedProducts.some((p) => p.id === product.id) ? '#f0f0f0' : 'white'
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
                    {selectedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.nombre}</td>
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
