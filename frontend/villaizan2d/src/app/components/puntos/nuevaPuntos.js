"use client";

import React, { useState } from "react";
import { Form, Button, Row, Col, Container, Modal, Alert } from "react-bootstrap";
import "./nuevaPuntos.css";

export default function NuevaMultimedia({ isEditMode = false, initialValues = {} }) {
  const [selectedFile, setSelectedFile] = useState(initialValues.image || null);
  const [multimediaType, setMultimediaType] = useState(initialValues.type || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [nombre, setNombre] = useState(initialValues.nombre || "");
  const [puntos, setPuntos] = useState(initialValues.puntos || "");    
  const [educationalMessage, setEducationalMessage] = useState(initialValues.message || "");
  const [videoOption, setVideoOption] = useState(""); 
  const [videoFile, setVideoFile] = useState(initialValues.videoFile || null);
  const [videoURL, setVideoURL] = useState(initialValues.videoURL || "");
  const [fruit, setFruit] = useState(initialValues.fruit || ""); // Estado para controlar la fruta seleccionada
  const [producto, setProducto] = useState(initialValues.producto || "");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;

    if (!nombre) {
      alert("El nombre es obligatorio.");
      valid = false;
    }

    if (!puntos) {
      alert("Los puntos son obligatorios.");
      valid = false;
    }

    if (valid) {
      setShowConfirmation(true); 
    }
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
          <Modal.Body>Los puntos se han guardado exitosamente.</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="breadcrumb-container">
          <p className="text-muted">Gestión del sistema &gt; Multimedia &gt; {isEditMode ? "Editar Multimedia" : "Nueva Multimedia"}</p>
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
          <h2 className="mb-4">{isEditMode ? "Editar Multimedia" : "Nueva Multimedia"}</h2>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <h4>Información general</h4>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    className="form-control-custom"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cantidad puntos</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Puntos"
                    className="form-control-custom"
                    value={puntos}
                    onChange={(e) => setPuntos(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Sección de Imagen */}
              <Col md={6}>
                <h4>Seleccionar producto</h4>
                {/* Control del Selector de Fruta */}
                <Form.Group className="mb-3">
                  <Form.Label>Producto</Form.Label>
                  <Form.Select
                    aria-label="Selecciona un producto"
                    className="form-select-custom"
                    required
                    value={fruit} // Enlazar el valor con el estado 'producto'
                    onChange={(e) => setFruit(e.target.value)} // Actualizar el estado al cambiar
                  >
                    <option value="">--Selecciona un producto--</option>
                    <option value="PaletaFresa">Paleta de fresa</option>
                    <option value="Mafeleta2Sabores">Mafeleta de 2 sabores</option>
                    <option value="Mafeleta3Sabores">Mafeleta de 3 sabores</option>
                    <option value="PaletaEspecialSandia">Paleta especial sabor de sandía</option>
                    <option value="PaletaGlaseadaFresa">Paleta glaseada de fresa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Botones para guardar y cancelar */}
            <div className="d-flex justify-content-end button-group">
              <Button variant="danger" type="submit" className="btn-custom me-2">
                {isEditMode ? "ACTUALIZAR" : "GUARDAR"}
              </Button>
              <Button variant="light" type="button" className="btn-cancel" onClick={() => alert("Acción cancelada")}>
                CANCELAR
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
}





