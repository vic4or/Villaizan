"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination , ButtonGroup} from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importar íconos para Editar y Eliminar
import { useRouter } from "next/navigation"; // Usar el router de Next.js
import Link from "next/link"; // Importar el componente Link de Next.js



export default function ListadoMultimedia() {
    const router = useRouter();
    // Estado inicial con datos de multimedia
    const [multimedia, setMultimedia] = useState([
        { id: 1, fruit: "Manzana", description: "Introducción a la manzana y sus beneficios", type: "Video", url: "https://vid.com/manzana", status: "Activo" },
        { id: 2, fruit: "Plátano", description: "Información nutricional del plátano", type: "Información", url: "El plátano es una fruta tropical que destaca por su alto contenido de potasio.", status: "Inactivo" },
        { id: 3, fruit: "Naranja", description: "Video educativo sobre las naranjas", type: "Video", url: "https://vid.com/naranja", status: "Activo" },
        { id: 4, fruit: "Manzana verde", description: "La manzana verde en la cocina", type: "Información", url: "Las manzanas son una de las frutas más populares y saludables del mundo.", status: "Activo" },
        { id: 5, fruit: "Fresa", description: "Historia de la fresa: de la granja a tu mesa", type: "Video", url: "https://vid.com/fresa", status: "Inactivo" },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("Activo");
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    // Filtrado de multimedia según el estado seleccionado (Activo/Inactivo)
    const filteredMultimedia = multimedia
        .filter((item) => item.status === viewType)
        .filter((item) => item.fruit.toLowerCase().includes(searchTerm.toLowerCase())); // Búsqueda por nombre de fruta

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMultimedia.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMultimedia.length / itemsPerPage);

    const handleEdit = (id) => {
        router.push(`/multimedia/editar/?id=${id}`);
      };      

    const handleAddNew = () => {
        router.push("/multimedia/nuevo");
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
        {/* Breadcrumb y Filtro de Activos/Inactivos */}
        <Row className="mb-4">
            <Col>
            <h4>Multimedia</h4>
            <p className="text-muted">Administra la multimedia conformado por la fruta, descripción, tipo, imagen e información/URL.</p>
            </Col>
        </Row>

        {/* Filtro de Activos e Inactivos */}
        <Row className="mb-3">
            <Col>
            <ButtonGroup>
                <Button
                variant={viewType === "Activo" ? "danger" : "outline-danger"}
                style={{
                    backgroundColor: viewType === "Activo" ? "rgba(230, 57, 70, 0.8)" : "transparent",
                    borderColor: "rgba(230, 57, 70, 0.6)",
                    color: viewType === "Activo" ? "#fff" : "rgba(230, 57, 70, 0.8)",
                }}
                onClick={() => setViewType("Activo")}
                >
                Activos
                </Button>
                <Button
                variant={viewType === "Inactivo" ? "danger" : "outline-danger"}
                style={{
                    backgroundColor: viewType === "Inactivo" ? "rgba(230, 57, 70, 0.8)" : "transparent",
                    borderColor: "rgba(230, 57, 70, 0.6)",
                    color: viewType === "Inactivo" ? "#fff" : "rgba(230, 57, 70, 0.8)",
                }}
                onClick={() => setViewType("Inactivo")}
                >
                Inactivos
                </Button>
            </ButtonGroup>
            </Col>
        </Row>

        {/* Barra de Búsqueda */}
        <Row className="mb-3">
            <Col>
            <InputGroup>
                <FormControl
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
            </Col>
        </Row>

        {/* Barra de Acciones */}
        <Row className="mb-4">
            <Col md={8}></Col>
            <Col md={4} className="d-flex justify-content-end align-items-start">
            <Button variant="outline-secondary" className="me-2">Filtrar</Button>
            <Button variant="danger" className="me-2" onClick={handleAddNew}>+ Agregar</Button>
            <Button variant="outline-danger">Exportar</Button>
            </Col>
        </Row>

        {/* Tabla de Multimedia */}
        <Table hover>
            <thead>
            <tr>
                <th>Fruta</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Información/URL</th>
                <th className="text-center">Opciones</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.map((item) => (
                <tr key={item.id}>
                <td>{item.fruit}</td>
                <td>{item.description}</td>
                <td>{item.type}</td>
                <td>
                    {item.url.includes("http") ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.url}
                    </a>
                    ) : (
                    item.url
                    )}
                </td>
                <td className="text-center">
                    {/* Botones de Edición y Eliminación */}
                    <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(item.id)}
                    >
                    <FaEdit /> Editar
                    </Button>
                    <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => alert(`Eliminando ${item.fruit}`)}
                    >
                    <FaTrashAlt /> Eliminar
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>

        {/* Paginador */}
        <Row>
            <Col className="d-flex justify-content-between">
            <span>Mostrando {indexOfFirstItem + 1} a {indexOfLastItem} de {filteredMultimedia.length} producto(s)</span>
            <Pagination>
                <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </Pagination.Item>
                ))}
                <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                />
            </Pagination>
            </Col>
        </Row>
        </Container>
  );
}
