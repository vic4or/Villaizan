"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Modal, Alert } from "react-bootstrap";
import "./nuevaMultimedia.css";
import { useRouter, useSearchParams } from "next/navigation";


export default function NuevaMultimedia() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id); // Si hay un ID, estamos en modo edición

  const [formData, setFormData] = useState({
    imagen: "",
    tipo: "",
    descripcion: "",
    mensaje: "",
    videofile: "",
    videourl: "",
    fruta: "",
  });

  // Estados para almacenar la información de multimedia
  const [selectedFile, setSelectedFile] = useState(null);
  const [multimediaType, setMultimediaType] = useState("");
  const [description, setDescription] = useState("");
  const [educationalMessage, setEducationalMessage] = useState("");
  const [videoOption, setVideoOption] = useState(""); 
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [fruit, setFruit] = useState(""); 
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [fruitOptions, setFruitOptions] = useState([]);

  // Efecto para cargar datos en el modo de edición
  useEffect(() => {
    if (isEditMode) {
      const fetchMultimediaById = async (id) => {
        try {
          // Aquí deberías hacer una llamada a tu API para obtener los datos
          // Por ahora, usaremos los datos de ejemplo
          const multimedia = [
            { id: 1, fruit: "Manzana", description: "Introducción a la manzana y sus beneficios", type: "Video", url: "https://vid.com/manzana", status: "Activo" },
            { id: 2, fruit: "Plátano", description: "Información nutricional del plátano", type: "Información", message: "El plátano es una fruta tropical que destaca por su alto contenido de potasio.", status: "Inactivo" },
            { id: 3, fruit: "Naranja", description: "Video educativo sobre las naranjas", type: "Video", url: "https://vid.com/naranja", status: "Activo" },
            { id: 4, fruit: "Manzana verde", description: "La manzana verde en la cocina", type: "Información", message: "Las manzanas son una de las frutas más populares y saludables del mundo.", status: "Activo" },
            { id: 5, fruit: "Fresa", description: "Historia de la fresa: de la granja a tu mesa", type: "Video", url: "https://vid.com/fresa", status: "Inactivo" },
          ];
          const item = multimedia.find((multi) => multi.id === parseInt(id));

          const uniqueFruits = [...new Set(multimedia.map(item => item.fruit))];
          setFruitOptions(uniqueFruits);
          
          if (item) {
            setFormData({
              imagen: item.imagen || "",
              tipo: item.type || "",
              descripcion: item.description || "",
              mensaje: item.message || "",
              videofile: item.videoFile || "",
              videourl: item.url || "",
              fruta: item.fruit || "",
            });
            setMultimediaType(item.type === "Video" ? "video" : "informacion");
            setVideoOption(item.url.includes("http") ? "url" : "upload");
          }
        } catch (error) {
          console.error("Error al cargar los datos de multimedia:", error);
        }
      };

      fetchMultimediaById(id);
    }
    }, [isEditMode, id]);


    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setFormData(prevData => ({
        ...prevData,
        imagen: file
      }));
      setSelectedFile(file);
      setImageError(false);
    };

  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
    setVideoURL("");
    setVideoError(false); 
  };

  const handleTypeChange = (event) => {
    setMultimediaType(event.target.value);
    setVideoOption("");
    setVideoFile(null);
    setSelectedFile(null);
    setVideoURL("");
    setImageError(false);
    setVideoError(false);
  };

  const handleVideoOptionChange = (option) => {
    setVideoOption(option);
    if (option === "upload") {
      setVideoURL(""); 
    } else if (option === "url") {
      setVideoFile(null); 
    }
    setVideoError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;

    if (!description) {
      alert("La descripción es obligatoria.");
      valid = false;
    }

    if (multimediaType === "informacion" && !educationalMessage) {
      alert("El mensaje educativo es obligatorio.");
      valid = false;
    }

    if (multimediaType === "video") {
      if (videoOption === "upload" && !videoFile) {
        setVideoError(true);
        valid = false;
      } else if (videoOption === "url" && !videoURL) {
        setVideoError(true);
        valid = false;
      }
      if (!videoOption) {
        setVideoError(true);
        valid = false;
      }
    }

    if (!selectedFile) {
      setImageError(true);
      valid = false;
    }

    if (valid) {
      setShowConfirmation(true); 
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleClose = () => {
    setShowConfirmation(false);
    router.push("/pages/multimedia/lista");
  };

  return (
    <>
      <div>
        {/* Popup de confirmación */}
        <Modal show={showConfirmation} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>La multimedia se ha guardado exitosamente.</Modal.Body>
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
                {/* Control del Selector de Fruta */}
                <Form.Group className="mb-3">
                  <Form.Label>Fruta</Form.Label>
                  <Form.Select
                    aria-label="Selecciona una fruta"
                    className="form-select-custom"
                    required
                    value={formData.fruta}
                    onChange={handleInputChange}
                    >
                    <option value="">--Selecciona una fruta--</option>
                    {fruitOptions.map((fruit, index) => (
                      <option key={index} value={fruit}>{fruit}</option>
                    ))}
                    </Form.Select>
                </Form.Group>

                {/* Tipo de Multimedia */}
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    aria-label="Selecciona un tipo"
                    className="form-select-custom"
                    onChange={handleTypeChange}
                    required
                    value={multimediaType}
                  >
                    <option value="">--Selecciona un tipo--</option>
                    <option value="informacion">Información</option>
                    <option value="video">Video</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Descripción"
                    className="form-control-custom"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {/* Mostrar el Mensaje Educativo o la sección de Video */}
                {multimediaType === "informacion" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Mensaje educativo</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Ingresa el mensaje educativo..."
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      className="form-control-custom"
                      maxLength={400}
                      required
                    />
                    <Form.Text className="text-muted">Máximo 400 caracteres</Form.Text>
                  </Form.Group>
                )}

                {multimediaType === "video" && (
                  <div>
                    <h4>Video</h4>
                    <p>Sube un archivo de video o añade uno con una URL.</p>

                    <div className="d-flex justify-content-start mb-3">
                      <Button
                        variant={videoOption === "upload" ? "danger" : "outline-danger"}
                        className="btn-option me-2"
                        onClick={() => handleVideoOptionChange("upload")}
                      >
                        Subir archivo
                      </Button>
                      <Button
                        variant={videoOption === "url" ? "danger" : "outline-danger"}
                        className="btn-option"
                        onClick={() => handleVideoOptionChange("url")}
                      >
                        Insertar desde URL
                      </Button>
                    </div>

                    {videoError && (
                      <Alert variant="danger" className="mb-3">
                        Debes proporcionar un video o URL válido.
                      </Alert>
                    )}
                    {videoOption === "upload" && (
                      <div className="file-upload-box">
                        <label htmlFor="file-upload-video" className="custom-file-upload">
                          {videoFile ? (
                            <>
                              <span>{videoFile.name}</span>
                              <Button
                                variant="light"
                                className="ms-3"
                                onClick={() => setVideoFile(null)}
                              >
                                ✕
                              </Button>
                            </>
                          ) : (
                            <>
                              <span>Selecciona tu archivo</span>
                              <span>o suelta tu archivo aquí</span>
                            </>
                          )}
                          <input
                            id="file-upload-video"
                            type="file"
                            accept=".mp4"
                            onChange={handleVideoChange}
                            className="file-input"
                          />
                        </label>
                      </div>
                    )}

                    {videoOption === "url" && (
                      <Form.Group className="mb-3">
                        <div className="d-flex align-items-center">
                          <Form.Control
                            type="url"
                            placeholder="https://vid.com/mi-video"
                            value={formData.videourl}
                            onChange={handleInputChange}
                            className="form-control-custom"
                            required
                          />
                          {videoURL && (
                            <Button
                              variant="light"
                              className="ms-3"
                              onClick={() => setVideoURL("")}
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      </Form.Group>
                    )}
                  </div>
                )}
              </Col>

              {/* Sección de Imagen */}
              <Col md={6}>
                <h4>Imagen</h4>
                <div className="file-upload-box">
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {selectedFile ? (
                      <>
                        <span>{selectedFile.name}</span>
                        <Button
                          variant="light"
                          className="ms-3"
                          onClick={() => setSelectedFile(null)}
                        >
                          ✕
                        </Button>
                      </>
                    ) : (
                      <>
                        <span>Selecciona tu archivo</span>
                        <span>o suelta tu archivo aquí</span>
                      </>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept=".jpg, .png"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </label>
                </div>

                {imageError && (
                  <Alert variant="danger" className="mt-3">
                    Debes subir una imagen obligatoriamente.
                  </Alert>
                )}

                {selectedFile && (
                  <div className="mt-3 preview">
                    <h6>Vista previa:</h6>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Vista previa"
                      className="preview-image"
                    />
                  </div>
                )}
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
