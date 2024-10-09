"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, InputGroup, FormControl, Table, Modal, Alert } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";

export default function FormularioPromocion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("editar") === "true";
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    tipo: "",
    descuento: "",
    limiteStock: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    productos: [],
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState(false);

  const availableProducts = [
    "Paleta - Fresa",
    "Paleta - Aguaje",
    "Mafeleta - Ron",
    "Mafeleta - Coco",
    "Mafeleta - Lúcuma",
    "Helado - Vainilla",
    "Helado - Chocolate"
  ];

  useEffect(() => {
    if (isEditMode) {
      const id = searchParams.get("id");
      // Aquí deberías hacer la lógica para obtener los datos de la promoción a editar por ID
      // y luego actualizar el estado con los valores obtenidos.
      // Ejemplo:
      // fetchPromotionById(id).then(data => setInitialValues(data));
      setInitialValues({
        nombre: "Helado Natural",
        tipo: "Oferta Especial",
        descuento: "50",
        limiteStock: "100",
        fechaInicio: "2024-09-29",
        fechaFin: "2024-10-29",
        descripcion: "Obtén un 50% de descuento por un helado por día de las frutas",
        productos: ["Paleta - Fresa", "Paleta - Aguaje", "Mafeleta - Ron", "Mafeleta - Coco", "Mafeleta - Lúcuma"],
      });
    }
  }, [isEditMode, searchParams]);

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;

    if (!initialValues.nombre || !initialValues.tipo || !initialValues.descuento || !initialValues.fechaInicio || !initialValues.fechaFin || !initialValues.descripcion) {
      setFormError(true);
      valid = false;
    }

    if (initialValues.tipo === "Paquete" && selectedProducts.length < 2) {
      setFormError(true);
      valid = false;
    }

    if (new Date(initialValues.fechaFin) < new Date(initialValues.fechaInicio)) {
        setFormError(true);
        valid = false;
        message = "La fecha de fin no puede ser menor a la fecha de inicio.";
      }

      if (valid) {
        setShowConfirmation(true);
        setFormError(false);
        setErrorMessage("");
      } else {
        setFormError(true);
        setErrorMessage(message);
      }
  };

  const handleProductSearch = (event) => {
    setSearchProduct(event.target.value);
  };

  const handleAddProduct = () => {
    if (searchProduct && availableProducts.includes(searchProduct) && !selectedProducts.includes(searchProduct)) {
      setSelectedProducts([...selectedProducts, searchProduct]);
      setSearchProduct("");
    }
  };

  const handleRemoveProduct = (product) => {
    setSelectedProducts(selectedProducts.filter((item) => item !== product));
  };

  const handleClose = () => setShowConfirmation(false);

  return (
    <>
      <div>
        {/* Popup de confirmación */}
        <Modal show={showConfirmation} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>La promoción se ha guardado exitosamente.</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="breadcrumb-container">
          <p className="text-muted">Gestión del sistema &gt; Promociones &gt; {isEditMode ? "Editar Promoción" : "Nueva Promoción"}</p>
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
          <h2 className="mb-4">{isEditMode ? "Editar Promoción" : "Nueva Promoción"}</h2>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <h4>Información general</h4>
                {/* Nombre de la promoción */}
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la promoción"
                    className="form-control-custom"
                    value={initialValues.nombre}
                    onChange={(e) => setInitialValues({ ...initialValues, nombre: e.target.value })}
                    required
                  />
                </Form.Group>

                {/* Tipo de Promoción */}
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    aria-label="Selecciona un tipo"
                    className="form-select-custom"
                    onChange={(e) => setInitialValues({ ...initialValues, tipo: e.target.value })}
                    required
                    value={initialValues.tipo}
                  >
                    <option value="">--Selecciona un tipo--</option>
                    <option value="Oferta Especial">Oferta Especial</option>
                    <option value="Descuento">Descuento</option>
                    <option value="Paquete">Paquete</option>
                  </Form.Select>
                </Form.Group>

                {/* Descuento */}
                <Form.Group className="mb-3">
                  <Form.Label>% Descuento</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="% Descuento"
                    className="form-control-custom"
                    value={initialValues.descuento}
                    onChange={(e) => setInitialValues({ ...initialValues, descuento: e.target.value })}
                    required
                  />
                </Form.Group>

                {/* Límite de Stock */}
                <Form.Group className="mb-3">
                  <Form.Label>Límite Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Límite de stock"
                    className="form-control-custom"
                    value={initialValues.limiteStock}
                    onChange={(e) => setInitialValues({ ...initialValues, limiteStock: e.target.value })}
                  />
                </Form.Group>

                {/* Fechas */}
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-custom"
                    value={initialValues.fechaInicio}
                    onChange={(e) => setInitialValues({ ...initialValues, fechaInicio: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    className="form-control-custom"
                    value={initialValues.fechaFin}
                    onChange={(e) => setInitialValues({ ...initialValues, fechaFin: e.target.value })}
                    required
                  />
                </Form.Group>

                {/* Descripción */}
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción..."
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
                    list="productOptions"
                  />
                  <datalist id="productOptions">
                    {availableProducts.map((product, index) => (
                      <option key={index} value={product} />
                    ))}
                  </datalist>
                  <Button variant="outline-secondary" onClick={handleAddProduct}>Agregar</Button>
                </InputGroup>

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
                            Eliminar
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
                Todos los campos obligatorios deben ser completados.
                {initialValues.tipo === "Paquete" && selectedProducts.length < 2 && <div>Para el tipo "Paquete", debe seleccionar al menos dos productos.</div>}
                {(new Date(initialValues.fechaFin) < new Date(initialValues.fechaInicio) )&& <div>La fecha de fin no puede ser menor a la fecha de inicio.</div>}
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
