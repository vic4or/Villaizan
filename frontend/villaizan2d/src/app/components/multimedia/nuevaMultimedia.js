"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function NuevaMultimedia() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Obtenemos el ID de los parámetros de la URL

    const [frutas, setFrutas] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [tipoContenido, setTipoContenido] = useState("Información");
    const [contenidoInformacion, setContenidoInformacion] = useState("");
    const [urlContenido, setUrlContenido] = useState("");
    const [selectedFruta, setSelectedFruta] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Cargar lista de frutas desde la API
        axios.get("http://localhost:3000/fruta/listarTodos")
            .then((response) => {
                setFrutas(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar los datos de frutas:", error);
            });

        // Si estamos en modo de edición, cargar los datos del multimedia existente
        if (id) {
            setIsEditing(true);
            axios.get(`http://localhost:3000/contenidoeducativo/listarTodos`)
                .then((response) => {
                    const multimediaData = response.data.find((item) => item.id === id);
                    if (multimediaData) {
                        setTitulo(multimediaData.titulo);
                        setTipoContenido(multimediaData.tipocontenido);
                        setContenidoInformacion(multimediaData.contenidoinformacion || "");
                        setUrlContenido(multimediaData.urlcontenido || "");
                        setSelectedFruta(multimediaData.id_fruta);
                    }
                })
                .catch((error) => {
                    console.error("Error al cargar los datos del multimedia:", error);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear el payload dependiendo del tipo de contenido
        const payload = {
            titulo,
            contenidoinformacion: tipoContenido === "Información" ? contenidoInformacion : null,
            tipocontenido: tipoContenido,
            urlcontenido: tipoContenido === "Video" ? urlContenido : null,
            id_fruta: selectedFruta
        };

        try {
            if (isEditing) {
                // Agregar console.log para depurar el ID
                console.log("ID para actualizar:", id); // Log del ID

                // Actualizar el multimedia existente
                const response = await axios.put(
                    `http://localhost:3000/contenidoeducativo/editar/${id}`, // URL de actualización con ID
                    payload
                );
                console.log("Multimedia actualizada con éxito:", response.data);
                alert("Multimedia actualizada exitosamente");
            } else {
                // Crear un nuevo multimedia
                const response = await axios.post(
                    "http://localhost:3000/contenidoeducativo/registrar",
                    payload
                );
                console.log("Multimedia creada con éxito:", response.data);
                alert("Multimedia creada exitosamente");
            }
            router.push("/pages/multimedia/lista"); // Redirigir a la lista de multimedia después de guardar
        } catch (error) {
            console.error("Error al guardar el multimedia:", error);
            alert("Hubo un error al guardar el multimedia");
        }
    };

    return (
        <Container>
            <Row className="mb-4">
                <Col>
                    <h4>{isEditing ? "Editar Multimedia" : "Nueva Multimedia"}</h4>
                    <p className="text-muted">Completa el formulario para {isEditing ? "editar" : "agregar"} un contenido multimedia.</p>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="titulo">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el título"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="tipoContenido">
                            <Form.Label>Tipo de Contenido</Form.Label>
                            <Form.Select
                                value={tipoContenido}
                                onChange={(e) => setTipoContenido(e.target.value)}
                            >
                                <option value="Información">Información</option>
                                <option value="Video">Video</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="idFruta">
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
                    </Col>
                </Row>

                <Row className="mb-3">
                    {tipoContenido === "Información" ? (
                        <Col>
                            <Form.Group controlId="contenidoInformacion">
                                <Form.Label>Mensaje Educativo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Ingrese el contenido informativo"
                                    value={contenidoInformacion}
                                    onChange={(e) => setContenidoInformacion(e.target.value)}
                                    required={tipoContenido === "Información"}
                                />
                            </Form.Group>
                        </Col>
                    ) : (
                        <Col>
                            <Form.Group controlId="urlContenido">
                                <Form.Label>URL del Video</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="Ingrese la URL del video"
                                    value={urlContenido}
                                    onChange={(e) => setUrlContenido(e.target.value)}
                                    required={tipoContenido === "Video"}
                                />
                            </Form.Group>
                        </Col>
                    )}
                </Row>

                <Button variant="primary" type="submit">
                    {isEditing ? "Actualizar" : "Guardar"}
                </Button>
                <Button variant="secondary" className="ms-2" onClick={() => router.push("/pages/multimedia/lista")}>
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
}





                 









