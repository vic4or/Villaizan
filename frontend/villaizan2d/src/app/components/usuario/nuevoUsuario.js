"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Modal,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NuevoUsuario() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("administrador"); // Valores posibles: "activo", "inactivo"
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !correo) {
      setFormError(true);
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }

    const payload = {
      nombre,
      apellido,
      correo,
      contrasena: "123456", // Contraseña predeterminada
      rol: rol === "administrador",
    };

    try {
      await axios.post("http://localhost:3000/usuarios/registrar", payload);
      setShowConfirmation(true);
      setFormError(false);
      setErrorMessage("");

      setTimeout(() => {
        setShowConfirmation(false);
        router.push("/pages/usuarios/lista");
      }, 3000);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setFormError(true);
      setErrorMessage("Error al guardar el usuario. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Modal
        show={showConfirmation}
        onHide={() => router.push("/pages/usuarios/lista")}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>El usuario ha sido registrado exitosamente.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => router.push("/pages/usuario/lista")}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

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
        <h2 className="mb-4">Nuevo Usuario</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese el correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="administrador">Administrador</option>
                  <option value="canjeador">Canjeador</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="text"
                  value="123456"
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                />
                <Form.Text className="text-muted">
                  Contraseña predeterminada: "123456".
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {formError && (
            <Alert variant="danger" className="mb-3">
              {errorMessage}
            </Alert>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="danger" type="submit" className="me-2">
              Guardar
            </Button>
            <Button
              variant="light"
              type="button"
              onClick={() => router.push("/pages/usuario/lista")}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
