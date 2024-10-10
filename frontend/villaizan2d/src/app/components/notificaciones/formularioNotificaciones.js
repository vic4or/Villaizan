"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Alert , Modal} from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import "./formularioNotificaciones.css";

export default function FormularioNotificacion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id); // Si hay un ID, estamos en modo edición

  const promociones = [
    { id: 1, nombre: "Helado gratis", tipo: "Oferta Especial", descripcion: "Obtén un 100% de descuento en un helado por día de fundación de helados Villizan", fechaInicio: "27/09/24", fechaFin: "27/10/24", descuento: "100%", estado: "Activo" },
    { id: 2, nombre: "50% de Descuento", tipo: "Paquete", descripcion: "Obtén un 30% de descuento en total por llevarte este paquete", fechaInicio: "28/09/24", fechaFin: "28/10/24", descuento: "30%", estado: "Activo" },
    { id: 3, nombre: "Combo Familiar", tipo: "Paquete", descripcion: "10% de descuento por llevar tres sabores diferentes", fechaInicio: "28/09/24", fechaFin: "28/10/24", descuento: "10%", estado: "Inactivo" },
    { id: 4, nombre: "Helado Natural", tipo: "Oferta Especial", descripcion: "Obtén un 50% de descuento por un helado por día de las frutas", fechaInicio: "29/09/24", fechaFin: "29/10/24", descuento: "50%", estado: "Activo" },
    { id: 5, nombre: "2x1 en helados en chocolate", tipo: "Descuento", descripcion: "Llévate 2 helados al 50% de descuento", fechaInicio: "30/09/24", fechaFin: "30/10/24", descuento: "50%", estado: "Activo" },
  ];

  const [initialValues, setInitialValues] = useState({
    asunto: "",
    tipo: "",
    mensaje: "",
    promocion: "",
    enviarPorCorreo: true, // Activado por defecto
    activo: isEditMode ? true : false, // Activado solo en modo edición
  });

  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Simular la búsqueda de la notificación por ID
  const fetchNotificationById = (id) => {
    const notificaciones = [
      {
        id: 1,
        asunto: "¡Descuento Exclusivo!",
        tipo: "Oferta Especial",
        mensaje: "Estimado PlaceHolder, ¡Descuento Exclusivo! Aprovecha nuestra Oferta Especial válida hasta el 2024-10-02",
        promocion: "Paleta de fresa gratis",
        enviarPorCorreo: true,
        activo: true,
      },
      {
        id: 2,
        asunto: "Promoción de Temporada",
        tipo: "Descuentos",
        mensaje: "Estimado PlaceHolder, ¡Promoción de Temporada! Aprovecha nuestra Puntos Dobles válida hasta el 2024-10-10",
        promocion: "Mafeleta de 3 sabores al 50%",
        enviarPorCorreo: false,
        activo: false,
      },
    ];
    return notificaciones.find((notif) => notif.id === parseInt(id));
  };

  useEffect(() => {
    if (isEditMode) {
      const notification = fetchNotificationById(id);
      if (notification) {
        setInitialValues({
          asunto: notification.asunto,
          tipo: notification.tipo,
          mensaje: notification.mensaje,
          promocion: notification.promocion, 
          enviarPorCorreo: notification.enviarPorCorreo,
          activo: notification.activo,
        });
      }
    }
  }, [isEditMode, id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!initialValues.asunto || !initialValues.tipo || !initialValues.mensaje) {
      setFormError(true);
      setErrorMessage("Todos los campos obligatorios deben ser completados.");
      return;
    }

    setFormError(false);
    setErrorMessage("");
    // Aquí se guardaría la notificación (crear o actualizar)
    router.push("/pages/notificaciones/lista");
  };

  const handleClose = () => {
    setShowConfirmation(false);
    router.push("/pages/notificaciones/lista");
  };

  return (
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
      <h2 className="mb-4">{isEditMode ? "Editar Notificación" : "Nueva Notificación"}</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={6}>
            <h4>Información general</h4>
            {/* Asunto de la Notificación */}
            <Form.Group className="mb-3">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Asunto de la notificación"
                value={initialValues.asunto}
                onChange={(e) => setInitialValues({ ...initialValues, asunto: e.target.value })}
                required
              />
            </Form.Group>

            {/* Tipo de Notificación */}
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                onChange={(e) => setInitialValues({ ...initialValues, tipo: e.target.value })}
                required
                value={initialValues.tipo}
              >
                <option value="">Selecciona un tipo</option>
                <option value="Oferta Especial">Oferta Especial</option>
                <option value="Descuentos">Descuentos</option>
                <option value="Expiración de Puntos">Expiración de Puntos</option>
              </Form.Select>
            </Form.Group>

            {/* Mensaje de la Notificación */}
            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mensaje de la notificación"
                value={initialValues.mensaje}
                onChange={(e) => setInitialValues({ ...initialValues, mensaje: e.target.value })}
                required
              />
            </Form.Group>
          </Col>

          {/* Sección de Promoción */}
          <Col md={6}>
            <h4>Agregar promoción</h4>
            <Form.Group className="mb-3">
            <Form.Label>Promoción</Form.Label>
            <Form.Select
                onChange={(e) => setInitialValues({ ...initialValues, promocion: e.target.value })}
                value={initialValues.promocion || ""}
            >
                <option value="">Selecciona una promoción</option>
                {promociones.map((promo) => (
                <option key={promo.id} value={promo.nombre}>
                    {promo.nombre}
                </option>
                ))}
            </Form.Select>
            </Form.Group>

            {/* Opciones adicionales */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="enviarPorCorreo"
                label="Enviar por correo"
                checked={initialValues.enviarPorCorreo}
                onChange={(e) => setInitialValues({ ...initialValues, enviarPorCorreo: e.target.checked })}
                className="custom-switch-red"
                />
            </Form.Group>
            {isEditMode && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="activo"
                  label="Activo"
                  checked={initialValues.activo}
                  onChange={(e) => setInitialValues({ ...initialValues, activo: e.target.checked })}
                  className="custom-switch-red"
                />
              </Form.Group>
            )}
          </Col>
        </Row>

        {formError && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}

        {/* Botones para guardar y cancelar */}
        <div className="d-flex justify-content-end button-group">
          <Button variant="danger" type="submit" className="me-2">
            {isEditMode ? "ACTUALIZAR" : "GUARDAR"}
          </Button>
          <Button variant="light" type="button" onClick={() => router.back()}>
            CANCELAR
          </Button>
        </div>
      </Form>
    </Container>
    </div>
  );
}
