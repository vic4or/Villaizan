"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import * as XLSX from "xlsx";

export default function ListadoPuntos() {
    const router = useRouter();
    /* const [puntos, setPuntos] = useState([
        { id: 1, product: "Helado de Fresa", description: "Información de los puntos del Helado de Fresa", point: 25, status: "Activo" },
        { id: 2, product: "Helado de Coco", description: "Información de los puntos del Helado de Coco", point: 50, status: "Inactivo" },
        { id: 3, product: "Helado de Maracumango", description: "Información de los puntos del Helado de Maracumango", point: 60, status: "Activo" },
        { id: 4, product: "Helado de Aguaje", description: "Información de los puntos del Helado de Aguaje", point: 75, status: "Activo" },
        { id: 5, product: "Helado de Uva", description: "Información de los puntos del Helado de Uva", point: 30, status: "Inactivo" },
    ]); */
    const [puntos, setPuntos] = useState([
        { id: 1, name: "Helado de Fresa",product: "Helado de Fresa", point: 25, status: "Activo" },
        { id: 2, name: "Helado de Coco",product: "Helado de Coco", point: 50, status: "Inactivo" },
        { id: 3, name: "Helado de Maracumango",product: "Helado de Maracumango", point: 60, status: "Activo" },
        { id: 4, name: "Helado de Aguaje",product: "Helado de Aguaje", point: 75, status: "Activo" },
        { id: 5, name: "Helado de Uva",product: "Helado de Uva", point: 30, status: "Inactivo" },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("Activo");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null); // Estado para el producto seleccionado
    const [newPoints, setNewPoints] = useState(""); // Estado para el nuevo valor de puntos
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const itemsPerPage = 5;

    // Filtrado de puntos según el estado seleccionado (Activo/Inactivo)
    const filteredPuntos = puntos
        .filter((item) => item.status === viewType)
        .filter((item) => item.product.toLowerCase().includes(searchTerm.toLowerCase())); // Búsqueda por nombre de fruta

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPuntos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPuntos.length / itemsPerPage);

    const handleEdit = (product) => {
        setSelectedProduct(product); // Guardar el producto seleccionado
        setShowModal(true); // Mostrar el modal
    };    

    const handleClose = () => {
        setShowModal(false); // Cerrar el modal
        setNewPoints(""); // Limpiar el valor de los puntos nuevos
    };

    const handleSave = () => {
        // Aquí puedes manejar la lógica para guardar los puntos nuevos
        console.log(`Producto: ${selectedProduct.product}, Valor nuevo: ${newPoints}`);
        handleClose();
    };

    const handleExport = () => {
        const worksheetData = filteredPuntos.map((item) => ({
          ID: item.id,
          Nombre: item.name,
          Producto: item.fruit,
          Puntos: item.puntos,
          Estado: item.status,
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Puntos");
        XLSX.writeFile(workbook, "puntos_export.xlsx");
    };      

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
        <Row className="mb-4">
            <Col>
            <h4>Puntos</h4>
            <p className="text-muted">Administra los puntos conformado por los productos, descripción y puntos.</p>
            </Col>
        </Row>

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

        <Row className="mb-3">
            <Col>
            <InputGroup>
                <FormControl
                placeholder="Buscar por producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
            </Col>
        </Row>

        <Row className="mb-4">
            <Col md={8}></Col>
            <Col md={4} className="d-flex justify-content-end align-items-start">
            <Button variant="outline-secondary" className="me-2">Filtrar</Button>
            <Button variant="danger" className="me-2" onClick={() => router.push("/pages/puntos/nuevo")}>+ Agregar</Button>
            <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
            </Col>
        </Row>

        <Table hover>
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Producto</th>
                <th>Puntos</th>
                <th className="text-center">Opciones</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.map((item) => (
                <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.product}</td>
                <td>{item.point}</td>
                <td className="text-center">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                        <FaEdit /> Editar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => alert(`Eliminando ${item.product}`)}>
                        <FaTrashAlt /> Eliminar
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>

        <Row>
            <Col className="d-flex justify-content-between">
            <span>Mostrando {indexOfFirstItem + 1} a {indexOfLastItem} de {filteredPuntos.length} producto(s)</span>
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

        {/* Modal para Editar Puntos */}
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Puntos por Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Producto: <strong>{selectedProduct?.product}</strong></p>
                <p>Valor anterior: <strong>{selectedProduct?.point}</strong></p>
                <InputGroup>
                    <InputGroup.Text>Nuevo valor:</InputGroup.Text>
                    <FormControl
                        type="number"
                        value={newPoints}
                        onChange={(e) => setNewPoints(e.target.value)}
                        placeholder="Ingresa el nuevo valor de puntos"
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Volver</Button>
                <Button variant="danger" onClick={handleSave}>Continuar</Button>
            </Modal.Footer>
        </Modal>

        </Container>
    );
}

