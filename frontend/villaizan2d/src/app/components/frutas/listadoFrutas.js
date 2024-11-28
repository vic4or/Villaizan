"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Table, Pagination, ButtonGroup, Modal } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 
import { useRouter } from "next/navigation"; 
import axios from "axios"; 
import * as XLSX from "xlsx";

export default function ListadoFrutas() {
    const router = useRouter();

    const [frutas, setFrutas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewType, setViewType] = useState("activos"); // "todos", "activos" o "inactivos"
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [selectedFruta, setSelectedFruta] = useState(null); // Fruta seleccionada para inactivar


    useEffect(() => {
        const fetchFrutas = async () => {
            try {
                const frutasResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/listarTodos`);
                setFrutas(frutasResponse.data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchFrutas();
    }, []);

    useEffect(() => {
        fetchFrutas();
    }, []);

    // Función para truncar texto
    const truncateText = (text, maxLength = 30) => {
        if (!text) return ''; // Si text es null o undefined, retorna una cadena vacía
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };

    const formatFechaHora = (fechaString) => {
        const fecha = new Date(fechaString);
        const fechaFormateada = fecha.toLocaleDateString();
        const horaFormateada = fecha.toLocaleTimeString();
        return { fechaFormateada, horaFormateada };
    };

    // Filtrar frutas según el estado y la búsqueda
    const filteredFrutas = frutas
        .filter((item) => {
            if (viewType === "activos") return item.estaactivo === true;
            if (viewType === "inactivos") return item.estaactivo === false;
            return true; // "todos" muestra todos los registros
        })
        .filter((item) => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFrutas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFrutas.length / itemsPerPage);

    const fetchFrutas = async () => {
        try {
            const frutasResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/listarTodos`);
            setFrutas(frutasResponse.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    const handleDeleteConfirmation = (idFruta) => {
        setSelectedFruta(idFruta);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!selectedFruta) return;

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/fruta/inactivar/${selectedFruta}`);
            const updatedFrutas = frutas.map((item) =>
                item.id === selectedFruta ? { ...item, estaactivo: false } : item
            );
            setFrutas(updatedFrutas);            
            setShowModal(false); // Cerrar el modal
        } catch (error) {
            console.error("Error al inactivar la fruta:", error);
            alert("Error al inactivar la fruta. Inténtalo de nuevo.");
        }
    };

    const handleExport = () => {
        const worksheetData = filteredFrutas.map((item) => {
            const productosRelacionados = item.vi_producto_fruta && Array.isArray(item.vi_producto_fruta) && item.vi_producto_fruta.length > 0
            ? item.vi_producto_fruta.map(p => p.vi_producto ? p.vi_producto.nombre : "Producto sin nombre").join(", ")
            : "No tiene productos";
            return {
                Nombre: item.nombre,
                Descripción: item.descripcion,
                Productos: productosRelacionados,
                Usuario: item.usuario,
                "Fecha de Actualización": item.fechaActualizacion,
                "Hora de Actualización": item.horaActualizacion,
                Estado: item.estaactivo ? "Activo" : "Inactivo",
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Frutas");
        XLSX.writeFile(workbook, "frutas_export.xlsx");
    };

    return (
        <Container fluid style={{ marginLeft: "60px", maxWidth: "95%" }}>
            <Row className="mb-4">
                <Col>
                    <h4>Frutas</h4>
                    <p className="text-muted">Administra las frutas, sus descripciones y productos relacionados.</p>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <ButtonGroup>
                        <Button
                            variant={viewType === "activos" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("activos")}
                        >
                            Activos
                        </Button>
                        <Button
                            variant={viewType === "inactivos" ? "danger" : "outline-danger"}
                            onClick={() => setViewType("inactivos")}
                        >
                            Inactivos
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

            <Row className="mb-4" style={{ position: 'relative', zIndex: 1 }}>
                <Col>
                    <InputGroup>
                        <FormControl
                            placeholder="Buscar por nombre de fruta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={8}></Col>
                <Col md={4} className="d-flex justify-content-end align-items-start">
                    <Button variant="danger" className="me-2" onClick={() => router.push("/frutas/nuevo")}>+ Agregar</Button>
                    <Button variant="outline-danger" onClick={handleExport}>Exportar</Button>
                </Col>
            </Row>

            <Table hover>
                <thead>
                    <tr>
                        <th style={{ width: "21%" , textAlign: "left" }}>Id Fruta</th>
                        <th style={{ width: "15%" , textAlign: "left"}}>Nombre</th>
                        <th style={{ width: "15%" , textAlign: "left"}}>Historia</th>
                        <th style={{ width: "15%" , textAlign: "left"}}>Productos</th>
                        <th style={{ width: "10%" , textAlign: "center" }}>Usuario Actualización</th>
                        <th style={{ width: "8%" , textAlign: "center" }}>Fecha Actualización</th>
                        <th style={{ width: "8%" , textAlign: "center" }}>Hora Actualización</th>
                        <th style={{ width: "8%" , textAlign: "center" }}>Acciones</th>
                        <th style={{ width: "8%" , textAlign: "center" }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                {currentItems.map((item) => {
                    const { fechaFormateada, horaFormateada } = formatFechaHora(item.actualizadoen);
                    const productosRelacionados = item.vi_producto_fruta && Array.isArray(item.vi_producto_fruta) && item.vi_producto_fruta.length > 0
                    ? item.vi_producto_fruta.map(p => p.vi_producto ? p.vi_producto.nombre : "Producto sin nombre").join(", ")
                    : "No tiene productos";
            
                    return (
                        <tr key={item.id}>
                            <td style={{ textAlign: "left" }}>{item.id}</td>
                            <td style={{ textAlign: "left" }}>{item.nombre}</td>
                            <td style={{ textAlign: "left" }}>{truncateText(item.descripcion, 30)}</td>
                            <td style={{ textAlign: "left" }}>{truncateText(productosRelacionados, 30)}</td> {/* Truncar también productos */}
                            <td style={{ textAlign: "center" }}>admin</td>
                            <td style={{ textAlign: "center" }}>{fechaFormateada}</td>
                            <td style={{ textAlign: "center" }}>{horaFormateada}</td>
                            <td className="text-center">
                                <Button variant="outline-primary" size="sm" onClick={() => router.push(`/frutas/editar?id=${item.id}`)}>
                                    <FaEdit />
                                </Button>
                            </td>
                            <td className="text-center">
                                <Button 
                                    variant={item.estaactivo ? "success" : "danger"} 
                                    size="sm"
                                    onClick={() => handleDeleteConfirmation(item.id)}
                                >
                                    {item.estaactivo ? "Activo" : "Inactivo"}
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            </Table>

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Inactivación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas inactivar esta fruta? 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Inactivar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Pagination style={{ position: 'relative', zIndex: 1 }}>
                <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>
        </Container>
    );
}
