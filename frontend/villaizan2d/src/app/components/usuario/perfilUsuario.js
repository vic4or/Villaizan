"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PerfilPersonal() {
  const router = useRouter();
  
  // Estado para la información del perfil
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    correo: "",
  });

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar la información del perfil del administrador logueado
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/usuarios/perfil"
        ); // Asegúrate de que este endpoint devuelva el perfil del usuario logueado
        setPerfil(response.data);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  // Manejar la actualización de información personal
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!perfil.nombre || !perfil.apellido || !perfil.correo) {
      setFormError(true);
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }

    try {
      await axios.put("http://localhost:3000/usuarios/actualizarPerfil", perfil);
      setSuccessMessage("Perfil actualizado exitosamente.");
      setFormError(false);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setFormError(true);
      setErrorMessage("Error al actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  // Manejar el cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!nuevaContrasena || nuevaContrasena !== confirmarContrasena) {
      setFormError(true);
      setErrorMessage("Las contraseñas no coinciden o están vacías.");
      return;
    }

    try {
      await axios.put("http://localhost:3000/usuarios/cambiarContrasena", {
        contrasena: nuevaContrasena,
      });
      setSuccessMessage("Contraseña cambiada exitosamente.");
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setFormError(false);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setFormError(true);
      setErrorMessage("Error al cambiar la contraseña. Inténtalo de nuevo.");
    }
  };

  return (
    <Container
      style={{
        background: "#ffffff",
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "30px",
        marginTop: "30px",
        maxWidth: "95%",
      }}
    >
      <h2 className="mb-4">Perfil Personal</h2>

      {/* Mensajes de error y éxito */}
      {formError && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Formulario para información personal */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                value={perfil.nombre}
                onChange={(e) =>
                  setPerfil({ ...perfil, nombre: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su apellido"
                value={perfil.apellido}
                onChange={(e) =>
                  setPerfil({ ...perfil, apellido: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={perfil.correo}
                onChange={(e) =>
                  setPerfil({ ...perfil, correo: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button variant="danger" type="submit" className="me-2">
            Guardar Cambios
          </Button>
        </div>
      </Form>

      <hr />

      {/* Formulario para cambio de contraseña */}
      <h4 className="mb-4">Cambiar Contraseña</h4>
      <Form onSubmit={handleChangePassword}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme su contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button variant="danger" type="submit" className="me-2">
            Cambiar Contraseña
          </Button>
        </div>
      </Form>
    </Container>
  );
}
