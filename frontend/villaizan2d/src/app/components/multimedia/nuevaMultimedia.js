"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Table,
  Modal,
  Alert,
} from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function NuevaMultimedia() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [frutas, setFrutas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [tipoContenido, setTipoContenido] = useState("Información");
  const [contenidoInformacion, setContenidoInformacion] = useState("");
  const [urlContenido, setUrlContenido] = useState("");
  const [selectedFruta, setSelectedFruta] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/fruta/listarTodos")
      .then((response) => {
        setFrutas(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos de frutas:", error);
      });

    if (id) {
      setIsEditing(true);
      axios
        .get(`http://localhost:3000/contenidoeducativo/listarTodos`)
        .then((response) => {
          const multimediaData = response.data.find((item) => item.id === id);
          if (multimediaData) {
            setTitulo(multimediaData.titulo);
            setTipoContenido(multimediaData.tipocontenido);
            setContenidoInformacion(multimediaData.contenidoinformacion || "");
            setUrlContenido(multimediaData.urlcontenido || "");
            setSelectedFruta(multimediaData.id_fruta);
            if (multimediaData.urlcontenido) {
              convertGoogleDriveUrl(multimediaData.urlcontenido);
            }
          }
        })
        .catch((error) => {
          console.error("Error al cargar los datos del multimedia:", error);
        });
    }
  }, [id]);

  const convertGoogleDriveUrl = (url) => {
    if (!url) {
      setPreviewUrl("");
      return;
    }

    let fileId = "";
    const fileFormat = url.match(/\/file\/d\/([^\/]+)/);
    const openFormat = url.match(/[?&]id=([^&]+)/);

    if (fileFormat) {
      fileId = fileFormat[1];
    } else if (openFormat) {
      fileId = openFormat[1];
    }

    if (fileId) {
      const embedUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      setPreviewUrl(embedUrl);
    } else {
      setPreviewUrl("");
      console.error("Formato de URL de Google Drive no válido");
    }
  };

  const handleUrlContentChange = (e) => {
    const url = e.target.value;
    setUrlContenido(url);
    if (tipoContenido === "Imagen") {
      convertGoogleDriveUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !selectedFruta) {
      setFormError(true);
      setErrorMessage("Todos los campos deben ser completados.");
      return;
    }

    const payload = {
      titulo,
      contenidoinformacion: tipoContenido === "Información" ? contenidoInformacion : null,
      tipocontenido: tipoContenido,
      urlcontenido: ["Video", "Imagen"].includes(tipoContenido) ? urlContenido : null,
      id_fruta: selectedFruta,
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/contenidoeducativo/editar/${id}`, payload);
      } else {
        await axios.post("http://localhost:3000/contenidoeducativo/registrar", payload);
      }

      setShowConfirmation(true);
      setFormError(false);
      setErrorMessage("");

      setTimeout(() => {
        setShowConfirmation(false);
        router.push("/pages/multimedia/lista");
      }, 3000);
    } catch (error) {
      console.error("Error al guardar el multimedia:", error);
      setFormError(true);
      setErrorMessage("Error al guardar el multimedia. Inténtalo de nuevo.");
    }
  };

  const renderContentField = () => {
    switch (tipoContenido) {
      case "Información":
        return (
          <Form.Group controlId="contenidoInformacion">
            <Form.Label>Mensaje Educativo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese el contenido informativo"
              value={contenidoInformacion}
              onChange={(e) => setContenidoInformacion(e.target.value)}
              required
            />
          </Form.Group>
        );
      case "Video":
        return (
          <Form.Group controlId="urlContenido">
            <Form.Label>URL del Video</Form.Label>
            <Form.Control
              type="url"
              placeholder="Ingrese la URL del video"
              value={urlContenido}
              onChange={handleUrlContentChange}
              required
            />
          </Form.Group>
        );
      case "Imagen":
        return (
          <Form.Group controlId="urlContenido">
            <Form.Label>URL de la imagen (Google Drive)</Form.Label>
            <Form.Control
              type="url"
              placeholder="Ingrese el enlace de Google Drive de la imagen"
              value={urlContenido}
              onChange={handleUrlContentChange}
              required
            />
            <Form.Text className="text-muted">
              Extensiones válidas: .jpg, .png
            </Form.Text>
          </Form.Group>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal show={showConfirmation} onHide={() => router.push("/pages/multimedia/lista")}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El contenido multimedia se ha {isEditing ? "actualizado" : "guardado"} exitosamente.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => router.push("/pages/multimedia/lista")}>
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
        <h2 className="mb-4">{isEditing ? "Editar Multimedia" : "Nueva Multimedia"}</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <h4>Información general</h4>
              <Form.Group className="mb-3">
                <Form.Label>Fruta</Form.Label>
                <Form.Select
                  value={selectedFruta}
                  onChange={(e) => setSelectedFruta(e.target.value)}
                  required
                >
                  <option value="">Seleccione una fruta</option>
                  {frutas.map((fruta) => (
                    <option key={fruta.id} value={fruta.id}>
                      {fruta.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Contenido</Form.Label>
                <Form.Select
                  value={tipoContenido}
                  onChange={(e) => setTipoContenido(e.target.value)}
                >
                  <option value="Información">Información</option>
                  <option value="Video">Video</option>
                  <option value="Imagen">Imagen</option>
                </Form.Select>
              </Form.Group>

              {renderContentField()}
            </Col>

            <Col md={6}>
                {tipoContenido === "Imagen" && (
                    <div className="preview-container" style={{ marginTop: '2rem' }}>
                        <p className="preview-label">Vista previa</p>
                        <div className="image-preview" style={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px',
                            minHeight: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Vista previa"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-image.png';
                                    }}
                                />
                            ) : (
                                <div style={{
                                    color: '#666',
                                    textAlign: 'center'
                                }}>
                                    No hay imagen para previsualizar
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Col>
          </Row>

          {formError && (
            <Alert variant="danger" className="mb-3">
              {errorMessage}
            </Alert>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="danger" type="submit" className="me-2">
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
            <Button
              variant="light"
              type="button"
              onClick={() => router.push("/pages/multimedia/lista")}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
