"use client";

import React, { useState, useEffect } from "react";
import {Container,Row,Col,Button,InputGroup,FormControl,Table,Pagination,ButtonGroup,Modal} from "react-bootstrap";
import axios from "axios";

export default function ListadoCanje() {
    const [redenciones, setRedenciones] = useState([]); // Lista de redenciones
    const [searchTerm, setSearchTerm] = useState(""); // Para buscar por código
    const [viewType, setViewType] = useState("porCanjear"); // Estado del filtro: canjeado, porCanjear, vencido, todos
    const [currentPage, setCurrentPage] = useState(1); // Paginación
    const [showModal, setShowModal] = useState(false); // Estado del modal
    const [selectedRedencion, setSelectedRedencion] = useState(null); // Redención seleccionada
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchRedenciones = async () => {
            const response = await axios.get("http://localhost:3000/redencion/admin/listarTodos");
            console.log("Redenciones obtenidas:", response.data);
            setRedenciones(response.data);
        };
        fetchRedenciones();
    }, []);

    const handleCanjearClick = (redencion) => {
        setSelectedRedencion(redencion);
        setShowModal(true);
    };

    const fetchRedenciones = async () => {
        try {
            const response = await axios.get("http://localhost:3000/redencion/admin/listarTodos");
            console.log("Redenciones actualizadas:", response.data);
            setRedenciones(response.data);
        } catch (error) {
            console.error("Error al obtener las redenciones:", error);
        }
    };
    
    const handleConfirmCanje = async () => {
        try {
            console.log("ID seleccionado para canjear:", selectedRedencion.id); // Verificar ID
            const response = await axios.patch(
                `http://localhost:3000/redencion/admin/validar/${selectedRedencion.id}`
            );
            alert("El código ha sido canjeado exitosamente.");
            setRedenciones((prevRedenciones) =>
                prevRedenciones.map((item) =>
                    item.id === selectedRedencion.id
                        ? { ...item, estado: "Canjeado" }
                        : item
                )
            );
            await fetchRedenciones(); 
        } catch (error) {
            console.error("Error al canjear el código:", error.response?.data || error.message);
            alert(`Error al canjear el código: ${error.response?.data?.message || "Error desconocido"}`);
        } finally {
            setShowModal(false);
            setSelectedRedencion(null);
        }
    };
    
    const filteredRedenciones = redenciones
    .filter((item) => {
        if (viewType === "canjeado") return item.estado.toLowerCase() === "canjeado";
        if (viewType === "porCanjear") return item.estado.toLowerCase() === "por canjear";
        if (viewType === "vencido") return item.estado.toLowerCase() === "vencido";
        return true; // Mostrar todos
    })
    .filter((item) =>
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por código
    );

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRedenciones.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRedenciones.length / itemsPerPage);

    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Redenciones</h4>
                    <p className="text-muted">Administra las redenciones realizadas por los clientes.</p>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <ButtonGroup>
                        <Button
                            variant={viewType === "porCanjear" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("porCanjear")}
                        >
                            Por Canjear
                        </Button>
                        <Button
                            variant={viewType === "canjeado" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("canjeado")}
                        >
                            Canjeado
                        </Button>
                        <Button
                            variant={viewType === "vencido" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("vencido")}
                        >
                            Vencido
                        </Button>
                        <Button
                            variant={viewType === "todos" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("todos")}
                        >
                            Todos
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>ID Cliente</th>
                        <th style={{ textAlign: "center" }}>Puntos Canjeados</th>
                        <th style={{ textAlign: "center" }}>Fecha Generación</th>
                        <th style={{ textAlign: "center" }}>Fecha Redención</th>
                        <th style={{ textAlign: "center" }}>Fecha Vencimiento</th>
                        <th style={{ textAlign: "center" }}>Usuario Canjeador</th>
                        <th style={{ textAlign: "left" }}>Productos</th>
                        <th style={{ textAlign: "center" }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            <td style={{ textAlign: "center" }}>
                                {item.vi_usuario.vi_persona.numerodocumento}
                            </td>
                            <td style={{ textAlign: "center" }}>{item.puntoscanjeado}</td>
                            <td style={{ textAlign: "center" }}>{formatFecha(item.fechageneracion)}</td>
                            <td style={{ textAlign: "center" }}>
                                {item.fecharedencion ? formatFecha(item.fecharedencion) : "-"}
                            </td>
                            <td style={{ textAlign: "center" }}>{formatFecha(item.fechaexpiracion)}</td>
                            <td style={{ textAlign: "center" }}>
                                {item.estado.toLowerCase() === "canjeado" ? "admin" : "-"}
                            </td>
                            <td style={{ textAlign: "left" }}>
                                {item.vi_detalleredencion.map((detalle) => (
                                    <div key={detalle.id}>{detalle.vi_producto.nombre}</div>
                                ))}
                            </td>
                            <td className="text-center">
                                {item.estado.toLowerCase() === "por canjear" ? (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleCanjearClick(item)}
                                    >
                                        {item.estado}
                                    </Button>
                                ) : (
                                    <Button
                                        variant={
                                            item.estado.toLowerCase() === "vencido"
                                                ? "danger"
                                                : "primary"
                                        }
                                        size="sm"
                                        disabled
                                    >
                                        {item.estado}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>


            <Pagination>
                <Pagination.Prev
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Canje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRedencion && (
                        <>
                            <p>
                                <strong>Nombre del cliente:</strong> {selectedRedencion.vi_usuario.nombre} {selectedRedencion.vi_usuario.apellido}
                            </p>
                            <p>
                                <strong>DNI:</strong> {selectedRedencion.vi_usuario.vi_persona.numerodocumento}
                            </p>
                            <p>
                                <strong>Código de canje:</strong> {selectedRedencion.codigo}
                            </p>
                            <p>
                                <strong>Productos:</strong>
                            </p>
                            <ul>
                                {selectedRedencion.vi_detalleredencion.map((detalle) => (
                                    <li key={detalle.id}>{detalle.vi_producto.nombre}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmCanje}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}
