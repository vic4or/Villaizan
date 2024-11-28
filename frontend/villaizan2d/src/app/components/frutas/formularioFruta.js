"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, InputGroup, FormControl, Table, Modal, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

export default function FormularioFruta({ isEditMode, frutaId }) { 
  console.log("Fruta ID:", frutaId); 
  const router = useRouter();

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

  const [productosParaAgregar, setProductosParaAgregar] = useState([]);
  const [productosParaQuitar, setProductosParaQuitar] = useState([]);
  const [frutasActivas, setFrutasActivas] = useState([]);
  const [hasChanges, setHasChanges] = useState(false); 


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/productos/listarTodos`);
        setProductos(response.data);
      } catch (err) {
        console.error("Error al obtener los productos:", err);
        setErrorMessage("Hubo un error al cargar los productos.");
      }
    };

    const fetchFrutasActivas = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/listarTodos`);
        const frutas = response.data.filter((fruta) => fruta.estaactivo); 
        setFrutasActivas(frutas);
      } catch (err) {
        console.error("Error al obtener las frutas activas:", err);
      }
    };

    fetchFrutasActivas();
    fetchProductos();
  }, []);

  useEffect(() => {
    if (searchProduct) {
      const filtered = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchProduct.toLowerCase())
      );
      setFilteredProductos(filtered);
    } else {
      setFilteredProductos(productos); // Muestra todos los productos si no hay búsqueda
    }
  }, [searchProduct, productos]);
  
  useEffect(() => {
    if (isEditMode && frutaId) {
      const fetchFrutaById = async () => {
        try {
          const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/editar/${frutaId}`, {
            nombre: "",
            descripcion: "",
            productosParaAgregar: [],
            productosParaQuitar: []
          });
          const fruta = response.data;
  
          setInitialValues({
            nombre: fruta.nombre,
            descripcion: fruta.descripcion,
            productos: fruta.vi_producto_fruta,
          });
          setSelectedProducts(fruta.vi_producto_fruta || []);
        } catch (error) {
          console.error("Error al obtener la fruta:", error);
        }
      };
  
      fetchFrutaById();
    }
  }, [isEditMode, frutaId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!initialValues.nombre || !initialValues.descripcion) {
      setFormError(true);
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }

    if (!hasChanges) {
      alert("No se han realizado cambios.");
      return;
    }

    // Validar duplicado de nombre (normalizando texto)
    const nombreNormalizado = initialValues.nombre.trim().toLowerCase();
    const nombreDuplicado = frutasActivas.some(
      (fruta) => fruta.nombre.trim().toLowerCase() === nombreNormalizado
    );
    if (nombreDuplicado) {
      setFormError(true);
      setErrorMessage("Ya existe una fruta activa con este nombre.");
      return;
    }

    try {
      const payload = {
        nombre: initialValues.nombre,
        descripcion: initialValues.descripcion,
        productosParaAgregar,
        productosParaQuitar,
      };

      if (isEditMode) {
        await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/editar/${frutaId}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/registrar`, payload);
      }

      setShowConfirmation(true);
      setFormError(false);
      setErrorMessage("");
      setHasChanges(false); // Resetear cambios después de guardar

      setTimeout(() => {
        setShowConfirmation(false);
        router.push("/frutas/lista");
      }, 3000);
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
    if (product && !selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      setProductosParaAgregar([...productosParaAgregar, product.id]);

      setProductosParaQuitar(productosParaQuitar.filter((id) => id !== product.id));
      setSearchProduct("");
      setHasChanges(true); 
    }
  };

  const handleRemoveProduct = (product) => {
    setSelectedProducts((prevSelectedProducts) => 
      prevSelectedProducts.filter((item) => item.id_producto !== product.id_producto)
    );
    
    if (!productosParaQuitar.includes(product.id_producto)) {
      setProductosParaQuitar((prevProductosParaQuitar) => [
        ...prevProductosParaQuitar,
        product.id_producto,
      ]);
    }
  
    setProductosParaAgregar((prevProductosParaAgregar) =>
      prevProductosParaAgregar.filter((id) => id !== product.id_producto)
    );
  
    setHasChanges(true);
  };
  


  const handleClose = () => {
    setShowConfirmation(false);
    router.push("/frutas/lista");
  };

  const [filteredProductos, setFilteredProductos] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false); // Controlar si se muestra el dropdown


  const dropdownStyle = {
    maxHeight: "150px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1000,
    width: "100%",
  };
  

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
                    onChange={(e) => {
                      setInitialValues({ ...initialValues, nombre: e.target.value });
                      setHasChanges(true);
                    }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Historia</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción de la fruta..."
                    className="form-control-custom"
                    value={initialValues.descripcion}
                    onChange={(e) => {
                      setInitialValues({ ...initialValues, descripcion: e.target.value });
                      setHasChanges(true);
                    }}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h4>Agregar productos</h4>
                <div style={{ position: "relative" }}>
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Buscar producto"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      onFocus={() => setShowDropdown(true)} // Muestra el dropdown al hacer clic
                    />
                  </InputGroup>

                  {showDropdown && (
                    <div style={dropdownStyle}>
                      {filteredProductos.length > 0 ? (
                        filteredProductos.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              handleAddProduct(product); // Lógica para agregar el producto
                              setShowDropdown(false); // Oculta el dropdown después de seleccionar
                              setSearchProduct(""); // Limpia el término de búsqueda
                            }}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: "white",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {product.nombre}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "8px" }}>No se encontraron productos.</div>
                      )}
                    </div>
                  )}
                </div>

                <h5>Listado final</h5>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Productos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((product) => (
                      <tr key={product.id}>
                      <td>{product.vi_producto?.nombre || product.nombre || "Producto sin nombre"}</td>
                      <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveProduct(product)}
                      >
                        <FaTrashAlt />
                      </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No hay productos seleccionados</td>
                    </tr>
                  )}
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
