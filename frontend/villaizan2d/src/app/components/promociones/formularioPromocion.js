"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, InputGroup, FormControl, Table, Modal, Alert } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function FormularioPromocion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id); // Si hay un ID, estamos en modo edición

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
  const [errorMessage, setErrorMessage] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);

  /*const availableProducts = [
    "Paleta - Fresa",
    "Paleta - Aguaje",
    "Mafeleta - Ron",
    "Mafeleta - Coco",
    "Mafeleta - Lúcuma",
    "Helado - Vainilla",
    "Helado - Chocolate"
  ];*/

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);
        setAvailableProducts(response.data.map((product) => ({
          id: product.id,
          nombre: product.nombre,
        })));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Función para formatear la fecha a yyyy-MM-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const fetchPromotionById = async (id) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/descuento/listarUno/${id}`);
      return response.data; // Retorna los datos de la promoción obtenidos de la API
    } catch (error) {
      console.error("Error al obtener la promoción: ", error);
      return null; // Retorna null en caso de error
    }
  };

  useEffect(() => {
    const loadPromotion = async () => {
      if (isEditMode) {
        const promotion = await fetchPromotionById(id);
        console.log("ID: ", id);
        console.log("Promotion: ",promotion);
        if (promotion) {
          const formattedFechaInicio = promotion.fechainicio ? formatDate(promotion.fechainicio) : '';
          const formattedFechaFin = promotion.fechafin ? formatDate(promotion.fechafin) : '';
          setInitialValues({
            nombre: promotion.titulo,
            tipo: "Descuento",
            descuento: promotion.porcentajedescuento,
            limiteStock: promotion.limitestock || "",
            fechaInicio: formattedFechaInicio,
            fechaFin: formattedFechaFin,
            descripcion: promotion.descripcion,
            productos: promotion.vi_producto,
          });
          setSelectedProducts(promotion.vi_producto || []); // Asegúrate de que productos es un array
        }
      }
    };

    loadPromotion();
  }, [isEditMode, id]);

  const updateDiscount = async () => {
    // Construir el payload para la API de edición
    const payload = {
      titulo: initialValues.nombre,
      descripcion: initialValues.descripcion,
      fechaInicio: initialValues.fechaInicio,
      fechaFin: initialValues.fechaFin,
      limiteStock: parseInt(initialValues.limiteStock, 10),
      porcentajeDescuento: parseFloat(initialValues.descuento),
      vi_productoIds: selectedProducts.map((product) => product.id),
    };
  
    try {
      console.log("Actualizando el descuento con datos:", payload);
      // Llamar a la API de edición usando el método PATCH y pasando el id del descuento
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/descuento/editar/${id}`, payload);
      setShowConfirmation(true);
      setFormError(false);
      setErrorMessage("");
      console.log("Descuento actualizado:", response.data);
    } catch (error) {
      console.error("Error al actualizar el descuento:", error);
      setFormError(true);
      setErrorMessage("Error al actualizar el descuento. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let valid = true;
    let message = "";
  
    // Obtener la fecha actual ajustada a la zona horaria local
    const todayFormatted = getTodayDate();
  
    // Verifica las fechas del formulario
    const fechaInicio = initialValues.fechaInicio;
    const fechaFin = initialValues.fechaFin;
  
    console.log("Fecha de hoy:", todayFormatted);
    console.log("Fecha de inicio:", fechaInicio);
    console.log("Fecha de fin:", fechaFin);
  
    // Validaciones
    if (!initialValues.nombre || !initialValues.tipo || !initialValues.descuento || !fechaInicio || !fechaFin || !initialValues.descripcion) {
      valid = false;
      message = "Todos los campos obligatorios deben ser completados.";
    }
  
    if (initialValues.tipo === "Paquete" && selectedProducts.length < 2) {
      valid = false;
      message = "Para el tipo \"Paquete\", debe seleccionar al menos dos productos.";
    }
  
    if (initialValues.descuento < 1 || initialValues.descuento > 100) {
      valid = false;
      message = "El descuento debe estar entre 1 y 100.";
    }
  
    if (parseInt(initialValues.limiteStock, 10) < 10) {
      valid = false;
      message = "El stock debe ser al menos 10.";
    }
  
    // Comparaciones de fechas como cadenas "yyyy-MM-dd"
    if (fechaInicio < todayFormatted) {
      valid = false;
      message = "La fecha de inicio no puede ser anterior a hoy.";
    } else if (fechaFin < todayFormatted) {
      valid = false;
      message = "La fecha de fin no puede ser anterior a hoy.";
    } else if (fechaFin < fechaInicio) {
      valid = false;
      message = "La fecha de fin no puede ser menor a la fecha de inicio.";
    }
  
    if (selectedProducts.length === 0) {
      valid = false;
      message = "Debe seleccionar al menos un producto.";
    }
  
    if (valid) {
      const payload = {
        titulo: initialValues.nombre,
        descripcion: initialValues.descripcion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        limiteStock: parseInt(initialValues.limiteStock, 10),
        porcentajeDescuento: parseFloat(initialValues.descuento),
        vi_productoIds: selectedProducts.map((product) => product.id),
      };
  
      try {
        console.log("Datos de la promoción:", payload);
        
        if (isEditMode) {
          // Llamar a la función de actualización si está en modo edición
          await updateDiscount();
        } else {
          // Llamar a la API de registro si no está en modo edición
          const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/descuento/registrar`, payload);
          setShowConfirmation(true);
          setFormError(false);
          setErrorMessage("");
          console.log("Descuento registrado:", response.data);
        }
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        setFormError(true);
        setErrorMessage("Error al procesar la solicitud. Por favor, intenta nuevamente.");
      }
    } else {
      setFormError(true);
      setErrorMessage(message);
    }
  };
  
  
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
  const handleProductSearch = (event) => {
    setSearchProduct(event.target.value);
  };

  const handleAddProduct = () => {
    const selectedProduct = availableProducts.find((product) => product.nombre === searchProduct);

    if (selectedProduct && !selectedProducts.includes(selectedProduct)) {
        setSelectedProducts([...selectedProducts, selectedProduct]);
        setSearchProduct("");
    }
  };

  const handleRemoveProduct = (productToRemove) => {
    setSelectedProducts(selectedProducts.filter((product) => product.id !== productToRemove.id));
  };

  const handleClose = () => {
    setShowConfirmation(false);
    router.push("/promociones/lista");
  };

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
                    {/*<option value="Oferta Especial">Oferta Especial</option>*/}
                    <option value="Descuento">Descuento</option>
                    {/*<option value="Paquete">Paquete</option>*/}
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
                    onChange={(e) => {
                      // Permitir solo números enteros positivos
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setInitialValues({ ...initialValues, limiteStock: value });
                      }
                    }}
                    onKeyPress={(e) => {
                      // Evitar ingreso de puntos, comas o caracteres inválidos
                      if (e.key === '.' || e.key === ',' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
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
                    {availableProducts.map((product) => (
                      <option key={product.id} value={product.nombre} />
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
                        <td>{product.nombre}</td>
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



